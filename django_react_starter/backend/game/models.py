from django.db import models
from user_api.models import User
from collections import deque
import random


DECK_SIZE = 52
MAX_HAND_SIZE = 5

SUIT_CHOICES = (
        ('H', 'Hearts'),
        ('D', 'Diamonds'),
        ('C', 'Clubs'),
        ('S', 'Spades'),
    )

RANK_CHOICES = (
    ('02', '2'),
    ('03', '3'),
    ('04', '4'),
    ('05', '5'),
    ('06', '6'),
    ('07', '7'),
    ('08', '8'),
    ('09', '9'),
    ('10', '10'),
    ('11', 'Jack'),
    ('12', 'Queen'),
    ('13', 'King'),
    ('14', 'Ace'),
)

class Deck(models.Model):
    name = models.CharField(max_length=10, null=True)

    def create_deck(deckserializer):
        for x in SUIT_CHOICES:
            for y in RANK_CHOICES:
                card = Card(suit=x, rank=y, deck=Deck.objects.get(pk=deckserializer.data['id']))
                card.save()

class Hand(models.Model):
    name = models.CharField(max_length=10, null=True)
    score = models.IntegerField(default=0)
    ratingOut = models.CharField(max_length=30, default=0)
    rating = ()

    def updateEval(self):
        self.ratingOut = str(self.rating)

    def evaluateHand(self):
        self.rating = (0,0)
    
    def isRoyalFlush(self):
        for card in Card.objects.filter(hand=self.pk):
            print(card)

class Card(models.Model):
    suit = models.CharField(max_length=1, choices=SUIT_CHOICES)
    rank = models.CharField(max_length=2, choices=RANK_CHOICES)
    deck = models.ForeignKey(Deck(), null=True, on_delete=models.CASCADE)
    hand = models.ForeignKey(Hand(), null=True, on_delete=models.CASCADE)

class Pot(models.Model):
    moneyAmount = models.IntegerField(default=0)

class TurnOrder():
    order = deque()

    def convert(self, str):
        self.order.clear()
        for character in range(0, len(str)):
            if str[character].isdigit():
                self.order.append(str[character])
            

class Game(models.Model):
    turns = TurnOrder()
    name = models.CharField(max_length=10, null=True)
    deck = models.OneToOneField(Deck(), null=True, on_delete=models.CASCADE)
    pot = models.OneToOneField(Pot(), null=True, on_delete=models.CASCADE)
    turnOrder = models.CharField(max_length=5000, null=True)
    currentBetAmount = models.IntegerField(default=0)
    isFirstBetRound = models.BooleanField(default=True)
    isDrawingRound = models.BooleanField(default=False)
    isSecondBetRound = models.BooleanField(default=False)
    isFinished = models.BooleanField(default=False)

    def pullTurnOrder(self):
        if self.turnOrder == None:
            self.turns.convert("")
        else:
            self.turns.convert(self.turnOrder)
            self.turnOrder = None
            self.save()
        

    def updateTurnOrder(self):
        self.turnOrder = str(self.turns.order)[7:-2]
        self.save()
        self.turns.order.clear

    def checkFirstRoundOver(self):
        if self.isFirstBetRound == True:
            return True if self.turns.order == 0 else False
        else:
            return True
        
    def checkDrawingRoundOver(self):
        if self.isDrawingRound == True:
            return True if self.turns.order == 0 else False
        else:
            return True 
        
    def checkSecondRoundOver(self):
        if self.isSecondBetRound == True:
            return True if self.turns.order == 0 else False
        else:
            return True 

    def createTurnOrder(self):
        self.turns.order.clear
        players = Player.objects.filter(game=self.pk)
        if len(self.turns.order) != len(players):
            for x in players:
                self.turns.order.append(x.pk)

    def nextTurn(self):
        self.turns.order.rotate(1)


class Player(models.Model):
    money = models.PositiveBigIntegerField(default=0)
    game = models.ForeignKey(Game(), null=True, on_delete=models.CASCADE)
    hand = models.OneToOneField(Hand(), null=True, on_delete=models.CASCADE)
    name = models.CharField(max_length=25, null=True)
    canRaise = models.BooleanField(null=True)
    canFold = models.BooleanField(null=True)
    canCall = models.BooleanField(null=True)
    canCheck = models.BooleanField(default=True)
    canAllIn = models.BooleanField(null=True)
    action = models.CharField(max_length=5, null=True)
    betAmount = models.IntegerField(null=True)
    discardedCards = models.IntegerField(default=0)
    drawnCards = models.IntegerField(default=0)
    doneDrawing = models.BooleanField(default=False)

    def draw_card(self):
        game = Game.objects.get(pk=self.game)
        deck_cards = list(Card.objects.filter(deck=game.deck))
        chosen_card = random.sample(deck_cards, 1)
        hand = Hand.objects.get(pk=self.hand)
        chosen_card[0].deck = None
        chosen_card[0].hand = hand
        chosen_card[0].save()
        return hand

    def discard_card(self, cardID):
        game = Game.objects.get(pk=self.game)
        deck = Deck.objects.get(pk=game.deck)
        card = Card.objects.get(pk=cardID)
        card.deck = deck
        card.hand = None
        card.save()
        hand = Hand.objects.get(pk=self.hand)
        return hand

    def takeAction(self):
        self.checkActions()
        game = Game.objects.get(pk=self.game.pk)
        pot = Pot.objects.get(pk=game.pot.pk)
        game.name = "dumb"
        try:
            if self.action == "raise" and self.canRaise:
                self.money -= self.betAmount
                self.save()
                game.currentBetAmount += self.betAmount
                print(game.currentBetAmount)
                game.save()
                pot.moneyAmount += self.betAmount
                pot.save()
                game.turns.order.rotate(-1)
                game.save()
            elif self.action == "call" and self.canCall:
                self.money -= game.currentBetAmount
                pot.moneyAmount += game.currentBetAmount
                game.turns.order.rotate(-1)
            elif self.action == "allIn" and self.canAllIn:
                pot.moneyAmount += self.money
                self.money = 0
                game.turns.order.rotate(-1)
                game.turns.order.remove(str(self.pk))
            elif self.action == "check" and self.canCheck:
                game.turns.order.rotate(-1)
            else:
                game.turns.order.remove(str(self.pk))
                game.turns.order.rotate(-1)
            self.betAmount = None
            self.action = None
            return True
        except:
            return False


    def checkActions(self):
        game = Game.objects.get(pk=self.game.pk)
        self.canFold = True
        self.canAllIn = True
        if game.currentBetAmount > 0:
            self.canCheck = False
        if self.money > game.currentBetAmount:
            self.canRaise = True
            self.canCall = True
        elif self.money == game.currentBetAmount:
            self.canRaise = False
            self.canCall = True
        elif self.money < game.currentBetAmount:
            self.canRaise = False
            self.canCall = False
        elif self.money == 0:
            self.canRaise = False
            self.canFold = False
            self.canCall = False
            self.canAllIn = False
        self.save()


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
# def play_game(numselfs: int, arrUsers: [int]):
#     # just one deck and pot for the game, game created with ids of those objects
#     deckid = create_deck()
#     potid = create_pot()
#     game = create_game(pot=Pot.objects.get(pk=potid), deck=Deck.objects.get(pk=deckid))

    # import self info from db and create game "users"
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