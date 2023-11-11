from user_api.models import User
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from user_profile.serializers import UserSerializer
from rest_framework.views import APIView
from django.http import Http404
from django.http import JsonResponse
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.core.serializers import serialize
import json

# Create your views here.
def get_user_profile(request, token):
    try:
        token_object = Token.objects.get(key=token)
        user = token_object.user 

        user_data_json = serialize('json', [user], use_natural_primary_keys=True)
        user_data = json.loads(user_data_json)[0]['fields']
        
        if user_data['avatar']:
            user_data['avatar'] = user['avatar'].url  

        return JsonResponse(user_data)
    except Token.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=404)

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
