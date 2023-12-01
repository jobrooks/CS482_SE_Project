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
    path("drawcard/<int:playerID>/", views.DrawCard.as_view()),
    path("discardcard/<int:playerID>/<int:cardID>/", views.DiscardCard.as_view()),
    path("taketurn/<int:playerID>/", views.TakeTurn.as_view()),
    path("creategame/", views.CreateGame.as_view()),
    path("startgame/<int:gameID>/", views.StartGame.as_view()),
    path("resetgame/<int:gameID>/", views.ResetGame.as_view()),
]