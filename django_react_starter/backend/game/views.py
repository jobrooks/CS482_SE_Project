from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from game.models import Card, Deck, Hand, create_deck, draw_card, get_player_hand
from game.serializers import CardSerializer, DeckSerializer, HandSerializer, PotSerializer, GameSerializer

# Create your views here.

@csrf_exempt
def cardView(request):
    if request.method == 'GET':
        cards = Card.objects.all()
        serializer = CardSerializer(cards, many=True)
        return JsonResponse(serializer.data, safe=False)
    elif request.method == 'POST':
        data = JSONParser().parse(request)
        serializer = CardSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)


@csrf_exempt
def display_pot(request, gameID):
    if request.method == 'GET':
        serializer = PotSerializer()
        return JsonResponse(serializer.data, safe=False)

@csrf_exempt
def display_hand(request, userID):
    if request.method =='GET':
        serializer = CardSerializer(get_player_hand(user=userID), many=True)
        return JsonResponse(serializer.data, safe=False)

@csrf_exempt
def handView(request):
    if request.method == 'GET':
        hands = Hand.objects.all()
        serializer = HandSerializer(hands, many=True)
        return JsonResponse(serializer.data, safe=False)
    elif request.method == 'POST':
        data = JSONParser().parse(request)
        serializer = HandSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)

@csrf_exempt
def deckView(request):
    if request.method == 'GET':
        deck = Deck.objects.all()
        serializer = DeckSerializer(deck, many=True)
        return JsonResponse(serializer.data, safe=False)
    elif request.method == 'POST':
        data = JSONParser().parse(request)
        serializer = DeckSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)
