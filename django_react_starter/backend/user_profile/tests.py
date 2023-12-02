from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token
from user_api.models import User, GuestUser
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

class SecurityQuestionAPITest(APITestCase):
    def setUp(self):
        # Create a user with a security question
        self.user = User.objects.create(username='testuser', security_question='Sample question')
        self.token = Token.objects.create(user=self.user)

        # URL for the get_security_question view
        self.security_question_url = reverse('get_security_question', args=[self.user.username])

    def test_get_security_question_valid_user(self):
        response = self.client.get(self.security_question_url)

        # Check that the response has a status code of 200 (HTTP OK)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Check that the returned data contains the security question
        self.assertIn('security_question', response.json())

    def test_get_security_question_invalid_user(self):
        # Make a GET request with an invalid token
        response = self.client.get(reverse('get_security_question', args=['notUsername']))

        # Check that the response has a status code of 404 (HTTP Not Found)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # Check that the error message is present in the response
        self.assertIn('error', response.json())
        self.assertEqual(response.json()['error'], 'User not found')

class CheckUserExistsAPITest(APITestCase):
    def setUp(self):
        # Create a user
        self.user = User.objects.create(username='testuser')
        self.token = Token.objects.create(user=self.user)

        # URL for the check_user_exists view
        self.check_user_exists_url = reverse('check_user', args=[self.user.username])

    def test_check_user_exists_valid_user(self):
        response = self.client.get(self.check_user_exists_url)

        # Check that the response has a status code of 200 (HTTP OK)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Check that the returned data contains the 'user_exist' field
        self.assertIn('user_exist', response.json())
        self.assertTrue(response.json()['user_exist'])

    def test_check_user_exists_invalid_user(self):
        # Make a GET request with an invalid token
        response = self.client.get(reverse('check_user', args=['notUsername']))

        # Check that the response has a status code of 404 (HTTP Not Found)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # Check that the 'user_exist' field is False in the response
        self.assertIn('user_exist', response.json())
        self.assertFalse(response.json()['user_exist'])

class VerifyAnswerAPITest(APITestCase):
    def setUp(self):
        # Create a user with a security answer
        self.user = User.objects.create(username='testuser', security_answer='Sample answer')
        self.token = Token.objects.create(user=self.user)

        # URL for the verify_answer view
        self.verify_answer_url = reverse('verify_security_answer')

    def test_verify_answer_correct_answer(self):
        payload = {
            'username': 'testuser',
            'security_answer': 'Sample answer'
        }
        response = self.client.post(self.verify_answer_url, data=payload)

        # Check that the response has a status code of 200 (HTTP OK)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Check that the returned data contains 'is_answer_correct' as True
        self.assertIn('is_answer_correct', response.json())
        self.assertTrue(response.json()['is_answer_correct'])

    def test_verify_answer_incorrect_answer(self):
        payload = {
            'username': 'testuser',
            'security_answer': 'Incorrect answer'
        }
        response = self.client.post(self.verify_answer_url, data=payload)

        # Check that the response has a status code of 200 (HTTP OK)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Check that the returned data contains 'is_answer_correct' as False
        self.assertIn('is_answer_correct', response.json())
        self.assertFalse(response.json()['is_answer_correct'])

    def test_verify_answer_invalid_user(self):
        payload = {
            'username': 'nonexistentuser',
            'security_answer': 'Sample answer'
        }
        response = self.client.post(self.verify_answer_url, data=payload)

        # Check that the response has a status code of 404 (HTTP Not Found)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # Check that the 'error' field is present in the response
        self.assertIn('error', response.json())

