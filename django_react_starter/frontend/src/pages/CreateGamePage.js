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
import CreateGame from '../components/CreateGame';

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

          {/* box holding create game stuff */}
          <Box>
            <CreateGame />
          </Box>


        </Box>
      </div>
    );
  }
};

export default CreateGamePage;