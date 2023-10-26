from django.shortcuts import render
from django.contrib.auth import login
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response

# Create your views here.
class UserLogin(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        response = super(UserLogin, self).post(request, *args, **kwargs)
        token = Token.objects.get(key=response.data['token'])
        user = token.user
        login(request, user)
        return response
    
def login_user(request):
    return render(request, 'login.html')