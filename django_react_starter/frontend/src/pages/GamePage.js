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

class GamePage extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
        tableTheme: "",
        tableImage: "/images/Table_Themes/table_",
        selectedPlayers: []
    }
}

  setTableTheme() {
    let token = JSON.parse(localStorage.getItem("sessionToken"));
    axios.get(`http://localhost:8000/user_profile/profile/tabletheme/${token}/`)
    .then((response) => {
      console.log("theme is " + response);
        this.setState({ tableTheme: response.data});
    })
    .catch((response) => {
        console.log("Error getting table theme")
        console.log(response);
    });
}

componentDidMount() {
  this.setTableTheme()
}

  render() {
    //const {players, selectedPlayers} = this.state;
    const backImgPath = this.state.tableImage + this.state.tableTheme + ".png";
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
          style={{backgroundImage:`url(${backImgPath})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          width: '100%',
          height: '100vh', //view heigh
          margin: 0,
          padding: 0 }}>
          
          <Stack justifyContent='space-between' direction='row' spacing={2} sx={{ border: '1px solid'}}>

            <Box sx={{backgroundColor: '#ccc', height:'100px', width:'100px'}}/>
            <Box sx={{backgroundColor: '#ccc', height:'100px', width:'100px'}}/>
            <Box sx={{backgroundColor: '#ccc', height:'100px', width:'100px'}}/>
          </Stack>

          <PlayingCard cardSrc="2H" w='100px' h='200px'/>



        </Box>



      </div>
    );
  }
};

export default GamePage;