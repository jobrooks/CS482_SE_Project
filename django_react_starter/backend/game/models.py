from django.db import models
import random

# Create your models here.

from django.db import models

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

class Card(models.Model):

    suit = models.CharField(max_length=1, choices=SUIT_CHOICES)
    rank = models.CharField(max_length=2, choices=RANK_CHOICES)

    def __str__(self):
        return f'{self.get_rank_display()} of {self.get_suit_display()}'

class Deck(models.Model):
    cards = models.ManyToManyField(Card)

"""

class Player(models.Model):
    name = models.CharField(max_length=100)
    hand = models.ManyToManyField(Card, related_name='hands')

class Game(models.Model):
    deck = models.ForeignKey(Deck, on_delete=models.CASCADE)
    players = models.ManyToManyField(Player, related_name='games')

class Pot(models.Model):
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    amount = models.PositiveIntegerField()

class Round(models.Model):
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    round_number = models.PositiveSmallIntegerField()

class Bet(models.Model):
    round = models.ForeignKey(Round, on_delete=models.CASCADE)
    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    amount = models.PositiveIntegerField()

class Winner(models.Model):
    round = models.OneToOneField(Round, on_delete=models.CASCADE)
    player = models.ForeignKey(Player, on_delete=models.CASCADE)

class PokerGame(models.Model):
    name = models.CharField(max_length=100)
    games = models.ManyToManyField(Game, related_name='poker_games')

"""

"""
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
"""