class UpdateUserPasswordAPITest(APITestCase):
    def setUp(self):
        # Create a user
        self.user = User.objects.create(username='testuser', password='password')
        self.token = Token.objects.create(user=self.user)

        # URL for the update_user_password view
        self.update_user_password_url = reverse('reset_password')

    def test_update_user_password_valid_user(self):
        payload = {
            'username': 'testuser',
            'newPassword': 'newpassword'
        }
        response = self.client.put(self.update_user_password_url, data=payload)

        # Check that the response has a status code of 200 (HTTP OK)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Check that the returned data contains the 'token' field
        self.assertIn('token', response.json())

    def test_update_user_password_invalid_user(self):
        payload = {
            'username': 'nonexistentuser',
            'newPassword': 'newpassword'
        }
        response = self.client.put(self.update_user_password_url, data=payload)

        # Check that the response has a status code of 404 (HTTP Not Found)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # Check that the 'error' field is present in the response
        self.assertIn('error', response.json())

    def test_update_user_password_missing_password(self):
        payload = {
            'username': 'testuser',
            'newPassword': ''
        }
        response = self.client.put(self.update_user_password_url, data=payload)

        # Check that the response has a status code of 400 (HTTP Bad Request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Check that the 'error' field is present in the response
        self.assertIn('error', response.json())

class GetGuestProfileTests(APITestCase):
    def setUp(self):
        self.username = 'test_guest'
        self.url = reverse('get_guest_profile', args=[self.username])

    def test_get_guest_profile_success(self):
        guest = GuestUser.objects.create(username=self.username)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_guest_profile_not_found(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.json(), {"error": "Guest not found"})

class TableThemeTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create(username='test_user')
        self.token = Token.objects.create(user=self.user)
        self.url = reverse('table_theme', args=[self.token.key])

    def test_get_table_theme_success(self):
        user = User.objects.get(auth_token=self.token.key)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_patch_table_theme_success(self):
        data = {"table_theme": "new_table_theme"}
        response = self.client.patch(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(User.objects.get(id=self.user.id).table_theme, "new_table_theme")

    def test_patch_table_theme_bad_request(self):
        # Test with invalid data (missing card_backing)
        data = {"invalid_field": "value"}
        response = self.client.patch(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_patch_table_theme_user_not_found(self):
        # Test when the user is not found
        invalid_url = reverse('table_theme', args=['invalid_token'])
        data = {"table_theme": "new_table_theme"}
        response = self.client.patch(invalid_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.json(), {"error": "User Not found"})

class GuestTableThemeTests(APITestCase):
    def setUp(self):
        self.username = 'test_guest'
        self.url = reverse('guest_table_theme', args=[self.username]) 

    def test_get_table_theme_success_guest(self):
        guest = GuestUser.objects.create(username=self.username)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_patch_table_theme_success_guest(self):
        guest = GuestUser.objects.create(username=self.username)
        response = self.client.patch(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_patch_table_theme_bad_request_guest(self):
        response = self.client.patch(self.url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

class CardBackingTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create(username='testuser', security_question='Sample question')
        self.token = Token.objects.create(user=self.user)

        self.url = reverse('card_backing', args=[self.token.key])

    def test_get_card_backing_success(self):
        user = User.objects.get(auth_token=self.token.key)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_patch_card_backing_success(self):
        data = {"card_backing": "new_card_backing"}
        response = self.client.patch(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(User.objects.get(id=self.user.id).card_backing, "new_card_backing")

    def test_patch_card_backing_bad_request(self):
        # Test with invalid data (missing card_backing)
        data = {"invalid_field": "value"}
        response = self.client.patch(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_patch_card_backing_user_not_found(self):
        # Test when the user is not found
        invalid_url = reverse('card_backing', args=['invalid_token'])
        data = {"card_backing": "new_card_backing"}
        response = self.client.patch(invalid_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.json(), {"error": "User Not found"})


class GuestCardBackingTests(APITestCase):
    def setUp(self):
        self.username = 'test_guest'
        self.url = reverse('guest_card_backing', args=[self.username]) 

    def test_get_card_backing_success_guest(self):
        guest = GuestUser.objects.create(username=self.username)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_patch_card_backing_bad_request_guest(self):
        guest = GuestUser.objects.create(username=self.username)
        # Test with invalid data (missing card_backing)
        data = {"invalid_field": "value"}
        response = self.client.patch(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_patch_card_backing_guest_not_found(self):
        # Test when the user is not found
        invalid_url = reverse('guest_card_backing', args=['invalid_user'])
        data = {"card_backing": "new_card_backing"}
        response = self.client.patch(invalid_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.json(), {"error": "Guest Not found"})

