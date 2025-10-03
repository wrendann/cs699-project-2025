from django.urls import path
from . import views
from rest_framework.routers import DefaultRouter
from .views import EventViewSet


urlpatterns = [
    path('hello/', views.say_hello, name='say_hello'),
]

router = DefaultRouter()
router.register(r'events', EventViewSet, basename='event')

urlpatterns += router.urls

