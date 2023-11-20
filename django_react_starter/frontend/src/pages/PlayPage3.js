import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Button, Checkbox } from '@mui/material';
import NavBar from "../components/NavBar";
import LoginRedirector from "../components/LoginRedirector";
import { Link } from 'react-router-dom';
import CasinoIcon from '@mui/icons-material/Casino';

const handleFold = () => console.log('Fold');
const handleSetRaise = () => console.log('Set Raise');
const handleCall = () => console.log('Call');


class PlayPage3 extends React.Component {

  state = {
    players: [],
    selectedPlayers: []

  };

  componentDidMount() {
    fetch('http://127.0.0.1:8000/player')
      .then(response => response.json())
      .then(data => this.setState({ players: data }))
      .catch(error => console.error('Error fetching deck:', error));
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

  render() {
    const {players, selectedPlayers} = this.state;
    return (
      <div className='PlayPage3'>
        <NavBar />
        <Box sx={{ p: 2}}>
          <Box sx={{ p: 2, maxWidth: 'sm', margin: 'auto' }}>
            <Typography variant="h5" align="center" mb={2}>
                Players
            </Typography>
            <Stack direction="row" justifyContent="space-between" spacing={2} mb={2}>
              {players.map((player) => (
                <Box key={player.name} sx={{ textAlign: 'center' }}>
                  <Avatar src={player.avatar}>{player.name[0]}</Avatar>
                  <Typography variant="caption">{player.name}</Typography>
                  <Typography variant="caption">{player.stack}</Typography>
                  
                </Box>
              ))}
            </Stack>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                {/* Render poker chips or dealer button here */}
                <CasinoIcon fontSize="large" /> {/* Placeholder for dealer button */}
            </Box>
            <Button variant="contained" size="large" href="playpage4">Start Game</Button>
            <Typography variant="h5" align="center" mb={2}>
                Layout
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <div
              style={{
                flex: 1,
                width: '144px',
                height: '201px',
                marginRight: '10px',
                backgroundColor: '#ccc', // Set the background color to grey
                border: '1px solid #888', // Add a border for better visibility
              }}
            />
            <div
              style={{
                flex: 1,
                width: '144px',
                height: '201px',
                marginRight: '10px',
                backgroundColor: '#ccc', // Set the background color to grey
                border: '1px solid #888', // Add a border for better visibility
              }}
            />
            <div
              style={{
                flex: 1,
                width: '144px',
                height: '201px',
                marginRight: '10px',
                backgroundColor: '#ccc', // Set the background color to grey
                border: '1px solid #888', // Add a border for better visibility
              }}
            />
            <div
              style={{
                flex: 1,
                width: '144px',
                height: '201px',
                marginRight: '10px',
                backgroundColor: '#ccc', // Set the background color to grey
                border: '1px solid #888', // Add a border for better visibility
              }}
            />
            <div
              style={{
                flex: 1,
                width: '144px',
                height: '201px',
                marginRight: '10px',
                backgroundColor: '#ccc', // Set the background color to grey
                border: '1px solid #888', // Add a border for better visibility
              }}
            />
            </Box>
            
            <Typography variant="h5" align="center" mb={2}>
                Your Cards
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <div
              style={{
                flex: 1,
                width: '144px',
                height: '201px',
                marginRight: '10px',
                backgroundColor: '#ccc', // Set the background color to grey
                border: '1px solid #888', // Add a border for better visibility
              }}
            />
            <div
              style={{
                flex: 1,
                width: '144px',
                height: '201px',
                marginRight: '10px',
                backgroundColor: '#ccc', // Set the background color to grey
                border: '1px solid #888', // Add a border for better visibility
              }}
            />
            <div
              style={{
                flex: 1,
                width: '144px',
                height: '201px',
                marginRight: '10px',
                backgroundColor: '#ccc', // Set the background color to grey
                border: '1px solid #888', // Add a border for better visibility
              }}
            />
            <div
              style={{
                flex: 1,
                width: '144px',
                height: '201px',
                marginRight: '10px',
                backgroundColor: '#ccc', // Set the background color to grey
                border: '1px solid #888', // Add a border for better visibility
              }}
            />
            <div
              style={{
                flex: 1,
                width: '144px',
                height: '201px',
                marginRight: '10px',
                backgroundColor: '#ccc', // Set the background color to grey
                border: '1px solid #888', // Add a border for better visibility
              }}
            />
            </Box>
          </Box>
        </Box>
      </div>
    );
  }
};

export default PlayPage3;