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

class EventDetailSerializer(serializers.ModelSerializer):
    """
    The detailed serializer for a *single* Event.
    This includes the nested list of teams.
    """
    # This is the magic part. 'teams' is the related_name on your
    # Team.event ForeignKey. We use the TeamSerializer to render them.
    teams = TeamSerializer(many=True, read_only=True)

    class Meta:
        model = Event
        fields = [
            'id', 
            'name', 
            'description', 
            'start_date', 
            'end_date', 
            'location', 
            'created_at',
            'teams',  # The nested list of teams will appear here
        ]


class TeamDetailSerializer(serializers.ModelSerializer):
    """
    Provides a detailed view of a single team, including member lists.
    - 'approved_members' is visible to everyone.
    - 'pending_requests' is only visible to team members and the owner.
    """
    # Show usernames instead of IDs for owner/event
    owner = serializers.SlugRelatedField(slug_field='username', read_only=True)
    event = serializers.SlugRelatedField(slug_field='name', read_only=True)

    # Use model properties
    current_size = serializers.IntegerField(read_only=True)
    is_full = serializers.BooleanField(read_only=True)

    # Our two custom member lists
    approved_members = serializers.SerializerMethodField()
    pending_requests = serializers.SerializerMethodField()
    pending_invites = serializers.SerializerMethodField()

    has_been_rejected = serializers.SerializerMethodField()
    has_been_invited = serializers.SerializerMethodField()

    class Meta:
        model = Team
        fields = [
            'id', 'name', 'description', 'event', 'owner', 
            'max_size', 'current_size', 'is_full', 'required_skills',
            'is_open', 'created_at',
            'approved_members',
            'pending_requests',
            'pending_invites',
            'has_been_rejected',
            'has_been_invited'
        ]

    def get_approved_members(self, obj):
        """
        Gets all 'ACCEPTED' members for this team.
        'obj' is the Team instance.
        """
        # 'members' is the related_name from Membership.team
        accepted_memberships = obj.members.filter(
            status=Membership.MemberStatus.ACCEPTED
        )
        # Serialize the list of Membership objects
        return MembershipSerializer(accepted_memberships, many=True).data

    def get_pending_requests(self, obj):
        """
        Gets all 'PENDING' members, but only if the user making
        the request is already an accepted member or the owner.
        """
        # Get the request object from the serializer's context
        request = self.context.get('request')

        # If we can't get a user, return an empty list
        if not request or not hasattr(request, 'user') or not request.user.is_authenticated:
            return []

        user = request.user
        
        # Permission check: Is the current user the owner?
        is_owner = (obj.owner == user)
        
        # Permission check: Is the current user an accepted member?
        is_accepted_member = obj.members.filter(
            user=user, 
            status=Membership.MemberStatus.ACCEPTED
        ).exists()

        pending_memberships = obj.members.filter(
            status=Membership.MemberStatus.PENDING
        )
        # If they are the owner OR an accepted member, show pending requests
        if is_owner or is_accepted_member:
            return MembershipSerializer(pending_memberships, many=True).data
        

        # If the requesting user has their own pending request, return only that
        user_pending = pending_memberships.filter(user=user)
        if user_pending.exists():
            return MembershipSerializer(user_pending, many=True).data

        # Otherwise, return an empty list
        return []
    
    def get_pending_invites(self, obj):
        """
        Gets all 'INVITED' members, but only if the user making
        the request is already an accepted member or the owner.
        """
        # Get the request object from the serializer's context
        request = self.context.get('request')

        # If we can't get a user, return an empty list
        if not request or not hasattr(request, 'user') or not request.user.is_authenticated:
            return []

        user = request.user
        
        # Permission check: Is the current user the owner?
        is_owner = (obj.owner == user)
        
        # Permission check: Is the current user an accepted member?
        is_accepted_member = obj.members.filter(
            user=user, 
            status=Membership.MemberStatus.ACCEPTED
        ).exists()

        # If they are the owner OR an accepted member, show pending invites
        if is_owner or is_accepted_member:
            invited_memberships = obj.members.filter(
                status=Membership.MemberStatus.INVITED
            )
            return MembershipSerializer(invited_memberships, many=True).data

        # Otherwise, return an empty list
        return []
    
    def get_has_been_rejected(self, obj):
        """
        return true if the requesting user has been rejected from this team.
        """
        request = self.context.get('request')

        # If we can't get a user, return an empty list
        if not request or not hasattr(request, 'user') or not request.user.is_authenticated:
            return False

        user = request.user
        is_rejected_member = obj.members.filter(
            user=user, 
            status=Membership.MemberStatus.REJECTED
        ).exists()

        return is_rejected_member
    
    def get_has_been_invited(self, obj):
        """
        return true if the requesting user has been invited to this team.
        """
        request = self.context.get('request')

        # If we can't get a user, return an empty list
        if not request or not hasattr(request, 'user') or not request.user.is_authenticated:
            return False

        user = request.user
        is_invited_member = obj.members.filter(
            user=user, 
            status=Membership.MemberStatus.INVITED
        ).exists()

        return is_invited_member
            
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

class PublicUserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for public-facing user profile data.
    """
    class Meta:
        model = UserModel
        # List only the fields that are safe to be publicly visible
        fields = [
            'id', 
            'username', 
            'bio', 
            'skills', 
            'interests', 
            'location', 
            'profile_picture',
            'date_joined' # 'date_joined' is also a common safe field
        ]
        read_only_fields = fields # Ensure all fields are read-only