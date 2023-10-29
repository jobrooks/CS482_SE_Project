from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.contrib.auth.models import User
from game.models import Deck, Hand, Card, SUIT_CHOICES, RANK_CHOICES

class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = '__all__'

class DeckSerializer(serializers.ModelSerializer):
    cards = CardSerializer(many=True, read_only=True)

    class Meta:
        model = Deck
        fields = '__all__'

class HandSerializer(serializers.ModelSerializer):
    cards = CardSerializer(many=True, read_only=True)

    class Meta:
        model = Hand
        fields = '__all__'

# class CardSerializer(serializers.ModelSerializer):
#     suit = serializers.ChoiceField(choices=SUIT_CHOICES)
#     rank = serializers.ChoiceField(choices=RANK_CHOICES)

#     def create(self, validated_data):
#         return Card.objects.create(**validated_data)
    
#     def update(self, instance, validated_data):
#         instance.suit = validated_data.get('suit', instance.suit)
#         instance.rank = validated_data.get('rank', instance.rank)
#         instance.save()
#         return instance

# class DeckSerializer(serializers.ModelSerializer):
#     name = serializers.Charfield(required=True, allow_blank=False, max_length=100)
#     cards = serializers.PrimaryKeyRelatedField(queryset=)