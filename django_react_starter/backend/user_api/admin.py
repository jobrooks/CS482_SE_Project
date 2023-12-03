from django.contrib import admin
from user_api.models import User, GuestUser

admin.site.register(User)
admin.site.register(GuestUser)
