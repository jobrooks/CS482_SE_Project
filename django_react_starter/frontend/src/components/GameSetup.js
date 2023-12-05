import React from "react"
import {Box, Stack, Avatar, Typography, Checkbox, Card, Button} from "@mui/material";
import axios from "axios";
import SmallUserCard from "./UserCards/SmallUserCard";

class GameSetup extends React.Component {

    constructor(props) {
        super(props)
        //this state will hold user info and friends
        this.state = {
            username: "",
            friends: [],
            selectedPlayers: [],
            myMoney: "",
            myPlayerID: 0,
            isVisible: true,
            myHandID: 0,
        }
        this.postGame = this.postGame.bind(this)
        this.postPlayers = this.postPlayers.bind(this)

    }

    handleCreateGameButtonClick= () => {
      //set invisible in create game
      this.createGame();

    };

    sendDataToGamePage = (gameID, playerID) => {
      // Call the callback function from props
      const gameData = [{"gameID":gameID}, {"username":this.state.username}, {"myPlayerID":playerID}, {"myHandID": this.state.myHandID} ]
      this.props.onGameSetupData(gameData);
    };    

    getFriends() {
        let token = JSON.parse(localStorage.getItem("sessionToken"));

        //get username and money
        axios.get(`http://localhost:8000/user_profile/profile/${token}/`)
        .then((response) => {
            this.setState({username: response.data['username']})
            console.log("logged in user: " + this.state.username);

            this.setState({myMoney: response.data['money']})
            console.log("my money: " + this.state.myMoney);
        })
        .catch((response) => {
            console.log("username not found")
        })

        //get friends
        const config = {headers: {Authorization: `Bearer ${token}`}};
        axios.get(`http://localhost:8000/friend/get_friends`,config)
        .then((response) => {
            this.setState({friends: response.data['friends']})
            console.log("Friends: ")
            console.log(response.data['friends']);
        })
        .catch((response) => {
            console.log("this loser got no friends")
        })

    }

    componentDidMount() {
        this.getFriends()
    }

    handlePlayerSelection = (player) => {
        this.setState((prevState) => {
          const isSelected = prevState.selectedPlayers.includes(player.username);
    
          if (isSelected) {
            // If player is already selected, remove from selectedPlayers
            return {
              selectedPlayers: prevState.selectedPlayers.filter(name => name !== player),
            };
          } else {
            // If player is not selected, add to selectedPlayers
            return {
              selectedPlayers: [...prevState.selectedPlayers, player],
            };
          }
        });
      }

    //make game, post to db, return gameID
    postGame = async () => {
      try {
        const gameName = this.state.username + "'s game";
        const gameData = {
          "name": gameName,
        };
    
        const response = await axios.post(`http://localhost:8000/creategame/`, gameData);
        console.log("gameID: " + response.data["id"]);

        return response.data["id"];
      } catch (error) {
        console.log("idk game not made", error);
        throw error;
      }
    }


    //parse selected players and add player to db
    postPlayers(gameID) {

      this.state.selectedPlayers.forEach( (player) => {
        const playerData = {
          "money": player.money,
          "name": player.username,
          "game": gameID,

        }

        axios.post(`http://localhost:8000/player/`, playerData)
        .then((response) => {
          //console.log(response.data);
        })
        .catch((response) => {
          console.log("idk player not made")
        })

      });

    }

    postSelf = async (gameID) => {
      try{
        const myData = {
          "money": this.state.myMoney,
          "name": this.state.username,
          "game": gameID,
        }

        const response = await axios.post(`http://localhost:8000/player/`, myData)
        console.log(response.data);
        this.setState({myHandID: response.data['hand']})
        return response.data['id'];
      }
      catch (error) {
        console.log("you were not added to the game")
        throw error;
      }
      
    }

    //fuck this stupid ass method man
    // getPlayerID (usr) {
    //   axios.get(`http://localhost:8000/player/username/${usr}/`)
    //     .then((response) => {
    //       this.setState({ myPlayerID: response.data['id'] });
    //     })
    //     .catch((response) => {
    //       console.log("Error getting playerID")
    //     });
  
    // }


    createGame = async () => {
      try {
        // Make sure game is only created once, and if there are selected players
        if(this.state.selectedPlayers.length > 0) {
          const gameID = await this.postGame();
          const playerID = await this.postSelf(gameID);
          this.postPlayers(gameID);
          //this.getPlayerID(this.state.username)
          this.sendDataToGamePage(gameID, playerID);
          this.setState({ isVisible: false });
        }
        else {
          console.log("no selected players");
        }
      } catch (error) {
        console.error("Error creating game:", error);
      }
    }
    

    render() {
        const {friends, selectedPlayers} = this.state;
        const { isVisible } = this.state;
        return (
            <div className="CreateGame">
              {isVisible && (<div>
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
                        checked={selectedPlayers.includes(friend)}
                        onChange={() => this.handlePlayerSelection(friend)}
                      />
                    </div>
                    ))}
                </Stack> 

                <Button onClick={this.handleCreateGameButtonClick} variant="contained" size="large" style={{ marginBottom: '16px' }}>Create Game</Button>

              </div> )}
            </div>
        )
    }
};

export default GameSetup;