from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.contrib.auth.models import User
from game.models import Round, Deck, Hand, Card, SUIT_CHOICES, RANK_CHOICES, Game, Pot, Player

class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = '__all__'

class RoundSerializer(serializers.ModelSerializer):
    class Meta:
        model = Round
        fields = '__all__'

class DeckSerializer(serializers.ModelSerializer):

    class Meta:
        model = Deck
        fields = '__all__'

class HandSerializer(serializers.ModelSerializer):

    class Meta:
        model = Hand
        fields = '__all__'

class GameSerializer(serializers.ModelSerializer):

    class Meta:
        model = Game
        fields = '__all__'

class PotSerializer(serializers.ModelSerializer):

    class Meta:
        model = Pot
        fields = '__all__'

class PlayerSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Player
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