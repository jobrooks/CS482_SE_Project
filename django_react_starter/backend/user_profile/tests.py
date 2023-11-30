from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token
from user_api.models import User
from rest_framework import status
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

        if 'avatar' in response.json():
            self.assertIsInstance(response.json()['avatar'], str)

    def test_get_user_profile_invalid_token(self):
        # Make a GET request with an invalid token
        response = self.client.get(reverse('get_user_profile', args=['invalid-token']))

        # Check that the response has a status code of 404 (HTTP Not Found)
        self.assertEqual(response.status_code, 404)

        # Check that the error message is present in the response
        self.assertEqual(response.json()['error'], 'User not found')

class UpdateUserProfileAPITest(APITestCase):
    def setUp(self):
        # Create a user and a token for testing
        self.user = User.objects.create(username='testuser', password='password')
        self.token = Token.objects.create(user=self.user)

        # URL for the update_user_profile view
        self.update_profile_url = reverse('update_user_profile', args=[self.token.key])

    def test_update_user_profile_valid_token(self):
        # Assume you have a valid payload for the update
        valid_payload = {
            'username': 'new_username',
            'email': 'new_email@example.com',
            'first_name': 'New',
            'last_name': 'User',
            'bio': 'New bio',
            'password': self.user.password
        }

        # Make a PUT request with a valid token and payload
        response = self.client.put(self.update_profile_url, data=valid_payload)

        # Check that the response has a status code of 200 (HTTP OK)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Check that the returned data contains the expected fields
        self.assertIn('username', response.json())
        self.assertIn('email', response.json())
        self.assertIn('first_name', response.json())
        self.assertIn('last_name', response.json())
        self.assertIn('bio', response.json())

    def test_update_user_profile_invalid_token(self):
        # Make a PUT request with an invalid token
        invalid_token_url = reverse('update_user_profile', args=['invalid-token'])
        response = self.client.put(invalid_token_url)

        # Check that the response has a status code of 404 (HTTP Not Found)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # Check that the error message is present in the response
        self.assertIn('error', response.json())
        self.assertEqual(response.json()['error'], 'User not found')

