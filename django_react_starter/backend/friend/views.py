from django.http import JsonResponse
from user_api.models import User
from friend.models import FriendRequest
from friend.serializers import FriendListSerializer

# Create your views here.
def search_users(request):
    if request.method == 'GET':
        query = request.GET.get('username', '')
        users = User.objects.filter(username__icontains=query).exclude(id=request.user.id)
        user_list = [{'id': user.id, 'username': user.username} for user in users]
        return JsonResponse({'users': user_list})
    
def send_friend_request(request, receiver_id):
    if request.method == 'POST':
        receiver = User.objects.get(id=receiver_id)
        friend_request = FriendRequest(sender=request.user, receiver=receiver)
        friend_request.save()
        return JsonResponse({'success': True})
    return JsonResponse({'success':False, 'error':'Invalid request'})

def friend_requests(request):
    received_requests = FriendRequest.objects.filter(receiver=request.user, is_active=True)
    serializer = FriendListSerializer(received_requests, many=True)
    return JsonResponse({'friend_requests': serializer.data})
    