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

from ..models import Event, Team, Membership, User
from ..serializers import EventSerializer, TeamSerializer, MembershipSerializer, PublicUserProfileSerializer, EventDetailSerializer, TeamDetailSerializer
from ..permissions import IsTeamOwner, IsMemberItself, IsTeamOwnerOrMemberItself


class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        print(self.request.user)
        # serializer.save(owner=self.request.user)
        return super().perform_create(serializer)
    
    def get_serializer_class(self):
        """
        Choose the serializer based on the action.
        """
        if self.action == 'retrieve':
            # For the detail view (e.g., /api/events/<id>/)
            return EventDetailSerializer
        
        # For the list view (e.g., /api/events/)
        return EventSerializer