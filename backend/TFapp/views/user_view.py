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
from rest_framework.parsers import MultiPartParser, FormParser

from ..models import Event, Team, Membership, User
from ..serializers import EventSerializer, TeamSerializer, MembershipSerializer, PublicUserProfileSerializer, EventDetailSerializer, TeamDetailSerializer, UserProfileUpdateSerializer
from ..permissions import IsTeamOwner, IsMemberItself, IsTeamOwnerOrMemberItself

class UserProfileViewSet(viewsets.ReadOnlyModelViewSet):
    """
    A viewset for viewing user profiles.
    
    Provides:
    - `list` action: GET /api/users/
    - `retrieve` action: GET /api/users/<uuid:id>/
    """
    queryset = User.objects.all().order_by('username')
    serializer_class = PublicUserProfileSerializer
    
    # Specify the lookup field, as your PK is 'id' (a UUID)
    lookup_field = 'id' 
    
    # Set permissions: e.g., only logged-in users can see profiles.
    # Use IsAuthenticatedOrReadOnly if you want anonymous users to see profiles.
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser,)

    @action(detail=True, methods=['patch'], permission_classes=[IsAuthenticated])
    def update_profile(self, request, id=None):
        user = self.get_object()
        if user != request.user:
            raise PermissionDenied("You do not have permission to update this profile.")
        serializer = UserProfileUpdateSerializer(user, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            user = serializer.save()

            user.mark_embedding_dirty()
            user.save(update_fields=['embedding_needs_update'])

            public = PublicUserProfileSerializer(user, context={'request': request})
            return Response(public.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated])
    def teams(self, request, id=None):
        """
        Fetch all teams that the user is part of.
        """
        user = self.get_object()
        memberships = Membership.objects.filter(user=user)
        teams = [membership.team for membership in memberships]
        serializer = TeamSerializer(teams, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
