from django.db import models
from django.contrib.auth.models import AbstractUser
from game.models import Game
# Create your models here.

class User(AbstractUser):
    wins = models.PositiveIntegerField(default=0)
    avatar = models.ImageField(upload_to='avatars/', height_field=None, width_field=None, max_length=None, null=True, blank=True)
    bio = models.TextField(max_length=500, null=True, blank=True)
    games_played = models.PositiveIntegerField(default=0)
    game_id = models.ForeignKey(Game,on_delete=models.CASCADE, null=True)
    money = models.PositiveIntegerField(default=0)
    class Meta:
        db_table = 'auth_user'