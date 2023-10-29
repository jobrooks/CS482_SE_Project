from django.shortcuts import render
from django.contrib.auth import login
from django.contrib.auth import authenticate
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response

# Create your views here.
class UserLogin(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(request, username=username, password=password, backend='django.contrib.auth.backends.ModelBackend')

        if user is not None:
            login(request, user)
            response = super(UserLogin, self).post(request, *args, **kwargs)
            token = Token.objects.get(key=response.data['token'])
            user = token.user  
            return response
        return Response({'error': 'Authentication failed'}, status=400)
    
def login_user(request):
    return render(request, 'login.html')