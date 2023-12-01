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
    def resetToDefault(self, player):
        cards = Card.objects.filter(pk=player.hand.pk)
        if len(cards) > 0:
            for card in cards:
                card.deck = self

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

    def resetToDefault(self):
        self.moneyAmount = 0
        self.save()

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
    playersPassed = models.IntegerField(default=0)
    currentBetAmount = models.IntegerField(default=0)
    isFirstBetRound = models.BooleanField(default=True)
    isDrawingRound = models.BooleanField(default=False)
    isSecondBetRound = models.BooleanField(default=False)
    isFinished = models.BooleanField(default=False)

    def resetToDefault(self):
        self.turnOrder = ""
        self.currentBetAmount = 0
        self.playersPassed = 0
        self.isFirstBetRound = True
        self.isDrawingRound = False
        self.isSecondBetRound = False
        self.isFinished = False
        self.turns.order.clear()
        self.save()

    def incrementDoneDrawing(self):
        self.playersDoneDrawing += 1
        self.save()

    def incrementPlayer(self):
        self.playersPassed += 1
        self.save()

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

    def checkBetAmount(self):
        amount = None
        for player in Player.objects.filter(game=self.pk):
            if amount == None:
                amount = player.totalAmountBet
            if amount != player.totalAmountBet:
                return False
        return True

    def checkFirstRoundOver(self):
        players = Player.objects.filter(game=self.pk)
        if self.isFirstBetRound == True:
            return True if len(self.turns.order) == 0 or (self.playersPassed >= len(players) and len(self.turns.order) == 1) or (self.playersPassed >= len(players) and self.checkBetAmount()) else False
        else:
            return True
        
    def checkDrawingRoundOver(self):
        if self.isDrawingRound == True:
            return True if self.turns.order == 0 else False
        else:
            return True 
        
    def checkSecondRoundOver(self, game):
        game.pullTurnOrder()
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
    canCheck = models.BooleanField(null=True)
    canAllIn = models.BooleanField(null=True)
    action = models.CharField(max_length=5, null=True)
    betAmount = models.IntegerField(null=True)
    totalAmountBet = models.IntegerField(default=0)
    discardedCards = models.IntegerField(default=0)
    drawnCards = models.IntegerField(default=0)
    doneDrawing = models.BooleanField(default=False)
    
    def drawStartingCards(self, game):
        deck = Deck.objects.get(pk=game.deck.pk)
        hand = Hand.objects.get(pk=self.hand.pk)
        for i in range(0, 5):
            self.draw_card(hand=hand, deck=deck)

    def softReset(self):
        self.action = None
        self.betAmount = None
        self.canCall = None
        self.canAllIn = None
        self.canCheck = None
        self.canFold = None
        self.canRaise = None
        self.totalAmountBet = 0
        self.discardedCards = 0 
        self.drawnCards = 0
        self.doneDrawing = False
        self.save()

    def resetToDefault(self):
        self.money = 1000
        self.action = None
        self.betAmount = None
        self.canCall = None
        self.canAllIn = None
        self.canCheck = None
        self.canFold = None
        self.canRaise = None
        self.totalAmountBet = 0
        self.discardedCards = 0 
        self.drawnCards = 0
        self.doneDrawing = False
        self.save()

    def checkIfDrawingDone(self, game):
        return True if self.doneDrawing else False

    def draw_card(self, hand, deck):
        deck_cards = list(Card.objects.filter(deck=deck))
        chosen_card = random.sample(deck_cards, 1)
        chosen_card[0].deck = None
        chosen_card[0].hand = hand
        chosen_card[0].save()
        return hand

    def discard_card(self, cardID, hand, deck):
        game = Game.objects.get(pk=self.game)
        deck = Deck.objects.get(pk=game.deck)
        card = Card.objects.get(pk=cardID)
        card.deck = deck
        card.hand = None
        card.save()
        hand = Hand.objects.get(pk=self.hand)
        return hand

    def takeAction(self, game, pot):
        try:
            if self.action == "raise" and self.canRaise:
                self.money -= self.betAmount + game.currentBetAmount
                self.totalAmountBet += self.betAmount + game.currentBetAmount
                game.currentBetAmount += self.betAmount
                pot.moneyAmount += self.betAmount
                game.turns.order.rotate(-1)
            elif self.action == "call" and self.canCall:
                self.money -= game.currentBetAmount
                self.totalAmountBet += game.currentBetAmount
                pot.moneyAmount += game.currentBetAmount
                game.turns.order.rotate(-1)
            elif self.action == "allIn" and self.canAllIn:
                pot.moneyAmount += self.money
                game.currentBetAmount += self.money
                self.totalAmountBet += self.money
                self.money = 0
                game.turns.order.remove(str(self.pk))
                game.turns.order.rotate(-1)
            elif self.action == "check" and self.canCheck:
                game.turns.order.rotate(-1)
            elif self.action == "fold" and self.canFold:
                game.turns.order.remove(str(self.pk))
                game.turns.order.rotate(-1)
            else:
                return False
            self.save()
            pot.save()
            game.save()
            return True
        except:
            return False

    def checkActions(self, game):
        self.canFold = True
        self.canAllIn = True
        if game.currentBetAmount > 0:
            self.canCheck = False
        else:
            self.canCheck = True
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