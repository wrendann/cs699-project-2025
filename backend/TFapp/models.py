import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.utils import timezone
import os

def get_profile_pic_upload_path(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid.uuid4()}.{ext}'
    return os.path.join('profile_pics', filename)

class User(AbstractUser):
    """
    Custom User model extending Django's AbstractUser.
    Stores user profile information, including skills and interests,
    to facilitate team matching.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    bio = models.TextField(max_length=500, blank=True)
    skills = models.CharField(max_length=255, blank=True, help_text="Comma-separated list of skills")
    interests = models.CharField(max_length=255, blank=True, help_text="Comma-separated list of interests")
    location = models.CharField(max_length=100, blank=True)
    profile_picture = models.ImageField(upload_to=get_profile_pic_upload_path, null=True, blank=True)


    # Add related_name to avoid clashes with the default User model
    groups = models.ManyToManyField(
        Group,
        verbose_name='groups',
        blank=True,
        help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
        related_name="custom_user_set",
        related_query_name="user",
    )
    user_permissions = models.ManyToManyField(
        Permission,
        verbose_name='user permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        related_name="custom_user_set",
        related_query_name="user",
    )

    def __str__(self):
        return self.username

class Event(models.Model):
    """
    Represents an event or competition for which teams can be formed.
    Includes details about the event name, description, date, and location.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    description = models.TextField()
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    location = models.CharField(max_length=200)
    # organizer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='organized_events')
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.name

class Team(models.Model):
    """
    Represents a team formed for a specific event.
    Links to the event, the team owner, and manages team-specific details
    like required skills and team size.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    description = models.TextField(max_length=500)
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='teams')
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_teams')
    max_size = models.PositiveIntegerField(default=5)
    required_skills = models.CharField(max_length=255, blank=True, help_text="Comma-separated list of required skills")
    is_open = models.BooleanField(default=True, help_text="Is the team currently looking for members?")
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.name} for {self.event.name}"

    @property
    def current_size(self):
        """Returns the current number of members in the team."""
        # We only count accepted members towards the team size.
        return self.members.filter(status=Membership.MemberStatus.ACCEPTED).count()

    @property
    def is_full(self):
        """Checks if the team has reached its maximum size."""
        return self.current_size >= self.max_size

class Membership(models.Model):
    """
    Acts as a through model to manage the many-to-many relationship
    between Users and Teams. It stores the user's role and their
    join status (e.g., pending, accepted, rejected).
    """
    class MemberStatus(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        ACCEPTED = 'ACCEPTED', 'Accepted'
        REJECTED = 'REJECTED', 'Rejected'
        INVITED = 'INVITED', 'Invited'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='memberships')
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='members')
    role = models.CharField(max_length=100, blank=True, help_text="User's role in the team (e.g., Developer, Designer)")
    status = models.CharField(
        max_length=10,
        choices=MemberStatus.choices,
        default=MemberStatus.PENDING
    )
    joined_at = models.DateTimeField(auto_now_add=True)
    is_admin = models.BooleanField(default=False, help_text="Indicates if the user is an admin of the team.")

    class Meta:
        unique_together = ('user', 'team') # A user can only join a team once

    def __str__(self):
        return f"{self.user.username} in {self.team.name} ({self.get_status_display()})"

