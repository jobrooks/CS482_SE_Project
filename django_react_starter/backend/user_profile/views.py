from user_api.models import User
from user_api.models import GuestUser
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from user_api.serializers import UserSerializer, UserUpdateSerializer, UpdatePasswordSerializer, GuestSerializer
from rest_framework.views import APIView
from django.http import Http404
from django.http import JsonResponse
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.core.serializers import serialize
from django.db.models import Count
import json
from django.shortcuts import render
from rest_framework.parsers import MultiPartParser, FormParser
from django.db.utils import IntegrityError

# Create your views here.
class GetUserProfile(APIView):
    def get(self, request, token, *args, **kwargs):
        try:
            token_object = Token.objects.get(key=token)
            user = token_object.user 
            
            #string_date_joined = user.date_joined.strftime("%x") # Convert user date joined to nice date i.e. "9/20/23"
            #string_last_login = user.last_login.strftime("%x") # Convert user date joined to nice date i.e. "9/20/23"

            user_data_json = serialize('json', [user], use_natural_primary_keys=True)
            user_data = json.loads(user_data_json)[0]['fields']            
            
            # if user_data['avatar']:
            #     user_data['avatar'] = user['avatar'].url  
                
            # user_data['date_joined'] = string_date_joined
            # user_data['last_login'] = string_last_login

            return JsonResponse(user_data)
        except Token.DoesNotExist:
            return JsonResponse({"error": "User not found"}, status=404)
        
class GetGuestProfile(APIView):
    def get(self, request, username, *args, **kwargs):
        try:
            guest = GuestUser.objects.get(username=username)
            guest_serializer = GuestSerializer(guest)
            guest_serializer_data = guest_serializer.data
            return JsonResponse(guest_serializer_data)
        except GuestUser.DoesNotExist:
            return JsonResponse({"error": "Guest not found"}, status=404)
        
class GetSecurityQuestion(APIView):
    def get(self, request, username, *args, **kwargs):
        try:
            user = User.objects.get(username=username)
            serializer = UserSerializer(user)
            
            # Extract the security question from the serialized data
            security_question = serializer.data.get('security_question', None)
            
            if security_question is not None:
                return JsonResponse({"security_question": security_question})
            else:
                return JsonResponse({"error": "Security question not found"}, status=404)
        
        except User.DoesNotExist:
            return JsonResponse({"error": "User not found"}, status=404)
        
class CheckUserExists(APIView):
    def get(self, request, username, *args, **kwargs):
        try:
            user = User.objects.get(username=username)
            if user:
                return JsonResponse({"user_exist": True}, status=200)
        except User.DoesNotExist:
            return JsonResponse({"user_exist": False}, status=404)
        
class VerifyAnswer(APIView):
    def post(self, request, *args, **kwargs):
        try:
            user = User.objects.get(username=request.data['username'])
            serializer = UserSerializer(user)

            security_answer = serializer.data.get('security_answer', None)
            if request.data['security_answer'] == security_answer:
                return JsonResponse({"is_answer_correct": True})
            else:
                return JsonResponse({"is_answer_correct": False})
        except User.DoesNotExist:
            return JsonResponse({"error": "User not found"}, status=404)
        
