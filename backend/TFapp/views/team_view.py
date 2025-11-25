from django.shortcuts import render
from django.contrib import messages
from django.http import HttpResponse
from django.contrib.auth import authenticate, login, logout
from django.core.exceptions import PermissionDenied

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import PermissionDenied, ValidationError
from django.utils import timezone

from ..models import Event, Team, Membership, User
from ..serializers import EventSerializer, TeamSerializer, MembershipSerializer, PublicUserProfileSerializer, EventDetailSerializer, TeamDetailSerializer
from ..permissions import IsTeamOwner, IsMemberItself, IsTeamOwnerOrMemberItself


class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer: TeamSerializer):
        # Prevent creating teams for events that have already ended
        event = serializer.validated_data.get('event')
        if event and event.end_date < timezone.now():
            raise ValidationError({'error': 'Cannot create a team for an event that has already ended.'})

        print(self.request.user)
        serializer.save(owner=self.request.user)

    def get_serializer_class(self):
        """
        Use TeamDetailSerializer for 'retrieve' (detail) view
        and TeamListSerializer for 'list' view.
        """
        if self.action == 'retrieve':
            return TeamDetailSerializer
        return TeamSerializer
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def join(self, request, pk=None):
        """
        A user requests to join this team.
        Creates a 'PENDING' membership.
        """
        team = self.get_object()
        
        # Check if membership already exists
        if Membership.objects.filter(team=team, user=request.user).exists():
            return Response({'error': 'You are already a member or have a pending request.'}, status=status.HTTP_400_BAD_REQUEST)
        
        membership_status=Membership.MemberStatus.PENDING
        if IsTeamOwner().has_object_permission(request, self, team):
            membership_status = Membership.MemberStatus.ACCEPTED

        membership = Membership.objects.create(
            team=team, 
            user=request.user,
            status=membership_status
        )
        serializer = MembershipSerializer(membership, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], permission_classes=[IsTeamOwner])
    def invite(self, request, pk=None):
        """
        A team owner invites a user to the team.
        Creates an 'INVITED' membership.
        """
        team = self.get_object()
        user_id = request.data.get('user_id')
        user_name = request.data.get('user_name')
        
        if not user_id and not user_name:
            return Response({'error': 'user_id or user_name is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            if user_id:
                user_to_invite = User.objects.get(id=user_id)
            else:
                user_to_invite = User.objects.get(username=user_name)
        except User.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        # If the user has a rejected membership, delete it before creating a new one
        rejected_membership = Membership.objects.filter(team=team, user=user_to_invite, status=Membership.MemberStatus.REJECTED)
        if rejected_membership.exists():
            rejected_membership.delete()

        # Check if membership already exists
        if Membership.objects.filter(team=team, user=user_to_invite).exists():
            return Response({'error': 'This user is already a member or has a pending status.'}, status=status.HTTP_400_BAD_REQUEST)


        membership_status=Membership.MemberStatus.INVITED
        if user_to_invite == team.owner:
            membership_status = Membership.MemberStatus.ACCEPTED

        membership = Membership.objects.create(
            team=team,
            user=user_to_invite,
            status=membership_status
        )
        serializer = MembershipSerializer(membership, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def partial_update(self, request, *args, **kwargs):
        """
        Allow partial updates to a team, restricted to admins or the owner.
        Prevent editing of id, name, created_at, and event fields.
        """
        team = self.get_object()

        # Check if the user is the owner or an admin
        if request.user != team.owner and not Membership.objects.filter(
            team=team, user=request.user, is_admin=True, status=Membership.MemberStatus.ACCEPTED
        ).exists():
            raise PermissionDenied("You do not have permission to edit this team.")

        # Restrict editing of certain fields
        restricted_fields = {'id', 'name', 'created_at', 'event'}
        for field in restricted_fields:
            if field in request.data:
                return Response({"error": f"Editing '{field}' is not allowed."}, status=status.HTTP_400_BAD_REQUEST)

        response = super().partial_update(request, *args, **kwargs)

        team = self.get_object()
        team.mark_embedding_dirty()
        team.save(update_fields=['embedding_needs_update'])

        return response