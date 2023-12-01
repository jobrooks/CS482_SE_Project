# Step 1: Creating a Game Instance with Player Instances

## **A.1 Create Game Instance**

Call the Create Game Endpoint, at the following URL:

```"/creategame/"```

Once called, it should create a basic game object. 

**IMPORTANT**: Save the game ID from this object.

## **A.2 Verify Game Creation**

Once game is created properly through creategame endpoint, navigate to:

```"/game/<int:pk>"```

You should see your game displayed here, along with IDs for the pot, deck, and an empty turnorder.

**Note**: isFirstBetround should be set to true, and all other rounds set to false. Verify this as well.

If you see this, you have properly created a game.

## **B.1 Create Player Instance(s)**

Call the PlayerList endpoint, and make a POST request to create a new Player object. URL:

```"/player/"```

**NOTE:** Ensure that the 'game' field is propagated with the 'gameID' saved from **A.1**.

This method will also create an associated hand for this player. Ensure you save your PlayerID, it is the main way you can communicate with the endpoints.

## **C.1 Call Start Game**

This "starts" the game, allowing one of the players to take a turn.

Make a call to the following endpoint and supply the gameID:

```"/startgame/<int:gameID>"```

## **C.2 Verify Turn Order**

Similar to **A.2**, check the following endpoint to make sure the turn order is properly initialized:

```"/game/"```

## **D.1 Start First Betting Round**

**Note:** To determine which player's turn it is, look at the 'turnOrder' attribute on the game. The first number listed is the player who will go first, by playerID.

Call the following endpoint with the appropriate playerID to take a turn as that player:

```"/taketurn/<int:playerID>"```

You will need to pass one of five different string codes into the put request in order to take a turn.

```
"fold" --> Standard fold behavior, removes player from the round, and they don't get a chance at winning any of the money they put in.

Note: Any string will technically work for folding, but put 'fold' to avoid any issues.

"raise" --> Standard raise behavior, removes the betAmount specified from the player's money amount. 

"call" --> Standard call behavior, matches whatever the 'currentBetAmount' is. 

"allIn" --> Standard allIn behavior, puts in all of the player's money. Removes them from the turnOrder.

"check" --> Standard check or pass behavior, will go to next player's turn, as long as no one has raised.

```

On a successful turn, you will see the following JSON return:

```
{
    "Turn Successful": true
}
```

## **D.2 Folding**

To fold, make a PUT call to this API endpoint:

```"/taketurn/<int:playerID>"```

In the 'action' attribute of the PUT request, put "fold".

*Note: betAmount is not necessary for this request.*

## **D.3 Raising**

To raise, make a PUT call to this API endpoint:

```"/taketurn/<int:playerID>"```

In the 'action' attribute of the PUT request, put "raise", and in the 'betAmount' attribute, include the amount the player wishes to raise.