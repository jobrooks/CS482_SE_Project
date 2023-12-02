from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.

class User(AbstractUser):
    TABLE_THEME_CHOICES = [
        ("blue", "Blue"),
        ("green", "Green"),
    ]
    CARD_BACKING_CHOICES = [
        ("red", "Red"),
        ("green", "Green"),
        ("blue", "Blue"),
    ]
    
    wins = models.PositiveIntegerField(default=0)
    avatar = models.ImageField(upload_to='avatars/', height_field=None, width_field=None, max_length=None, null=True, blank=True)
    bio = models.TextField(max_length=500, null=True, blank=True)
    games_played = models.PositiveIntegerField(default=0)
    money = models.PositiveIntegerField(default=0)
    avatar_color = models.TextField(max_length=500, null=True, blank=True)
    table_theme = models.TextField(max_length=500, choices=TABLE_THEME_CHOICES, null=True, blank=True)
    card_backing = models.TextField(max_length=500, choices=CARD_BACKING_CHOICES, null=True, blank=True)
    security_question = models.CharField(max_length=255, null=False,default='')
    security_answer = models.CharField(max_length=128, null=False,default='')

    class Meta:
        db_table = 'auth_user'