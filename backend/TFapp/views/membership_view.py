from rest_framework import viewsets, status, mixins
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django.core.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
from ..models import Event, Team, Membership, User
from ..serializers import (
    EventSerializer, TeamSerializer, MembershipSerializer, 
    PublicUserProfileSerializer, EventDetailSerializer, TeamDetailSerializer
)
# Note: We no longer need the custom permission classes for this viewset

# We inherit from ListModelMixin (for 'list') and GenericViewSet
# This gives us more control and disables retrieve, update, destroy, create
class MembershipViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    
    queryset = Membership.objects.all()
    serializer_class = MembershipSerializer
    # We set a simple default. Permissions will be checked
    # manually inside each action.
    permission_classes = [IsAuthenticated]

    def _get_membership(self, team_pk, user_id):
        """
        Helper to find a specific membership using team and user.
        """
        return get_object_or_404(
            Membership, 
            team_id=team_pk, 
            user_id=user_id
        )

    def _get_team(self, team_pk):
        """
        Helper to find the team.
        """
        return get_object_or_404(Team, pk=team_pk)

    def get_queryset(self):
        """
        This viewset is nested, so it will receive a 'team_pk' 
        from the URL. We use it to filter the memberships for the 'list' action.
        """
        team_pk = self.kwargs.get('team_pk')
        if team_pk:
            return Membership.objects.filter(team_id=team_pk)
        return Membership.objects.none() # Don't list all memberships globally

    # --- Actions for Team Owner ---

    @action(detail=False, methods=['post'])
    def accept(self, request, team_pk=None):
        """
        Team owner accepts a 'PENDING' join request.
        Expects: { "user_id": "..." }
        """
        team = self._get_team(team_pk)
        if team.owner != request.user:
            raise PermissionDenied("You are not the owner of this team.")
            
        user_id = request.data.get('user_id')
        if not user_id:
            return Response({'error': 'user_id is required.'}, status=status.HTTP_400_BAD_REQUEST)

        membership = self._get_membership(team_pk, user_id)
        
        if membership.status != Membership.MemberStatus.PENDING:
            return Response({'error': 'This request is not pending.'}, status=status.HTTP_400_BAD_REQUEST)
        
        membership.status = Membership.MemberStatus.ACCEPTED
        membership.save()
        return Response(self.get_serializer(membership).data)

    @action(detail=False, methods=['post'])
    def reject(self, request, team_pk=None):
        """
        Team owner rejects a 'PENDING' join request.
        Expects: { "user_id": "..." }
        """
        team = self._get_team(team_pk)
        if team.owner != request.user:
            raise PermissionDenied("You are not the owner of this team.")

        user_id = request.data.get('user_id')
        if not user_id:
            return Response({'error': 'user_id is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        membership = self._get_membership(team_pk, user_id)
        
        if membership.status != Membership.MemberStatus.PENDING:
            return Response({'error': 'This request is not pending.'}, status=status.HTTP_400_BAD_REQUEST)
        
        membership.status = Membership.MemberStatus.REJECTED
        membership.save() # Or membership.delete()
        return Response(self.get_serializer(membership).data)

    @action(detail=False, methods=['patch'])
    def update_role(self, request, team_pk=None):
        """
        Team owner updates the role of an 'ACCEPTED' member.
        Expects: { "user_id": "...", "role": "New Role" }
        """
        team = self._get_team(team_pk)
        if team.owner != request.user:
            raise PermissionDenied("You are not the owner of this team.")

        user_id = request.data.get('user_id')
        role = request.data.get('role')
        if not all([user_id, role]):
            return Response({'error': 'user_id and role are required.'}, status=status.HTTP_400_BAD_REQUEST)
            
        membership = self._get_membership(team_pk, user_id)
        
        if membership.status != Membership.MemberStatus.ACCEPTED:
             return Response({'error': 'Can only change role for accepted members.'}, status=status.HTTP_400_BAD_REQUEST)

        membership.role = role
        membership.save()
        return Response(self.get_serializer(membership).data)

    @action(detail=False, methods=['post'])
    def kick(self, request, team_pk=None):
        """
        Team owner kicks a member.
        Expects: { "user_id": "..." }
        """
        team = self._get_team(team_pk)
        if team.owner != request.user:
            raise PermissionDenied("You are not the owner of this team.")
            
        user_id = request.data.get('user_id')
        if not user_id:
            return Response({'error': 'user_id is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        if str(request.user.id) == str(user_id):
            return Response({'error': 'Owner cannot kick themselves.'}, status=status.HTTP_400_BAD_REQUEST)
            
        membership = self._get_membership(team_pk, user_id)
        membership.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    # --- Actions for Member Itself ---

    @action(detail=False, methods=['post'])
    def leave(self, request, team_pk=None):
        """
        The authenticated user leaves the team.
        Does not expect a body.
        """
        team = self._get_team(team_pk)
        if team.owner == request.user:
            return Response({'error': 'Owner cannot leave. Delete team or transfer ownership.'}, status=status.HTTP_400_BAD_REQUEST)
            
        # Find the membership for the *requesting user*
        membership = self._get_membership(team_pk, request.user.id)
        membership.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['post'])
    def accept_invitation(self, request, team_pk=None):
        """
        A user accepts an 'INVITED' status membership.
        Acts on the user making the request.
        """
        # Find the membership for the *requesting user*
        membership = self._get_membership(team_pk, request.user.id)
        
        if membership.status != Membership.MemberStatus.INVITED:
            return Response({'error': 'This is not a pending invitation.'}, status=status.HTTP_400_BAD_REQUEST)
        
        membership.status = Membership.MemberStatus.ACCEPTED
        membership.save()
        return Response(self.get_serializer(membership).data)

    @action(detail=False, methods=['post'])
    def reject_invitation(self, request, team_pk=None):
        """
        A user rejects an 'INVITED' status membership.
        Acts on the user making the request.
        """
        # Find the membership for the *requesting user*
        membership = self._get_membership(team_pk, request.user.id)
        
        if membership.status != Membership.MemberStatus.INVITED:
            return Response({'error': 'This is not a pending invitation.'}, status=status.HTTP_400_BAD_REQUEST)
        
        membership.delete() # Or set to REJECTED, your choice
        return Response(status=status.HTTP_204_NO_CONTENT)