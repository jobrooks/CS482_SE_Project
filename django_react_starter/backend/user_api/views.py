from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from user_api.serializers import UserSerializer, GuestSerializer
from django.contrib.auth.models import User

# Create your views here.
class UserCreate(APIView):
    #Creates the user.
    def post(self, request, format='json'):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            if user:
                token, created = Token.objects.get_or_create(user=user)
                json = serializer.data
                json['token'] = token.key
                return Response(json, status=status.HTTP_201_CREATED)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class GuestCreate(APIView):
    #Create the guest user
    def post(self, request, format='json'):
        serializer = GuestSerializer(data=request.data)
        if serializer.is_valid():
            guest = serializer.save()
            if guest:
                json = serializer.data
                return Response(json, status=status.HTTP_201_CREATED)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                
def create_account(request):
    return render(request, 'createAccount.html')
