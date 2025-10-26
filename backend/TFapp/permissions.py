# permissions.py
from rest_framework import permissions

class IsTeamOwner(permissions.BasePermission):
    """
    Allows access only to the owner of the team associated with the Membership.
    """
    def has_object_permission(self, request, view, obj):
        # Assumes the 'obj' is a Membership instance
        return obj.team.owner == request.user

class IsMemberItself(permissions.BasePermission):
    """
    Allows access only to the user associated with the Membership.
    """
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user

class IsTeamOwnerOrMemberItself(permissions.BasePermission):
    """
    Allows access to the team owner OR the member itself.
    """
    def has_object_permission(self, request, view, obj):
        return (obj.team.owner == request.user) or (obj.user == request.user)