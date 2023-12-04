import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Button, Checkbox } from '@mui/material';
import NavBar from "../components/NavBar";
import LoginRedirector from "../components/LoginRedirector";
import { Link } from 'react-router-dom';
import TableCard from '../components/TableCard';
import axios from "axios";
import GameSetup from '../components/GameSetup';
import PlayingCard from '../components/PlayingCardViews/PlayingCard';
import Grid from '@mui/material/Grid';
import SmallUserCard from '../components/UserCards/SmallUserCard';
import GameActions from '../components/GamePlay/GameActions';
import MyCardsView from '../components/PlayingCardViews/MyCardsView';
import EnemyPlayers from '../components/GamePlay/EnemyPlayers';

class GamePage extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      tableTheme: "",
      tableImage: "/images/Table_Themes/table_",
      selectedPlayers: [],
      gameID: 1,
      pot: 0,
      currentBet: 15,
      username: "",
      myPlayerID: 0,
      myHandID: 2,
    
    }
  }

  //get username for logged in user
  getUsername = async () => {
  let token = JSON.parse(localStorage.getItem("sessionToken"));
  try {
    const response = await axios.get(`http://localhost:8000/user_profile/profile/${token}/`);
    this.setState({ username: response.data['username'] });
    return response.data['username']; // Return the username
  } catch (error) {
    console.log("Error getting username", error);
    throw error; // Rethrow the error
  }
}

  //get the playerID for the logged in user
  getPlayerID = async (usr) => {
    axios.get(`http://localhost:8000/player/username/${usr}/`)
      .then((response) => {
        console.log("playerid: ", response.data);
        this.setState({ myPlayerID: response.data['id'] });
        console.log("playerid: ", response.data['id']);
      })
      .catch((response) => {
        console.log(this.state.username)
        console.log("player response", response)
        console.log("Error getting playerID")
      });

  }

  setTableTheme = async () => {
    let token = JSON.parse(localStorage.getItem("sessionToken"));
    axios.get(`http://localhost:8000/user_profile/profile/tabletheme/${token}/`)
      .then((response) => {
        console.log("theme is " + response);
        this.setState({ tableTheme: response.data });
      })
      .catch((response) => {
        console.log("Error getting table theme")
        console.log(response);
      });
  }

  //figure out how to get the correct gameid in here
  runGame(gameID) {
    //make sure it is your turn
    //if it is, game action buttons become active


  }

  async componentDidMount() {
    await this.setTableTheme();
    const usr = await this.getUsername();
    this.getPlayerID(usr);
  }


  render() {
    //const {players, selectedPlayers} = this.state;
    const backImgPath = this.state.tableImage + this.state.tableTheme + ".png";
    // const gameID = this.state.gameID;
    return (
      // outside stuff
      <div className='CreateGamePage'>
        <LoginRedirector />
        <NavBar />
        {/* box holding game setup stuff */}
        <Box>
          <GameSetup />
        </Box>

        {/* box holding game itself*/}
        <Box
          style={{
            backgroundImage: `url(${backImgPath})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            width: '100%',
            height: '100vh', //view heigh
            margin: 0,
            padding: 0
          }}
          alignItems={"center"}>


          <EnemyPlayers gameID={this.state.gameID} playerID={this.state.myPlayerID} />

          <MyCardsView
            myHandID={this.state.myHandID}>
          </MyCardsView>


          <GameActions
            gameID={this.state.gameID}
            playerID={this.state.myPlayerID}
            currentBet={this.state.currentBet}>
          </GameActions>



        </Box>



      </div>
    );
  }
};

export default GamePage;