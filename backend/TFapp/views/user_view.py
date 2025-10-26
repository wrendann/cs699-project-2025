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

# def loginPage(request):
#     if request.method == 'POST':
#         username = request.POST.get('username')
#         password = request.POST.get('password')
#         print(username, password)

#         try:
#             user = User.objects.get(username=username)
#         except:
#             messages.error(request, 'User does not exist')
#             print('User does not exist')
        
#         user = authenticate(request, username=username, password=password)
#         if user is not None:
#             login(request, user)
#             return
#         else:
#             messages.error(request, 'Username or Password is incorrect')

#         user
