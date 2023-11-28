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
from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated

# Create your views here.
class GetUserProfile(APIView):
    def get(self, request, token, *args, **kwargs):
        try:
            token_object = Token.objects.get(key=token)
            user = token_object.user 
            
            string_date_joined = user.date_joined.strftime("%x") # Convert user date joined to nice date i.e. "9/20/23"
            string_last_login = user.last_login.strftime("%x") # Convert user date joined to nice date i.e. "9/20/23"

            user_data_json = serialize('json', [user], use_natural_primary_keys=True)
            user_data = json.loads(user_data_json)[0]['fields']            
            
            if user_data['avatar']:
                user_data['avatar'] = user['avatar'].url  
                
            user_data['date_joined'] = string_date_joined
            user_data['last_login'] = string_last_login

            return JsonResponse(user_data)
        except Token.DoesNotExist:
            return JsonResponse({"error": "User not found"}, status=404)
        
class UpdateUserProfile(APIView):
    def put(self, request, token, *args, **kwargs):
        try:
            token_object = Token.objects.get(key=token)
            user = token_object.user
            serializer = UserSerializer(user, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return JsonResponse(serializer.data)
            else:
                print(serializer.errors)
                return JsonResponse({"error": "Invalid data"}, status=status.HTTP_400_BAD_REQUEST)
        except Token.DoesNotExist:
            return JsonResponse({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        
class GetOtherUserProfile(APIView):
    def get_user(self, username):
        try:
            return User.objects.get(username=username)
        except:
            raise Http404
    
    def get(self, request, username, *args, **kwargs):
        user = self.get_user(username)
        string_date = user.date_joined.strftime("%x") # Convert user date joined to nice date i.e. "9/20/23"
        serializer = UserSerializer(user)
        new_data = serializer.data
        new_data["date_joined"] = string_date # Overwrite data for old date with better format
        return Response(new_data)
    
class IsAdmin(APIView):
    def get_user(self, token):
        try:
            return User.objects.get(auth_token=token)
        except:
            raise Http404
        
    def get(self, request, token, *args, **kwargs):
        user = self.get_user(token)
        serializer = UserSerializer(user)
        print(serializer.data["is_staff"])
        return Response(serializer.data["is_staff"])

class Leaderboard(APIView):
    def get(self, request, *args, **kwargs):
        global_leaders = {"leaders": [leader for leader in User.objects.values("username", "wins", "is_active", "avatar_color").order_by('-wins')[:5]]}
        return JsonResponse(global_leaders, status=200)
    
class Adminpage(APIView):
    
    users_per_page = 10
    
    def get_user(self, token):
        try:
            return User.objects.get(auth_token=token)
        except:
            raise Http404
        
    def user_is_admin(self, token):
        user = self.get_user(token)
        serializer = UserSerializer(user)
        return serializer.data["is_staff"]
    
    def get(self, request, token, page, *args, **kwargs):
        if self.user_is_admin(token):
            exclude_fields = ['password']
            keys = [f.name for f in User._meta.local_fields if f.name not in exclude_fields]
            users_on_page = {"users": [user for user in User.objects.values(*keys).order_by('id')[self.users_per_page*(page-1):self.users_per_page*page]]}
            print(users_on_page)
            return JsonResponse(users_on_page, status=200)
        else:
            return Response(status=401)
    
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
    
class AvatarColor(APIView):
    def get_user(self, token):
        try:
            return User.objects.get(auth_token=token)
        except:
            raise Http404
        
    def get(self, request, token, *args, **kwargs):
        user = self.get_user(token)
        serializer = UserSerializer(user)
        return Response(serializer.data["avatar_color"])
    
    def patch(self, request, token, *args, **kwargs):
        user = self.get_user(token)
        
        # Cleaning request very important while using patch since partial=True allows any field to be changed
        # without requiring the username and password. Here we use a dictionary comprehention to ignore any 
        # other fields besides "avatar_color".
        cleaned_request = request.data.copy()
        cleaned_request = {key:value for (key, value) in cleaned_request.items() if key == "avatar_color"}
        
        serializer = UserSerializer(user, data=cleaned_request, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

def edit_profile(request):
    return render(request, 'editProfile.html')