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
from django.utils import timezone

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

    def get_queryset(self):
        """Return default queryset based on action.

        - default list (GET /events/) returns currently running/future events
          (now <= end_date)
        - other actions / retrieve use full queryset or their own logic
        """
        now = timezone.now()
        if self.action == 'list':
            return Event.objects.filter(end_date__gte=now)

        return Event.objects.all()

    @action(detail=False, methods=['get'], url_path='past')
    def past(self, request):
        """Return events that have already ended (end_date < now).
            GET /events/past/ 
        """
        now = timezone.now()
        qs = Event.objects.filter(end_date__lt=now).order_by('-end_date')
        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='all')
    def all(self, request):
        """Return every event without filtering (special endpoint).
            GET /events/all/ 
        """
        qs = Event.objects.all().order_by('-start_date')
        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)