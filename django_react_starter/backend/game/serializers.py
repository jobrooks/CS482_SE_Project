from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.contrib.auth.models import User
from game.models import Card, SUIT_CHOICES, RANK_CHOICES

class CardSerializer(serializers.ModelSerializer):
    suit = serializers.ChoiceField(choices=SUIT_CHOICES)
    rank = serializers.ChoiceField(choices=RANK_CHOICES)

    def create(self, validated_data):
        return Card.objects.create(**validated_data)
    
    def update(self, instance, validated_data):
        instance.suit = validated_data.get('suit', instance.suit)
        instance.rank = validated_data.get('rank', instance.rank)
        instance.save()
        return instance