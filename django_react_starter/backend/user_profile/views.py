from user_api.models import User
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from user_api.serializers import UserSerializer
from rest_framework.views import APIView
from django.http import Http404
from django.http import JsonResponse
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.core.serializers import serialize
from django.db.models import Count
import json

# Create your views here.
class GetUserProfile(APIView):
    def get(self, request, token, *args, **kwargs):
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

class Leaderboard(APIView):
    def get(self, request, token, *args, **kwargs):
        global_leaders = [leader for leader in User.objects.values("username", "wins").order_by('-wins')[:5]]
        return JsonResponse({"leaders": json.dumps(global_leaders)}, status=200)
    
class TableTheme(APIView):
    def get_user(self, token):
        try:
            return User.objects.get(auth_token=token)
        except:
            raise Http404
        
    def get(self, request, token, *args, **kwargs):
        user = self.get_user(token)
        serializer = UserSerializer(user)
        return Response(serializer.data["table_theme"])
    
    def patch(self, request, token, *args, **kwargs):
        user = self.get_user(token)
        
        # Cleaning request very important while using patch since partial=True allows any field to be changed
        # without requiring the username and password. Here we use a dictionary comprehention to ignore any 
        # other fields besides "table_theme".
        cleaned_request = request.data.copy()
        cleaned_request = {key:value for (key, value) in cleaned_request.items() if key == "table_theme"}
        
        serializer = UserSerializer(user, data=cleaned_request, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CardBacking(APIView):
    def get_user(self, token):
        try:
            return User.objects.get(auth_token=token)
        except:
            raise Http404
        
    def get(self, request, token, *args, **kwargs):
        user = self.get_user(token)
        serializer = UserSerializer(user)
        return Response(serializer.data["card_backing"])
    
    def patch(self, request, token, *args, **kwargs):
        user = self.get_user(token)
        
        # Cleaning request very important while using patch since partial=True allows any field to be changed
        # without requiring the username and password. Here we use a dictionary comprehention to ignore any 
        # other fields besides "table_theme".
        cleaned_request = request.data.copy()
        cleaned_request = {key:value for (key, value) in cleaned_request.items() if key == "card_backing"}
        
        serializer = UserSerializer(user, data=cleaned_request, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)