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