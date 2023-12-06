import React from "react";
import axios from "axios";

import NavBar from "../components/NavBar";
import SmallUserCard from "../components/UserCards/SmallUserCard";

import {Box, Stack, Avatar, Typography, Checkbox, Card, Button} from "@mui/material";

class GamePage extends React.Component {

  constructor(props) {
    super(props);
    this.getSessionToken = this.getSessionToken.bind(this);
    this.getMyUserData = this.getMyUserData.bind(this);
    this.getFriends = this.getFriends.bind(this);
    this.getFriendInviteList = this.getFriendInviteList.bind(this);
    this.createGame = this.createGame.bind(this);
    this.handleInvitePlayer = this.handleInvitePlayer.bind(this);
    this.state = {
      // Data
      myUsername: null,
      myUserData: null,
      gameId: null,
      // Internal State
      sessionToken: null,
      selectedPlayers: [],
      friends: [],
    }
  }

  componentDidMount() {
    this.getSessionToken()
    .then(this.getMyUserData)
    .then(this.getFriends)
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

  addPlayersToGame() {
    return new Promise((resolve, reject) => {
      let playersAdded = 0;
      this.state.selectedPlayers.forEach( (username, index) => {
        const playerData = {
          "money": 100, // Likely needs to be changed, starting money should be an option
          "name": username,
          "game": this.state.gameId,
        }
  
        axios.post(`http://localhost:8000/player/`, playerData)
        .then((response) => {
          console.log("added player: " + username);
        })
        .catch((response) => {
          console.log("idk player not made")
        }).finally((response) => {
          playersAdded++;
          if(playersAdded === this.state.selectedPlayers.length) {
            resolve("Added all players to game");
          }
        });
      });
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
          this.setState({ myUserdata: response.data });
          this.setState({ myUsername: response.data.username });
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
                wins={friend.wins}
                is_active={friend.is_active}
                avatarColor={friend.avatar_color}
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

  handleInvitePlayer(invitedPlayerName, isInvited) {
    return new Promise((resolve, reject) => {
      if (isInvited) {
        this.setState({ selectedPlayers: [ invitedPlayerName, ...this.state.selectedPlayers ] },
        () => {
          resolve("Added: " + invitedPlayerName);
        });
      } else {
        this.setState({ selectedPlayers: this.state.selectedPlayers.filter(username => username !== invitedPlayerName) },
        () => {
          resolve("Removed: " + invitedPlayerName);
        });
      }
    })
    // .then(() => {
    //   console.log(this.state.selectedPlayers);
    // });
  }

  render() {
    return (
      <div id="gamepage">
        <NavBar />
        { this.getFriendInviteList() }
        <Button
          onClick={this.createGame}
          variant="contained"
          size="large"
          sx={{ m: '16px' }}
        >
          Create Game
        </Button>
      </div>
    );
  }
}

export default GamePage;