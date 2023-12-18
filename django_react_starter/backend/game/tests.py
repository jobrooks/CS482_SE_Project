from django.test import TestCase
# from rest_framework.test import APIClient
from rest_framework import status
from game.models import Game, Player, Hand, Card, Deck, Pot  # Import other models as needed
from game.serializers import GameSerializer, PlayerSerializer, HandSerializer, CardSerializer, DeckSerializer, PotSerializer  # Import other serializers as needed

class TestPlayer(TestCase):
    def setUp(self):
        hand = Hand.objects.create(name="test")
        game = Game.objects.create(name="test")
        Player.objects.create(name="test", hand=hand, game=game)
    def testPlayerMethods(self):
        # Test to make sure all player methods work properly and as intended.
        player = Player.objects.get(name="test")
        game = Game.objects.get(name="test")
        hand = Hand.objects.get(name="test")
        # First assign player some money and set a currentBetAmount on the game.
        player.money = 200
        game.currentBetAmount = 100
        player.save()
        game.save()
        player.checkActions(game=game)
        self.assertEqual(player.canAllIn, True)
        self.assertEqual(player.canFold, True)
        self.assertEqual(player.canRaise, True)
        self.assertEqual(player.canCall, True)
        self.assertEqual(player.canCheck, False)
    def testCardEval(self):
        hand = Hand.objects.get(name="test")
        card = Card.objects.create(suit=('H', 'Hearts'), rank=('10', 'Ten'), hand=hand)
        card = Card.objects.create(suit=('H', 'Hearts'), rank=('05', 'Five'), hand=hand)
        card = Card.objects.create(suit=('H', 'Hearts'), rank=('12', 'Queen'), hand=hand)
        card = Card.objects.create(suit=('H', 'Hearts'), rank=('13', 'King'), hand=hand)
        card = Card.objects.create(suit=('H', 'Hearts'), rank=('07', 'Seven'), hand=hand)

        hand.evaluateHand()
        print(hand.ratingOut)
        

# class PokerModelTestCase(TestCase):

#     # test if card created correctly
#     def test_create_card(self):
#         card = Card.objects.create(suit='H', rank='A')
#         self.assertEqual(card.suit, 'H')
#         self.assertEqual(card.rank, 'A')

#     # testing play_game method
#     def playing_game(self):

#         print("hi")

# class GameListTestCase(TestCase):
#     def setUp(self):
#         self.client = APIClient()
    
#     def test_get_games(self):
#         response = self.client.get('http://127.0.0.1:8000/game/')
#         self.assertEqual(response.status_code, status.HTTP_200_OK)

#     def test_create_game(self):
#         data = {'name': 'Test Game'}
#         response = self.client.post('http://127.0.0.1:8000/game/', data)
#         self.assertEqual(response.status_code, status.HTTP_201_CREATED)
#         self.assertEqual(Game.objects.count(), 1)

#     # fix model to not let this happen
#     # def test_create_game_invalid_data(self):
#     #     bad_data = {'invalid_field': 'Invalid Value'}
#     #     response = self.client.post('http://127.0.0.1:8000/game/', bad_data)
#     #     #self.assertEqual(Game.objects.count(), 0)
#     #     self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

# class DeckListTestCase(TestCase):
#     def setUp(self):
#         self.client = APIClient()
    
#     def test_get_decks(self):
#         response = self.client.get('http://127.0.0.1:8000/deck/')
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
    
#     def test_create_deck(self):
#         data = {'name': 'thedeck'}  # Replace with your actual data
#         response = self.client.post('http://127.0.0.1:8000/deck/', data)
#         self.assertEqual(response.status_code, status.HTTP_201_CREATED)
#         self.assertEqual(Deck.objects.count(), 1)

"""
class DrawCardTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.deck = Deck.objects.create()
        self.hand = Hand.objects.create(name="Test Hand")
    
    def test_draw_card(self):
        response = self.client.get(f'/draw-card/{self.deck.id}/{self.hand.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Add assertions for the drawn card based on your serializer
"""

"""

# Add more test cases for other views as needed

class PlayerDetailTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.player = Player.objects.create(money=100)
    
    def test_get_player(self):
        response = self.client.get(f'/players/{self.player.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_update_player(self):
        data = {'money': 150}
        response = self.client.put(f'/players/{self.player.id}/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.player.refresh_from_db()
        self.assertEqual(self.player.money, 150)

# Add more test cases for other views as needed

"""

