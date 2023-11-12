from django.http import JsonResponse
from user_api.models import User
from friend.models import FriendRequest
from rest_framework.authtoken.models import Token
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from friend.serializers import FriendListSerializer, FriendRequestSerializer
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt

# Create your views here.
def search_users(request):
    if request.method == 'GET':
        query = request.GET.get('username', '')
        users = User.objects.filter(username__icontains=query).exclude(id=request.user.id)
        user_list = [{'id': user.id, 'username': user.username} for user in users]
        return JsonResponse({'users': user_list})
    
def get_username(request, id):
    if request.method == 'GET':
        user = User.objects.get(id=id)
        username = user.username
        return JsonResponse({'username': username})

@csrf_exempt
@permission_classes([IsAuthenticated])
def send_friend_request(request, receiver_id):

    auth_header = request.headers.get('Authorization')
    if auth_header:
        token = auth_header.split(' ')[1]
        try:
            user = Token.objects.get(key=token).user
            request.user = user
        except Token.DoesNotExist:
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

@permission_classes([IsAuthenticated])
def friend_requests(request):

    auth_header = request.headers.get('Authorization')
    if auth_header:
        token = auth_header.split(' ')[1]
        try:
            user = Token.objects.get(key=token).user
            request.user = user
        except Token.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Invalid Token'}, status=401)
    else:
        return JsonResponse({'success': False, 'error': 'Authorization header missing'}, status=401)
    
    received_requests = FriendRequest.objects.filter(receiver=request.user, is_active=True)
    serializer = FriendRequestSerializer(received_requests, many=True)
    return JsonResponse({'friend_requests': serializer.data})

@csrf_exempt
@permission_classes([IsAuthenticated])
def accept_friend_request(request, request_id):

    friend_request = FriendRequest.objects.get(id=request_id)

    if request.method == 'POST':
        friend_request.accept()
        return JsonResponse({'message': 'Friend request accepted'})
    
    return JsonResponse({'message': 'Unable to accept friend request'}, status=400)

@csrf_exempt
@permission_classes([IsAuthenticated])
def decline_friend_request(request, request_id):

    friend_request = FriendRequest.objects.get(id=request_id)

    if request.method == 'POST':
        friend_request.decline()
        return JsonResponse({'message': 'Friend request declined'})
    
    return JsonResponse({'message': 'Unable to decline friend request'}, status=400)
    