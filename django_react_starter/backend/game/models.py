from django.db import models
from user_api.models import User
from collections import deque


DECK_SIZE = 52
MAX_HAND_SIZE = 5

SUIT_CHOICES = (
        ('H', 'Hearts'),
        ('D', 'Diamonds'),
        ('C', 'Clubs'),
        ('S', 'Spades'),
    )

RANK_CHOICES = (
    ('2', '2'),
    ('3', '3'),
    ('4', '4'),
    ('5', '5'),
    ('6', '6'),
    ('7', '7'),
    ('8', '8'),
    ('9', '9'),
    ('10', '10'),
    ('J', 'Jack'),
    ('Q', 'Queen'),
    ('K', 'King'),
    ('A', 'Ace'),
)

class Deck(models.Model):
    name = models.CharField(max_length=10)

class Hand(models.Model):
    name = models.CharField(max_length=10)

class Card(models.Model):
    suit = models.CharField(max_length=1, choices=SUIT_CHOICES)
    rank = models.CharField(max_length=2, choices=RANK_CHOICES)
    deck = models.ForeignKey(Deck(), null=True, on_delete=models.CASCADE)
    hand = models.ForeignKey(Hand(), null=True, on_delete=models.CASCADE)

class Pot(models.Model):
    moneyAmount = models.IntegerField()

class Game(models.Model):
    name = models.CharField(max_length=10)
    deck = models.OneToOneField(Deck(), null=True, on_delete=models.CASCADE)
    pot = models.OneToOneField(Pot(), null=True, on_delete=models.CASCADE)
    currentTurn = models.IntegerField(null=True)

class Player(models.Model):
    money = models.PositiveBigIntegerField()
    game = models.ForeignKey(Game(), null=True, on_delete=models.CASCADE)
    hand = models.OneToOneField(Hand(), null=True, on_delete=models.CASCADE)
    name = models.CharField(max_length=25, null=True)


class TurnOrder():
    order = deque()

def get_game(game: int):
    game = Game.objects.get(game=game)
    return game

def bet(gameID: int, userID: int, isBetting: bool, betAmount: int):
    user = User.objects.get(pk=userID)
    game = Game.objects.get(pk=gameID)
    pot = Pot.objects.get(pk=game.pot)
    if isBetting:
        pot.moneyAmount += betAmount
        user.money -= betAmount

#def start_game():


# all game logic
# def play_game(numPlayers: int, arrUsers: [int]):
#     # just one deck and pot for the game, game created with ids of those objects
#     deckid = create_deck()
#     potid = create_pot()
#     game = create_game(pot=Pot.objects.get(pk=potid), deck=Deck.objects.get(pk=deckid))

    # import player info from db and create game "users"
    # need:
    # number of players
    # each players id?
    # money each player has


    # start game
    # round class?
    # blinds or ante?
    # small blind , big blind assigned, 
    # need function to identify dealer, small blind, big blind every round
    # p0 is dealer, p1 is small blind, p2 is big blind (shift around every round)
    # small blind - half min bet, big blind - min bet
    # or
    # ante - each remaining player pays minimum bet or doesn't play that round

    # deal 5 cards to each player starting with small blind 
    # hand = []

    # for _ in range(0, numPlayers):
    #     hand.append(create_hand())

    
    # for id in hand:
    #     for _ in range(0, 5):
    #         draw_card(deckid, id)

    # put 5 cards out face down

    # betting for round
    # first player to bet is left of big blind
    # fold, call or raise (can't check)
    # when someone raises, the min raise goes up
    # call is matching min raise