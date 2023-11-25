from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from user_api.models import User, GuestUser


class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required = True,
        validators = [UniqueValidator(queryset=User.objects.all())]
    )
    username = serializers.CharField(
        max_length=32,
        validators = [UniqueValidator(queryset=User.objects.all())]
    )
    password = serializers.CharField(min_length = 8, write_only = True)

    def create(self, validated_data):
        user = User.objects.create_user(validated_data['username'],
                                        validated_data['email'],
                                        validated_data['password'])
        return user
    class Meta:
        model = User
        fields = ('id','username','email','password',
                  'wins', 'avatar', 'bio', 'games_played', 'money', 'is_active', 'date_joined',
                  'avatar_color', 'table_theme', 'card_backing')
        
class GuestSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required = True,
        validators = [UniqueValidator(queryset=GuestUser.objects.all())]
    )
    username = serializers.CharField(
        max_length=32,
        validators = [UniqueValidator(queryset=GuestUser.objects.all())]
    )

    def create(self, validated_data):
        guest = GuestUser.objects.create_user(validated_data['username'],
                                              validated_data['email'])
        return guest
    class Meta:
        model = GuestUser
        fields = ('id','username','email',
                  'wins', 'avatar', 'games_played', 'money', 'is_active', 'date_joined',
                  'avatar_color', 'table_theme', 'card_backing','is_guest')

