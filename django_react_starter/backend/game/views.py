from django.shortcuts import render
from django.http import HttpResponse, JsonResponse, Http404
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from game.models import Card, Deck, Hand, Game, create_deck, draw_card, get_player_hand
from game.serializers import CardSerializer, DeckSerializer, HandSerializer, PotSerializer, GameSerializer

# Create your views here.

class GameList(APIView):
    def get(self, request):
        game = Game.objects.all()
        serializer = GameSerializer(game, many=True)
        return Response(serializer.data)
   
    def post(self, request):
        serializer = GameSerializer(data=request.data) 
        if serializer.is_valid(): 
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)

class GameDetail(APIView):
    def get_game(self, pk):
            try:
                return Game.objects.get(pk=pk)
            except:
                raise Http404

    def get(self, request, pk, format=None):
            game = self.get_game(pk)
            serializer = GameSerializer(game)
            return Response(serializer.data)
    
    def put(self, request, pk, format=None):
        game = self.get_game(pk)
        serializer = GameSerializer(game, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)
    


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
