# permissions.py
from rest_framework import permissions
from .models import Membership

class IsTeamOwner(permissions.BasePermission):
    """
    Allows access only to the owner of the team associated with the Membership.
    """
    def has_object_permission(self, request, view, obj):
        # Assumes the 'obj' is a Membership instance
        return obj.owner == request.user

class IsMemberItself(permissions.BasePermission):
    """
    Allows access only to the user associated with the Membership.
    """
    def has_object_permission(self, request, view, obj):
        if not request.user.is_authenticated:
            return False
            
        return Membership.objects.filter(
            team=obj,
            user=request.user,
            status=Membership.MemberStatus.ACCEPTED
        ).exists()

class IsTeamOwnerOrMemberItself(permissions.BasePermission):
    """
    Allows access to the team owner OR the member itself.
    """
    def has_object_permission(self, request, view, obj):
        if not request.user.is_authenticated:
            return False
        
        if obj.owner == request.user:
            return True
        
        return Membership.objects.filter(
            team=obj,
            user=request.user,
            status=Membership.MemberStatus.ACCEPTED
        ).exists()