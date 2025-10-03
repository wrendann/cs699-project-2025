from django.contrib import admin
from .models import User, Event, Team, Membership

admin.site.register(User)
admin.site.register(Event)
admin.site.register(Team)
admin.site.register(Membership)

# Register your models here.
