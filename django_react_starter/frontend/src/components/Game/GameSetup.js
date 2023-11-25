import React from "react"
import {Box, Stack, Avatar, Typography, Checkbox, Card, Button} from "@mui/material";
import axios from "axios";
import SmallUserCard from "../UserCards/SmallUserCard";

class GameSetup extends React.Component {

    constructor(props) {
        super(props)
        //this state will hold user info and friends
        this.state = {
            username: "",
            friends: [],
            selectedPlayers: [],
            myMoney: ""
        }
        this.postGame = this.postGame.bind(this)
        this.postPlayers = this.postPlayers.bind(this)

    }

    getFriends() {
        let token = JSON.parse(localStorage.getItem("sessionToken"));

        //get username and money
        axios.get(`http://localhost:8000/user_profile/profile/${token}/`)
        .then((response) => {
            this.setState({username: response.data['username']})
            console.log(this.state.username);

            this.setState({myMoney: response.data['money']})
            console.log(this.state.myMoney);
        })
        .catch((response) => {
            console.log("username not found")
        })

        //get friends
        const config = {headers: {Authorization: `Bearer ${token}`}};
        axios.get(`http://localhost:8000/friend/get_friends`,config)
        .then((response) => {
            this.setState({friends: response.data['friends']})
            console.log(response.data['friends']);
        })
        .catch((response) => {
            console.log("this loser got no friends")
        })

    }

    componentDidMount() {
        this.getFriends()
    }

    handlePlayerSelection = (playerName) => {
        this.setState((prevState) => {
          const isSelected = prevState.selectedPlayers.includes(playerName);
    
          if (isSelected) {
            // If player is already selected, remove from selectedPlayers
            return {
              selectedPlayers: prevState.selectedPlayers.filter(name => name !== playerName),
            };
          } else {
            // If player is not selected, add to selectedPlayers
            return {
              selectedPlayers: [...prevState.selectedPlayers, playerName],
            };
          }
        });
      }

    //make game, post to db, return game id
    postGame() {
      const gameData = {
      }
      axios.patch(`http://localhost:8000/game/`, gameData)
      .then((response) => {
        console.log(response.data["id"]);
        return response.data["id"]
      })
      .catch((response) => {
        console.log("idk game not made")
      })
    }

    //parse selected players and add player to db
    postPlayers(gameID) {

      this.state.selectedPlayers.forEach( (player) => {
        const playerData = {
          "money": player.money,
          "name": player.username,
          "canRaise": null,
          "canFold": null,
          "canCall": null,
          "canAllIn": null,
          "action": null,
          "betAmount": null,
          "game": gameID,
          "hand": null
        }

        axios.patch(`http://localhost:8000/player/`, playerData)
        .then((response) => {
          console.log(response.data);
        })
        .catch((response) => {
          console.log("idk player not made")
        })

      });

      //also add yourself to the game
      const myData = {
        "money": this.state.myMoney,
        "name": this.state.username,
        "canRaise": null,
        "canFold": null,
        "canCall": null,
        "canAllIn": null,
        "action": null,
        "betAmount": null,
        "game": gameID,
        "hand": null
      }

      axios.patch(`http://localhost:8000/player/`, myData)
      .then((response) => {
        console.log(response.data);
      })
      .catch((response) => {
        console.log("you were not added to game")
      })

      
    }

    createGame = async () => {
      try {
        // Make sure game is only created once, and if there are selected players
        const gameID = await this.postGame();
        this.postPlayers(gameID);
      } catch (error) {
        console.error("Error creating game:", error);
      }
    }
    

    render() {
        const {friends, selectedPlayers} = this.state;
        return (
            <div className="CreateGame">
              <Card elevation={5}
                    sx={{
                        width: 250,
                        height: 25,
                    }}>
                Friends
              </Card>
              
              <Stack direction="row" justifyContent="space-between" spacing={2} mb={2}>
                {friends.map((friend) => (
                  <div key={friend.id}>
                    <SmallUserCard 
                      username = {friend.username}
                      wins = {friend.wins}
                      is_active={friend.is_active}
                      avatarColor={friend.avatar_color}
                      messageable={true}
                    />
                    <Checkbox
                      checked={selectedPlayers.includes(friend.username)}
                      onChange={() => this.handlePlayerSelection(friend.username)}
                    />
                  </div>
                  ))}
              </Stack> 

              <Button onClick={this.createGame} variant="contained" size="large" style={{ marginBottom: '16px' }}>Create Game</Button>

            </div>
        )
    }
};

export default GameSetup;