"""

class RoundDetailTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.game = Game.objects.create(name="Test Game")
        self.round = Round.objects.create(game=self.game)

    def test_get_rounds(self):
        response = self.client.get('http://127.0.0.1:8000/round/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)  
    
    def test_get_specific_round(self):
        response = self.client.get(f'http://127.0.0.1:8000/round/{self.round.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    

    def test_update_round(self):
        data = {'some_field': 'new_value'}
        response = self.client.put(f'/rounds/{self.round.id}/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.round.refresh_from_db()
        # Add assertions for updated data based on your serializer

    # see if card is 52 long
    # see if it contains Ace of Hearts and 2 of Hearts
    def test_create_standard_deck(self):
        deck = Deck.objects.create(name="Test Deck")

        # Check if there are 52 cards in the deck
        self.assertEqual(deck.cards.count(), 52)

        # Check if the deck contains a specific card
        self.assertTrue(deck.cards.filter(suit='H', rank='A').exists())
        self.assertTrue(deck.cards.filter(suit='H', rank='2').exists())
    

    # see if pulling from deck into hand works
    def test_pulling_from_Deck(self):

        deck = Deck.objects.create(name="Test Deck")
        hand = Hand.objects.create(name="test hand")

        self.assertEqual(deck.cards.count(), 52)
        self.assertEqual(hand.cards.count(), 0)

        # draw first card from Deck and put in hand
        hand.draw_card_from_deck(deck)

        #check if length reduces
        self.assertEqual(deck.cards.count(), 51)
        self.assertEqual(hand.cards.count(), 1)
        
        #card in hand should be 2 of hearts
        self.assertEqual(str(hand.cards.first()), '2 of Hearts')

    # see if code will allow you to draw more than 5
    def test_hand_bigger_than_five(self):

        deck = Deck.objects.create(name="test_deck")
        hand = Hand.objects.create(name="test_hand")

        for i in range(10):
            hand.draw_card_from_deck(deck)

        self.assertEqual(hand.cards.count(), 5)

    # see if code will allow you to add duplicates to deck
    def test_add_duplicate_card_to_deck(self):

        deck = Deck.objects.create(name="test_deck")
        hand = Hand.objects.create(name="test_hand")

        # create duplicate card and add to hand
        # no functionality for hand to get cards from anywhere other than deck, but just to test
        extra_card = Card.objects.create(suit='H', rank='2')
        hand.cards.add(extra_card)

        hand.return_card_to_deck(deck, extra_card)
        self.assertEqual(deck.cards.count(), 52)

    #if i pull 5 times from the top of the ordered deck, it should be hearts 2-6 in my hand
    def test_pulling_from_top(self):
        deck = Deck.objects.create(name="test_deck")
        hand = Hand.objects.create(name="test_hand")

        for i in range(6):
            hand.draw_card_from_deck(deck)

        self.assertEqual(str(hand.cards.all()[0]), '2 of Hearts')
        self.assertEqual(str(hand.cards.all()[1]), '3 of Hearts')
        self.assertEqual(str(hand.cards.all()[2]), '4 of Hearts')
        self.assertEqual(str(hand.cards.all()[3]), '5 of Hearts')
        self.assertEqual(str(hand.cards.all()[4]), '6 of Hearts')

    # test adding back to deck
    def test_add_to_deck(self):
        deck = Deck.objects.create(name="test_deck")
        hand = Hand.objects.create(name="test_hand")

        hand.draw_card_from_deck(deck)

        #check if card drawn is 2 of hearts
        self.assertEqual(str(hand.cards.all()[0]), '2 of Hearts')
        self.assertEqual(deck.cards.count(), 51)
        # put it back in the deck
        hand.return_card_to_deck(deck, hand.cards.first())

        #see if it made it
        #self.assertTrue(deck.cards.filter(suit='2', rank='H').exists())
        #self.assertEqual(deck.cards.count(), 52)
        self.assertEqual(str(deck.cards.all()[deck.cards.count()-1]), '2 of Hearts')



    # pull 5, adding to the end of the deck, the top should now be 7 of hearts
    # the last 5 should be 2-6 of hearts
    def test_adding_to_bottom(self):
        deck = Deck.objects.create(name="test_deck")
        hand = Hand.objects.create(name="test_hand")

        # pull 5 cards
        for i in range(5):
            hand.draw_card_from_deck(deck)

        self.assertEqual(hand.cards.count(), 5)
        # make sure deck is less now
        self.assertEqual(deck.cards.count(), 47)

        # check if i got the right cards
        self.assertEqual(str(hand.cards.all()[0]), '2 of Hearts')
        self.assertEqual(str(hand.cards.all()[1]), '3 of Hearts')
        self.assertEqual(str(hand.cards.all()[2]), '4 of Hearts')
        self.assertEqual(str(hand.cards.all()[3]), '5 of Hearts')
        self.assertEqual(str(hand.cards.all()[4]), '6 of Hearts')

        # put cards back in deck
        for i in range(4):
            hand.return_card_to_deck(deck, hand.cards.first())

        # check if card made it to deck
        self.assertTrue(deck.cards.filter(suit='2', rank='H').exists())

        #verify the last 5 in deck
        self.assertEqual(str(deck.cards.all()[deck.cards.count()-1]), '6 of Hearts')
        self.assertEqual(str(deck.cards.all()[deck.cards.count()-2]), '5 of Hearts')
        self.assertEqual(str(deck.cards.all()[deck.cards.count()-3]), '4 of Hearts')
        self.assertEqual(str(deck.cards.all()[deck.cards.count()-4]), '3 of Hearts')
        self.assertEqual(str(deck.cards.all()[deck.cards.count()-5]), '2 of Hearts')
        
"""
