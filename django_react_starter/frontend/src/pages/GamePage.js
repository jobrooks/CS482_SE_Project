import React from "react";
import axios from "axios";

import NavBar from "../components/NavBar";
import SmallUserCard from "../components/UserCards/SmallUserCard";
import GameActions from '../components/GamePlay/GameActions';

import {Box, Stack, Avatar, Typography, Checkbox, Card, Button, CardMedia, Grid} from "@mui/material";
import MyCardsView from "../components/PlayingCardViews/MyCardsView";
import { useLocation } from "react-router-dom";

class GamePage extends React.Component {

  constructor(props) {
    super(props);
    this.getSessionToken = this.getSessionToken.bind(this);
    this.getMyUserData = this.getMyUserData.bind(this);
    this.getFriends = this.getFriends.bind(this);
    this.getFriendInviteList = this.getFriendInviteList.bind(this);
    this.createGame = this.createGame.bind(this);
    this.invitePlayersToGame = this.invitePlayersToGame.bind(this);
    this.handleInvitePlayer = this.handleInvitePlayer.bind(this);
    this.createGameExecutor = this.createGameExecutor.bind(this);
    this.startGame = this.startGame.bind(this);
    this.startGameExecutor = this.startGameExecutor.bind(this);
    this.getCreateGamePage = this.getCreateGamePage.bind(this);
    this.getStartGamePage = this.getStartGamePage.bind(this);
    this.getPlayGamePage = this.getPlayGamePage.bind(this);
    this.getGameWebsocket = this.getGameWebsocket.bind(this);
    this.getCurrentPlayersList = this.getCurrentPlayersList.bind(this);
    this.joinGame = this.joinGame.bind(this);
    this.getCurrentPlayers = this.getCurrentPlayers.bind(this);
    this.state = {
      // Data
      myUsername: null,
      myUserData: null,
      myPlayerId: null,
      gameId: null,
      // Internal State
      sessionToken: null,
      selectedPlayers: [],
      friends: [],
      currentPage: "create", // [ "create", "start", "play" ]
      // Game State
      gameState: null,
      myPlayerData: null,
      players: [],
      // Game websocket
      gameSocket: null,
    }
  }

  componentDidMount() {
    this.getSessionToken()
    .then(this.getMyUserData)
    .then(this.getFriends)
    .then(() => {
      let location = this.props.location; // Get location data that may have been passed if this was a join
      if (location.state !== null) { // Execute if player is joining an already made game
        this.setState({ gameId: location.state.gameId }, () => { // use callback to execute after state change
          this.getGameWebsocket()
          .then(this.joinGame)
          .then(this.getCurrentPlayers)
          .then(this.setState({ currentPage: "start" }));
          window.history.replaceState({}, document.title) // Clear location data from page
        });     
      }
    })
  }

  createGameExecutor() {
    this.createGame()
    .then(this.getGameWebsocket)
    .then(this.invitePlayersToGame)
    .then(this.joinGame)
    .then(this.getCurrentPlayers)
    .then(this.setState({ currentPage: "start" })); // Do this last
  }

  startGameExecutor() {
    this.startGame()
    // .then(this.setState({ currentPage: "play" })); // Execute last
  }

  createGame() {
    return new Promise((resolve, reject) => {
      const gameName = this.state.myUsername + "'s game";
      const gameData = {
        "name": gameName,
      };

      return axios.post(`http://localhost:8000/creategame/`, gameData) // Create game
      .then((response) => {
        console.log("Successfully created game with id: " + response.data.id);
        this.setState({ gameId: response.data.id }, () => {
          resolve("Created game with id: " + this.state.gameId);
        });
      })
      .catch((response) => {
        console.log(response);
      });
    });
  }

  joinGame() {
    return new Promise((resolve, reject) => {
      console.log("Joining game " + this.state.myUsername)
      const playerData = {
        "money": 100, // Likely needs to be changed, starting money should be an option
        "name": this.state.myUsername,
        "id": this.state.myUserData.id,
        "game": this.state.gameId,
      }

      axios.post(`http://localhost:8000/player/`, playerData)
      .then((response) => {
        this.setState({ myPlayerData: response.data }, () => {
          console.log("Player Data: ", this.state.myPlayerData);
          this.state.gameSocket.send(JSON.stringify({event: "player_join", username: this.state.myUsername}));
          resolve("Added my player to game");
        });
        console.log("added player: " + this.state.myUsername);
      })
      .catch((response) => {
        console.log("idk player not added")
      }).finally((response) => {
        // playersAdded++;
        // if(playersAdded === this.state.selectedPlayers.length) {
        // this.setState({ players: [ this.state.myUsername, ...this.state.players ] }) // not needed to add yourself
        
        // }
      });
    })
  }

