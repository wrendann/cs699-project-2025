from rest_framework import serializers
from .models import Event, Team, Membership

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'  # Or specify the fields you want to expose

class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = '__all__'

class MembershipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Membership
        fields = '__all__'

from django.contrib.auth import get_user_model

# Get the User model
UserModel = get_user_model()

class UserDetailsSerializer(serializers.ModelSerializer):
    """
    Serializer for the User model.
    Specifies the fields to be returned in the API response.
    """
    class Meta:
        model = UserModel
        # Define the fields you want to include in the response
        fields = ('pk', 'username', 'email', 'first_name', 'last_name')
        read_only_fields = ('email', ) # Email should not be updatable through this serializer