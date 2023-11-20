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



class CreateGamePage extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
        tableTheme: "",
        tableImage: "/images/Table_Themes/table_"
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

  // state = {
  //   players: [],
  //   selectedPlayers: []
  // };

  // componentDidMount() {
  //   fetch('http://127.0.0.1:8000/player')
  //     .then(response => response.json())
  //     .then(data => this.setState({ players: data }))
  //     .catch(error => console.error('Error fetching deck:', error));
  // }

  // handlePlayerSelection = (playerName) => {
  //   this.setState((prevState) => {
  //     const isSelected = prevState.selectedPlayers.includes(playerName);

  //     if (isSelected) {
  //       // If player is already selected, remove from selectedPlayers
  //       return {
  //         selectedPlayers: prevState.selectedPlayers.filter(name => name !== playerName),
  //       };
  //     } else {
  //       // If player is not selected, add to selectedPlayers
  //       return {
  //         selectedPlayers: [...prevState.selectedPlayers, playerName],
  //       };
  //     }
  //   });
  // }

  render() {
    //const {players, selectedPlayers} = this.state;
    const backImgPath = this.state.tableImage + this.state.tableTheme + ".png";
    return (
      // outside stuff
      <div className='CreateGamePage'>
        <LoginRedirector />
        <NavBar />
        {/* box holding create game stuff */}
        <Box 
          style={{backgroundImage:`url(${backImgPath})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          width: '100%',
          height: '100vh', //view heigh
          margin: 0,
          padding: 0
        }}>
        </Box>
      </div>
    );
  }
};

export default CreateGamePage;