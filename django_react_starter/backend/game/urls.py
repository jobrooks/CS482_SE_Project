from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path("player/<int:pk>/", views.PlayerDetail.as_view()),
    path("player/", views.PlayerList.as_view()),
    path("game/<int:pk>/", views.GameDetail.as_view()),
    path("game/", views.GameList.as_view()),
    path("hand/<int:pk>/", views.HandDetail.as_view()),
    path("hand/", views.HandList.as_view()),
    path("deck/", views.DeckList.as_view()),
    path("deck/<int:pk>", views.DeckDetail.as_view()),
    path("round/", views.RoundList.as_view()),
    path("round/<int:pk>", views.RoundDetail.as_view()),
    path("drawcard/<int:deckID>/<int:handID>/", views.DrawCard.as_view()),
    path("discardcard/<int:cardID>/<int:deckID>/", views.DiscardCard.as_view()),
    path("taketurn/<int:playerID>", views.TakeTurn.as_view()),
]