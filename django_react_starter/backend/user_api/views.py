from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from user_api.serializers import UserSerializer
from django.contrib.auth.models import User
from user_api.models import User as api_User
from django.http import Http404
from django.http import JsonResponse

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

class TotalUsers(APIView):
    def get(self, request, *args, **kwargs):
        total_users = api_User.objects.count()
        return Response(total_users, status=200)

"""
A lot like some of the endpoints in user_profile, but requires admin perms.
Additionally, has fewer restrictions on what can be done through this endpoint
"""
class UserManagement(APIView):
    
    def get_user_by_token(self, token):
        try:
            return api_User.objects.get(auth_token=token)
        except:
            raise Http404
        
    def get_user_by_username(self, username):
        try:
            return api_User.objects.get(username=username)
        except:
            raise Http404
        
    def user_is_admin(self, token):
        user = self.get_user_by_token(token)
        serializer = UserSerializer(user)
        return serializer.data["is_staff"]
    
    def get(self, request, token, username, *args, **kwargs):
        if self.user_is_admin(token):
            user = self.get_user_by_username(username)
            serializer = UserSerializer(user)
            print(serializer.data)
            return JsonResponse(serializer.data, status=200)
        else:
            return Response(status=401)
        
    def patch(self, request, token, username, *args, **kwargs):
        if self.user_is_admin(token):
            user = self.get_user_by_username(username)
            
            # Don't allow admins to change password or id or avatar---
            # It would break the hashing in the database--- would require a password change endpoint
            # Avatar also needs to be a file, handle through separate endpoint
            # Id's musn't be changed that's the law
            inaccessible_fields = ["password", "id", "avatar"]
            cleaned_request = request.data.copy()
            cleaned_request = {key:value for (key, value) in cleaned_request.items() if key not in inaccessible_fields}
            
            try:
                serializer = UserSerializer(user, data=cleaned_request, partial=True)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_200_OK)
                else:
                    print("bad request")
                    raise Exception
            except:
                print(serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(status=401)
        
    def post(self, request, token, username, *args, **kwargs):
        if self.user_is_admin(token):
            res = UserCreate.post(request=request)
            return res
        else:
            return Response(status=401)

def create_account(request):
    return render(request, 'createAccount.html')