  startGame() {
    return new Promise((resolve, reject) => {
      axios.get(`http://localhost:8000/startgame/${this.state.gameId}`)
      .then((response) => {
        this.getGameData();
      })
      .catch((response) => {
        console.log("Error starting game");
      })
      .finally(() => {
        this.state.gameSocket.send(JSON.stringify({ event: "start_game", username: this.state.myUsername }))
        resolve("Finished starting game");
      });
    });
  }

  getGameData() {
    return new Promise((resolve, reject) => {
      axios.get(`http://localhost:8000/game/${this.state.gameId}`)
      .then((response) => {
        this.setState({ gameData: response.data });
      })
      .catch((response) => {
        console.log("Error getting game data");
      })
      .finally(() => {
        resolve("Finished getting game data");
      });
    });
  }

  invitePlayersToGame() {
    return new Promise((resolve, reject) => {
      let playersAdded = 0;
      this.state.selectedPlayers.forEach( (userData) => {
        if (userData.username !== this.state.myUsername) {
          // const playerData = {
          //   "money": 100, // Likely needs to be changed, starting money should be an option
          //   "name": userData.username,
          //   "id": userData.id,
          //   "game": this.state.gameId,
          // }

          let inviteData = {
            game_id: this.state.gameId,
            sender: this.state.myUsername,
          }

          axios.post(`http://localhost:8000/invites/invite/${userData.username}`, inviteData) // Send invite
          .then((response) => {
            console.log("Invited player: " + userData.username);
          })
          .catch((response) => {
            console.log("Failed to invite player: " + userData.username);
          }).finally((response) => {
            playersAdded++;
            console.log(playersAdded, this.state.selectedPlayers.length)
            if(playersAdded === this.state.selectedPlayers.length - 1) {
              resolve("Added all invited to game");
            }
          });
    
          // axios.post(`http://localhost:8000/player/`, playerData)
          // .then((response) => {
          //   this.setState({ players: [ playerData, ...this.state.players ] });
          //   console.log("added player: " + userData.username);
          // })
          // .catch((response) => {
          //   console.log("idk player not added")
          // }).finally((response) => {
          //   playersAdded++;
          //   if(playersAdded === this.state.selectedPlayers.length) {
          //     resolve("Added all players to game");
          //   }
          // });
        }
      });
      resolve("Noone invited... LAME!");
    });
  }

  getSessionToken() {
    return new Promise((resolve, reject) => {
      let token = JSON.parse(localStorage.getItem("sessionToken"));
      this.setState({ sessionToken: token }, () => {
        resolve("Set session token in state");
      })
    })
  }

  getMyUserData() {
    return new Promise((resolve, reject) => {
      // Get my user data
      axios.get(`http://localhost:8000/user_profile/profile/${this.state.sessionToken}`)
      .then((response) => {
          this.setState({ myUserData: response.data });
          this.setState({ myUsername: response.data.username });
          this.setState({ selectedPlayers: [ response.data, ...this.state.selectedPlayers ] }); // Add myself to selected players
      })
      .catch((response) => {
          console.log("Error getting my user data");
      })
      .finally(() => {
          resolve("Finished getting user data");
      });
    });
  }

  getFriends() {
    return new Promise((resolve, reject) => {
      let token = this.state.sessionToken;

      let config = {
          headers: {
              Authorization: `Bearer ${token}`,
          },
      };

      axios.get("http://localhost:8000/friend/get_friends/", config)
      .then((response) => {
          console.log(response.data.friends);
          this.setState({ friends: response.data.friends });
      })
      .catch((response) => {
          console.log("Error getting friends");
          console.error(response);
      })
      .finally(() => {
          resolve("Finished getting friends");
      });
    });
  }

  getFriendInviteList() {
    let listBuffer = [];
    for (let i in this.state.friends) {
        let friend = this.state.friends[i];
        listBuffer.push(
            <SmallUserCard
                username={friend.username}
                // wins={friend.wins}
                // is_active={friend.is_active}
                // avatarColor={friend.avatar_color}
                info={false}
                isThin={true}
                friendable={false}
                inviteable={true}
                messageable={false}
                handleInvite={(playerName, isInvited) => this.handleInvitePlayer(playerName, isInvited)}
            />
        );
    }
    return (
        <div id="friendTable">
            <Stack direction="column"
                alignItems="center"
                ref={ this.bottomRef }
                sx={{
                    width: "auto",
                    maxHeight: "100%",
                    overflow: "auto",
                }}
            >
                { listBuffer }
            </Stack>
        </div>
    );
  }

