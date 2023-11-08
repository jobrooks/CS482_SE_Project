from django.shortcuts import render
from user_api.models import User

# Create your views here.
def get_user_profile(request, username):
    user = User.objects.get(username=username)
    return render(request, 'profile.html', {"user":user})
