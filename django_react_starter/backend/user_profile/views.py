from user_api.models import User
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
    
