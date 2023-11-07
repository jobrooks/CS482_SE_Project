from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.

class User(AbstractUser):
    wins = models.models.PositiveIntegerField(default=0)
    avatar = models.ImageField(null=True, blank=True)
    bio = models.TextField(max_length=500, null=True, blank=True)
    games_played = models.PositiveIntegerField(default=0)
    class Meta:
        db_table = 'auth_user'