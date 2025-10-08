from rest_framework import serializers
from .models import Event, Team, Membership

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'  # Or specify the fields you want to expose

class TeamSerializer(serializers.ModelSerializer):
    owner = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Team
        # It's best practice to explicitly list fields instead of using '__all__'
        fields = [
            'id',
            'name',
            'description',
            'event',
            'owner',  # The read-only field we just defined
            'max_size',
            'required_skills',
            'is_open',
            'created_at',
            'current_size', # Include your @property fields
            'is_full'       # Include your @property fields
        ]
        # You can also mark property fields from the model as read_only here
        read_only_fields = ['current_size', 'is_full']

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