from django.http import HttpResponse
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
import random



def home(request):
    return render(request, 'home.html')

class Deck:
    cards = []  # should be limited to 52 cards
    
    def __init__(self):
        suits = ['S', 'C', 'H', 'D']
        value = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A']
        self.cards = [[(x, y) for x in value] for y in suits]
    
    def shuffle_deck(self):
        for x in range(0, 3):
            random.shuffle(self.cards[x])

    def draw_card(self):
        index_value = random.randint(0, 3)
        while (len(self.cards[index_value]) == 0):
            index_value = random.randint(0, 3)
        card = self.cards[index_value].pop()
        return card

class Hand:
    cards = []

    def __init__(self, cards : [tuple] = []):
        self.cards = cards

class Player:
    money = 0
    player_hand = Hand()

    def __init__(self, player_id : id, money : int = 1000, player_hand : Hand() = Hand()):
        self.money = money
        self.player_hand = player_hand
        self.player_id = player_id
    
    def choose(self, choice, amount : int = 10):
        if choice == "raise":
            # add to pot
            temp = money
            money -= amount
            return temp
        elif choice == "call":
            # add to pot
            temp = money
            money -= amount
            return temp
        else:
            return 0
    
    def discard_choice(self, index_of_card : [int] = []):
        for card in index_of_card:
            if 0 < card < len(self.player_hand.cards) - 1:
                self.player_hand.cards.pop(card)
            else:
                raise ValueError("Must be a valid index")

class Game:
    deck1 = Deck()
    pot = 0

    def __init__(self, game_id : int, host : Player, deck1 : Deck() = Deck()):
        self.deck1 = deck1
        self.host = host
        self.game_id = game_id

    # def play_game(player1, player2, deck1):
    #     deck1.shuffle_deck()
    #     for x in range(0, 5):
    #         player1.player_hand.cards.append(deck1.draw_card())
    #         player2.player_hand.cards.apepnd(deck1.draw_card())
    #     pot += player1.choose(input("What choice would you like to make? You can raise, call, or fold."), input("What amount would you like to bet? If folding, leave empty."))
    #     pot += player2.choose(input("What choice would you like to make? You can raise, call, or fold."), input("What amount would you like to bet? If folding, leave empty."))
    #     player1.discard_choice(input("What cards would you like to discard? Leave empty for none, otherwise specify index separated by a space.").split(" "))
    #     player2.discard_choice(input("What cards would you like to discard? Leave empty for none, otherwise specify index separated by a space.").split(" "))
    #     pot += player1.choose(input("What choice would you like to make? You can raise, call, or fold."), input("What amount would you like to bet? If folding, leave empty."))
    #     pot += player2.choose(input("What choice would you like to make? You can raise, call, or fold."), input("What amount would you like to bet? If folding, leave empty."))

game_ids = 1
games = {}
players = {}

@api_view(['GET'])
def getPlayerHand(request, game_id, player_id):
    
    return Response(test)

@api_view(['GET'])
def getPlayer2Hand(request):
    test = {'name': 'Dennis', 'age': 28}
    return Response(test)

@api_view(['POST'])
def start_game(request):
    print(request.read())
    # game = Game(game_ids, player_id)
    # game_ids = game_ids + 1
    # games[game.game_id] = game
    # return Response(game.game_id)




def store(request):
    return HttpResponse("Welcome to the store!")
