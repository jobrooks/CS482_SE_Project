from django.test import TestCase
from game.models import Card, Deck, Hand


class GameModelTestCase(TestCase):

    # see if Card made correctly
    def test_card_creation(self):
        card = Card.objects.create(suit='H', rank='A')
        self.assertEqual(str(card), 'Ace of Hearts')

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

    


"""
class PokerModelTestCase(TestCase):
    def test_create_card(self):
        card = Card.objects.create(suit='H', rank='A')
        self.assertEqual(card.suit, 'H')
        self.assertEqual(card.rank, 'A')

    def test_create_deck(self):
        deck = Deck.objects.create()
        card = Card.objects.create(suit='H', rank='A')
        deck.cards.add(card)
        print(type(deck.cards))
        #self.assertEqual(len(deck.cards) > 0)

    def test_deck(self):
        d = Deck()
        c = Card()
        c.suit = 'H'
        c.rank = '2'
        d.cards.add(c)
        print(type(d.cards))
        """
