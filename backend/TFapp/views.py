from django.shortcuts import render
from django.contrib import messages
from django.http import HttpResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout

from rest_framework import viewsets
from .models import Event, Team, Membership
from .serializers import EventSerializer, TeamSerializer, MembershipSerializer

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer

class MembershipViewSet(viewsets.ModelViewSet):
    queryset = Membership.objects.all()
    serializer_class = MembershipSerializer


# Create your views here.
def say_hello(request):
    return HttpResponse('Hello world')


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
