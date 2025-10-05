from django.urls import path
from . import views
from rest_framework.routers import DefaultRouter
from .views import EventViewSet, TeamViewSet, MembershipViewSet



urlpatterns = [
    path('hello/', views.say_hello, name='say_hello'),
]

router = DefaultRouter()
router.register(r'events', EventViewSet, basename='event')
router.register(r'teams', TeamViewSet, basename='team')
router.register(r'memberships', MembershipViewSet, basename='membership')

# HTTP Method	URL Pattern	Action/Description
# GET	/events/	List all Event objects.
# POST	/events/	Create a new Event object. (Data in body)
# GET	/events/{pk}/	Retrieve a single Event by its primary key.
# PUT	/events/{pk}/	Fully update a single Event. (All fields)
# PATCH	/events/{pk}/	Partially update a single Event. (Some fields)
# DELETE	/events/{pk}/	Delete a single Event.

# eg: GET http://127.0.0.1:8000/TFapp/events/

urlpatterns += router.urls

