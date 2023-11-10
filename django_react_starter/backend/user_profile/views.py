from django.shortcuts import render
from user_api.models import User
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from user_profile.serializers import UserSerializer
from rest_framework.views import APIView
from django.http import Http404

# Create your views here.
def get_user_profile(request, username):
    user = User.objects.get(username=username)
    return render(request, 'profile.html', {"user":user})

class UserList(APIView): # Not wworking still
    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

class TableTheme(APIView):
    def get_user(self, token):
        try:
            return User.objects.get(auth_token=token)
        except:
            raise Http404
        
    def get(self, request, token):
        user = self.get_user(token)
        serializer = UserSerializer(user)
        return Response(serializer.data["table_theme"])
    
    def put(self, request, token):
        user = self.get_user(token)
        serializer = UserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
