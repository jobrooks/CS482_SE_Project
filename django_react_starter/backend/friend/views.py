from django.http import JsonResponse
from user_api.models import User
from friend.models import FriendRequest
from rest_framework.authtoken.models import Token
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from friend.serializers import FriendListSerializer
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt

# Create your views here.
def search_users(request):
    if request.method == 'GET':
        query = request.GET.get('username', '')
        users = User.objects.filter(username__icontains=query).exclude(id=request.user.id)
        user_list = [{'id': user.id, 'username': user.username} for user in users]
        return JsonResponse({'users': user_list})

@csrf_exempt
@permission_classes([IsAuthenticated])
def send_friend_request(request, receiver_id):
    auth_header = request.headers.get('Authorization')
    if auth_header:
        token = auth_header.split(' ')[1]
        try:
            user = Token.objects.get(key=token).user
            request.user = user
        except Token.doesNotExist:
            return JsonResponse({'success': False, 'error': 'Invalid Token'}, status=401)
    else:
        return JsonResponse({'success': False, 'error': 'Authorization header missing'}, status=401)

    if request.method == 'POST':
        receiver = User.objects.get(id=receiver_id)
        print(receiver.username)
        friend_request = FriendRequest(sender=request.user, receiver=receiver)
        friend_request.save()
        return JsonResponse({'success': True})
    return JsonResponse({'success':False, 'error':'Invalid request'})

def friend_requests(request):
    received_requests = FriendRequest.objects.filter(receiver=request.user, is_active=True)
    serializer = FriendListSerializer(received_requests, many=True)
    return JsonResponse({'friend_requests': serializer.data})
    