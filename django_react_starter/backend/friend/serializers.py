from rest_framework import serializers
from .models import FriendList, FriendRequest

class FriendListSerializer(serializers.ModelSerializer):
    class Meta:
        model = FriendList
        fields = '__all__'

class FriendRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = FriendRequest
        fields = ['sender', 'receiver', 'is_active', 'timestamp']