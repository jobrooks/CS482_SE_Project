from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path("player/<int:pk>", views.PlayerDetail.as_view()),
    path("player/", views.PlayerList.as_view()),
    path("game/<int:pk>/", views.GameDetail.as_view()),
    path("game/", views.GameList.as_view()),
    path("hand/<int:pk>/", views.HandDetail.as_view()),
    path("hand/", views.HandList.as_view()),
    path("deck/", views.DeckList.as_view()),
    path("deck/<int:pk>", views.DeckDetail.as_view()),
]