class UpdateUserPassword(APIView):
    def put(self, request, *args, **kwargs):
        try:
            user = User.objects.get(username=request.data['username'])
            new_password = request.data['newPassword']
            if(new_password == ''):
                return JsonResponse({"error": "Cannot update with empty password"}, status=status.HTTP_400_BAD_REQUEST) 
            # Use set_password to hash the new password
            user.set_password(new_password)
            user.save()

            # Delete the existing token
            Token.objects.filter(user=user).delete()

            # Create a new token
            new_token = Token.objects.create(user=user)

            serializer_data = {
                'token': new_token.key,
                'username': user.username,
            }

            return JsonResponse(serializer_data)
        except User.DoesNotExist:
            return JsonResponse({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(e)
            return JsonResponse({"error": "Failed to update password"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
class UpdateUserProfile(APIView):
    parser_classes = (MultiPartParser, FormParser)
    
    def put(self, request, token, *args, **kwargs):
        try:
            token_object = Token.objects.get(key=token)
            user = token_object.user
            serializer = UserUpdateSerializer(user, data=request.data)
            
            if serializer.is_valid():
                serializer.save()

                # Delete the existing token
                Token.objects.filter(user=user).delete()

                # Create a new token
                new_token = Token.objects.create(user=user)
                
                serializer_data = serializer.data
                serializer_data['token'] = new_token.key
                
                return JsonResponse(serializer_data)
            else:
                print(serializer.errors)
                return JsonResponse({"error": "Invalid data"}, status=status.HTTP_400_BAD_REQUEST)
        except Token.DoesNotExist:
            return JsonResponse({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except IntegrityError:
            return JsonResponse({"error": "Token creation failed"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
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
            users_on_page = {"users": [user for user in User.objects.values(*keys).order_by('id')[self.users_per_page*(page):self.users_per_page*(page+1)]]}
            print(users_on_page)
            return JsonResponse(users_on_page, status=200)
        else:
            return Response(status=401)
    
class TableTheme(APIView):
    def get_user(self, token):
        try:
            return User.objects.get(auth_token=token)
        except:
            raise User.DoesNotExist
        
    def get(self, request, token, *args, **kwargs):
        user = self.get_user(token)
        serializer = UserSerializer(user)
        return Response(serializer.data["table_theme"], status=status.HTTP_200_OK)
    
    def patch(self, request, token, *args, **kwargs):
        try:
            user = self.get_user(token)
            
            # Cleaning request very important while using patch since partial=True allows any field to be changed
            # without requiring the username and password. Here we use a dictionary comprehention to ignore any 
            # other fields besides "table_theme".
            cleaned_request = request.data.copy()
            cleaned_request = {key:value for (key, value) in cleaned_request.items() if key == "table_theme"}

            if "table_theme" not in cleaned_request:
                return Response({"error": "table_theme is required"}, status=status.HTTP_400_BAD_REQUEST)
            
            serializer = UserSerializer(user, data=cleaned_request, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({"error":"User Not found"}, status=status.HTTP_404_NOT_FOUND)

class GuestTableTheme(APIView):
        
    def get(self, request, username, *args, **kwargs):
        guest = GuestUser.objects.get(username=username)
        serializer = GuestSerializer(guest)
        return Response(serializer.data["table_theme"],status=status.HTTP_200_OK)
    
    def patch(self, request, username, *args, **kwargs):
        try:
            guest = GuestUser.objects.get(username=username)
            
            # Cleaning request very important while using patch since partial=True allows any field to be changed
            # without requiring the username and password. Here we use a dictionary comprehention to ignore any 
            # other fields besides "table_theme".
            cleaned_request = request.data.copy()
            cleaned_request = {key:value for (key, value) in cleaned_request.items() if key == "table_theme"}
            
            serializer = GuestSerializer(guest, data=cleaned_request, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except GuestUser.DoesNotExist:
            return Response({"error":"Guest Not found"}, status=status.HTTP_404_NOT_FOUND)

class CardBacking(APIView):
    def get_user(self, token):
        try:
            return User.objects.get(auth_token=token)
        except:
            raise User.DoesNotExist
        
    def get(self, request, token, *args, **kwargs):
        user = self.get_user(token)
        serializer = UserSerializer(user)
        return Response(serializer.data["card_backing"], status=status.HTTP_200_OK)
    
    def patch(self, request, token, *args, **kwargs):
        try:
            user = self.get_user(token)
            
            # Cleaning request very important while using patch since partial=True allows any field to be changed
            # without requiring the username and password. Here we use a dictionary comprehention to ignore any 
            # other fields besides "table_theme".
            cleaned_request = request.data.copy()
            cleaned_request = {key:value for (key, value) in cleaned_request.items() if key == "card_backing"}
            if "card_backing" not in cleaned_request:
                return Response({"error": "card_backing is required"}, status=status.HTTP_400_BAD_REQUEST)
            
            serializer = UserSerializer(user, data=cleaned_request, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({"error":"User Not found"}, status=status.HTTP_404_NOT_FOUND)
    
class GuestCardBacking(APIView):
        
    def get(self, request, username, *args, **kwargs):
        guest = GuestUser.objects.get(username=username)
        serializer = GuestSerializer(guest)
        return Response(serializer.data["card_backing"], status=status.HTTP_200_OK)
    
    def patch(self, request, username, *args, **kwargs):
        try:
            guest = GuestUser.objects.get(username=username)
            
            # Cleaning request very important while using patch since partial=True allows any field to be changed
            # without requiring the username and password. Here we use a dictionary comprehention to ignore any 
            # other fields besides "table_theme".
            cleaned_request = {"card_backing": request.data.get("card_backing")}
            if not cleaned_request["card_backing"]:
                return Response({"error": "card_backing is required"}, status=status.HTTP_400_BAD_REQUEST)

            
            serializer = GuestSerializer(guest, data=cleaned_request, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except GuestUser.DoesNotExist:
            return Response({"error":"Guest Not found"}, status=status.HTTP_404_NOT_FOUND)
        
class AvatarColor(APIView):
    def get_user(self, token):
        try:
            return User.objects.get(auth_token=token)
        except:
            raise Http404
        
    def get(self, request, token, *args, **kwargs):
        user = self.get_user(token)
        serializer = UserSerializer(user)
        return Response(serializer.data["avatar_color"], status=status.HTTP_200_OK)
    
    def patch(self, request, token, *args, **kwargs):
        try:
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
        except User.DoesNotExist:
            return Response({"error":"Guest Not found"}, status=status.HTTP_404_NOT_FOUND)
    
class GuestAvatarColor(APIView):
        
    def get(self, request, username, *args, **kwargs):
        guest = GuestUser.objects.get(username=username)
        serializer = GuestSerializer(guest)
        return Response(serializer.data["avatar_color"], status=status.HTTP_200_OK)
    
    def patch(self, request, username, *args, **kwargs):
        try:
            guest = GuestUser.objects.get(username=username)
            
            # Cleaning request very important while using patch since partial=True allows any field to be changed
            # without requiring the username and password. Here we use a dictionary comprehention to ignore any 
            # other fields besides "avatar_color".
            cleaned_request = request.data.copy()
            cleaned_request = {key:value for (key, value) in cleaned_request.items() if key == "avatar_color"}
            
            serializer = GuestSerializer(guest, data=cleaned_request, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except GuestUser.DoesNotExist:
            return Response({"error":"Guest Not found"}, status=status.HTTP_404_NOT_FOUND)
    
def edit_profile(request):
    return render(request, 'editProfile.html')