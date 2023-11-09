from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token
from user_api.models import User
from django.urls import reverse

class UserProfileAPITest(APITestCase):
    def setUp(self):
        # Create a user and a token for testing
        self.user = User.objects.create(username='testuser')
        self.token = Token.objects.create(user=self.user)

        # URL for the get_user_profile view
        self.profile_url = reverse('get_user_profile', args=[self.token.key])

    def test_get_user_profile_valid_token(self):
        response = self.client.get(self.profile_url)

        # Check that the response has a status code of 200 (HTTP OK)
        self.assertEqual(response.status_code, 200)

        # Check that the returned data contains the expected fields
        self.assertIn('username', response.json())
        self.assertIn('wins', response.json())
        self.assertIn('games_played', response.json())
        self.assertIn('bio', response.json())

        # You can add more specific checks based on your actual data and model structure
        # For example, if 'avatar' is expected to be a URL, you can check that it is a string
        if 'avatar' in response.json():
            self.assertIsInstance(response.json()['avatar'], str)

    def test_get_user_profile_invalid_token(self):
        # Make a GET request with an invalid token
        response = self.client.get(reverse('get_user_profile', args=['invalid-token']))

        # Check that the response has a status code of 404 (HTTP Not Found)
        self.assertEqual(response.status_code, 404)

        # Check that the error message is present in the response
        self.assertEqual(response.json()['error'], 'User not found')
