from django.http import JsonResponse
from user_api.models import User
from friend.models import FriendRequest, FriendList
from rest_framework.authtoken.models import Token
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from friend.serializers import FriendListSerializer, FriendRequestSerializer
from user_api.serializers import UserSerializer
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt

# Create your views here.
def get_user_from_token(request):
    auth_header = request.headers.get('Authorization')
    if auth_header:
        try:
            token = auth_header.split(' ')[1]
            user = Token.objects.get(key=token).user
            return user
        except (Token.DoesNotExist, IndexError):
            return None
    else:
        return None
    
def search_users(request):
    if request.method == 'GET':
        query = request.GET.get('username', '')
        users = User.objects.filter(username__icontains=query).exclude(id=request.user.id)
        user_list = [{'id': user.id, 'username': user.username} for user in users]
        return JsonResponse({'users': user_list})
    
def get_username(request, id):
    if request.method == 'GET':
        user = get_object_or_404(User, id=id)
        username = user.username
        return JsonResponse({'username': username})

@csrf_exempt
@permission_classes([IsAuthenticated])
def send_friend_request(request, receiver_id):
    user = get_user_from_token(request)
    if user:
        if request.method == 'POST':
            receiver = User.objects.get(id=receiver_id)
            print(receiver.username)
            friend_request = FriendRequest(sender=user, receiver=receiver)
            friend_request.save()
            return JsonResponse({'success': True})
        
        return JsonResponse({'success':False, 'error':'Invalid request'})
    else:
        return JsonResponse({'success': False, 'error': 'Invalid Token or Authorization header missing'}, status=401)
    
@permission_classes([IsAuthenticated])
def friend_requests(request):
    user = get_user_from_token(request)
    if user:
        received_requests = FriendRequest.objects.filter(receiver=user, is_active=True)
        serializer = FriendRequestSerializer(received_requests, many=True)
        return JsonResponse({'friend_requests': serializer.data})
    else:
        return JsonResponse({'success': False, 'error': 'Invalid Token or Authorization header missing'}, status=401)

@permission_classes([IsAuthenticated])
def get_friends(request):
    user = get_user_from_token(request)
    if user:
        if request.method == 'GET':
            try:
                friend_list = FriendList.objects.get(user_id=user.id)
                friends = friend_list.friends.all()
                serializer = UserSerializer(friends, many=True)
                return JsonResponse({'friends': serializer.data})
            except FriendList.DoesNotExist:
                return JsonResponse({'error': 'Friend list not found'}, status=404)
    else:
        return JsonResponse({'success': False, 'error': 'Invalid Token or Authorization header missing'}, status=401)

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

@csrf_exempt
@permission_classes([IsAuthenticated])
def unfriend(request, friend_id):
    user = get_user_from_token(request)
    if user:
        if request.method == 'POST':
            try:
                remover = user
                removee = User.objects.get(id=friend_id)
                
                remover_friendlist = FriendList.objects.get(user=remover)
                remover_friendlist.unfriend(removee)

                return JsonResponse({'message': 'Unfriend Successful'})
                
            except (User.DoesNotExist, FriendList.DoesNotExist):
                return JsonResponse({'error': 'Unfriend failed'}, status=400)
    else:
        return JsonResponse({'success': False, 'error': 'Invalid Token or Authorization header missing'}, status=401)