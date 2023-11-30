from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from user_api.models import User


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
    avatar = serializers.ImageField(required=False)
    table_theme = serializers.CharField(allow_null=True, required=False)
    card_backing = serializers.CharField(allow_null=True, required=False)
    
    def create(self, validated_data):
        user = User.objects.create_user(validated_data['username'],
                                        validated_data['email'],
                                        validated_data['password'])
        return user
    class Meta:
        model = User
        fields = ('id','username','email','password', 'is_staff',
                  'wins', 'avatar', 'bio', 'games_played', 'money', 'is_active', 'date_joined',
                  'avatar_color', 'table_theme', 'card_backing', 'first_name', 'last_name', 'security_question', 'security_answer')
        
    extra_kwargs = {'password': {'write_only': True},
                    'id': {'write_only': True},
                    'is_staff': {'write_only': True},
                    'wins': {'write_only': True},
                    'games_played': {'write_only': True},
                    'money': {'write_only': True},
                    'is_active': {'write_only': True},
                    'date_joined': {'write_only': True},
                    'avatar_color': {'write_only': True},
                    'table_theme': {'write_only': True},
                    'card_backing': {'write_only': True},
                    'security_question': {'write_only': True},
                    'security_answer': {'write_only': True},}

