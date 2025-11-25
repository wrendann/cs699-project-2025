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
import numpy as np

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

    def perform_update(self, serializer):
        """
        Override perform_update to mark event embedding dirty when
        descriptive fields change (name, description, location).
        """
        instance = serializer.instance

        # Always mark embedding dirty on any update (no checks)
        instance.mark_embedding_dirty()
        instance.save(update_fields=['embedding_needs_update'])

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
    
    @action(detail=False, methods=['get'], url_path='recommended')
    def recommended(self, request):
        """
        Return top 5 events recommended for the current user based on cosine
        similarity between the user's embedding and each event's embedding.
        GET /events/recommended/
        """
        user = request.user
        # Ensure user has an embedding accessor
        try:
            user_vec = user.get_embedding_array()
        except Exception:
            # If something is wrong with the user/embed, return empty list
            return Response([], status=status.HTTP_200_OK)

        user_norm = np.linalg.norm(user_vec.astype(float))

        # Recommend only upcoming/current events (same as list view)
        now = timezone.now()
        events_qs = Event.objects.filter(end_date__gte=now)

        scored = []  # list of (score, event)
        for ev in events_qs:
            try:
                ev_vec = ev.get_embedding_array()
            except Exception:
                # If event has bad embedding, treat similarity as 0
                scored.append((0.0, ev))
                continue

            ev_norm = np.linalg.norm(ev_vec.astype(float))
            if user_norm == 0 or ev_norm == 0:
                sim = 0.0
            else:
                sim = float(np.dot(user_vec, ev_vec) / (user_norm * ev_norm))

            # Clip numerical noise to [-1, 1]
            sim = max(-1.0, min(1.0, sim))
            scored.append((sim, ev))

        # Sort by similarity descending and take top 5
        scored.sort(key=lambda x: x[0], reverse=True)
        top_events = [e for _, e in scored[:5]]

        serializer = self.get_serializer(top_events, many=True)
        return Response(serializer.data)
    