  handleInvitePlayer(invitedPlayerData, isInvited) {
    return new Promise((resolve, reject) => {
      if (isInvited) {
        this.setState({ selectedPlayers: [ invitedPlayerData, ...this.state.selectedPlayers ] },
        () => {
          resolve("Added: " + invitedPlayerData);
        });
      } else {
        this.setState({ selectedPlayers: this.state.selectedPlayers.filter(userData => userData.id !== invitedPlayerData.id) },
        () => {
          resolve("Removed: " + invitedPlayerData);
        });
      }
    })
    // .then(() => {
    //   console.log(this.state.selectedPlayers);
    // });
  }

  getGameWebsocket() {
    return new Promise((resolve, reject) => {
      let ws = null;
      new Promise((resolve, reject) => {
        ws = new WebSocket(`ws://localhost:8000/ws/gamechannel/${this.state.gameId}`);
        ws.onopen = (event) => { // do next when connected
          resolve("Finished connecting to game websocket");
        }
      })
      .then(() => {
        this.setState({ gameSocket: ws }, () => {
          this.state.gameSocket.addEventListener("message", this.onIncomingGameEvent.bind(this));
          resolve("Finished getting gamechannel websocket connection");
        });
      });
    });
  }

  onIncomingGameEvent(event) { // Very important - handles game events
    let serialized_data = JSON.parse(event.data);
    console.log("Incoming game event: ", serialized_data);
    if (serialized_data.event === "player_join") {
      // this.setState({ players: [ serialized_data.username, ...this.state.players ] })
      this.getCurrentPlayers();
    } else if (serialized_data.event === "start_game") {
      this.setState({ currentPage: "play" })
    } else {
      console.log("Unknown player event");
    }
  }

  getCurrentPlayers() {
    return new Promise((resolve, reject) => { 
      axios.get(`http://localhost:8000/player/game/${this.state.gameId}`)
      .then((response) => {
        this.setState({ players: response.data }, () => {
          console.log(response.data)
          console.log(this.state.players);
          resolve("Finished getting current players data");
        });
      })
      .catch((response) => {
        console.log("Error getting my current players data");
      })

    });
  }

  getCurrentPlayersList() {
    let listBuffer = [];
    for (let i in this.state.players) {
        let player = this.state.players[i];
        console.log(player);
        listBuffer.push(
            <SmallUserCard
                key={player.name}
                username={player.name}
                // wins={null}
                // is_active={null}
                // avatarColor={null}
                // info={false}
                // isButton={false}
                isThin={true}
                friendable={false}
                inviteable={false}
                messageable={true}
            />
        );
    }
    console.log(listBuffer)
    return (
        <div id="joinedPlayerTable">
            <Stack direction="column"
                alignItems="center"
                ref={ this.bottomRef }
                sx={{
                    width: "auto",
                    maxHeight: "100%",
                    overflow: "auto",
                }}
            >
                { listBuffer }
            </Stack>
        </div>
    );
  }

  getCreateGamePage() {
    let createGamePage = (
      <div id="creategamepage">
        <NavBar />
        { this.getFriendInviteList() }
        <Button
          onClick={this.createGameExecutor}
          variant="contained"
          size="large"
          sx={{ m: '16px' }}
        >
          Create Game
        </Button>
      </div>
    );
    return createGamePage;
  }

  getStartGamePage() {
    let startGamePage = (
      <div id="startgamepage">
        <NavBar />
        { this.getCurrentPlayersList() }
        <Button
          onClick={this.startGameExecutor}
          variant="contained"
          size="large"
          sx={{ m: '16px' }}
        >
          Start Game
        </Button>
      </div>
    );
    return startGamePage;
  }

  getPlayGamePage() {
    const sectionStyle = {
      height: "92vh",
    
      backgroundImage: `url(${"/images/Table_Themes/table_" + this.state.myUserData.table_theme + ".png"})`,
    
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover"
    };
    let playGamePage = (
      <div id="playgamepage">
        <NavBar />
          <Grid style={sectionStyle}
            container
            direction="column"
            justify="space-evenly"
            alignItems="center"
          >
            <Grid item>
              <MyCardsView
                deletable={false}
                myHandID={this.state.myPlayerData.id}
              />
              <GameActions
                gameId={this.state.gameId}
                playerId={this.state.myPlayerData.id}
                currentBet={this.state.currentBet}
              />
            </Grid>
          </Grid>
      </div>
    );
    return playGamePage;
  }

  render() {
    
    switch (this.state.currentPage) {
      case "create":
        return this.getCreateGamePage();
      case "start":
        return this.getStartGamePage();
      case "play":
        return this.getPlayGamePage();
      default:
        return this.getCreateGamePage();
    }
  }
}

// export default GamePage;

function WithLocation(props) {
  const location = useLocation();
  return <GamePage {...props} location={location} />
}

export default WithLocation;