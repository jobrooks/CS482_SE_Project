import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Button, Checkbox } from '@mui/material';
import NavBar from "../components/NavBar";
import LoginRedirector from "../components/LoginRedirector";
import { Link } from 'react-router-dom';



class CreateGamePage extends React.Component {

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
      <div className='CreateGamePage'>
        <NavBar />
        <Box sx={{ p: 2}}>
          <Box sx={{ p: 2, maxWidth: 'sm', margin: 'auto' }}>
            <Typography variant="h5" align="center" mb={2}>
                Available Players:
            </Typography>
            <Stack direction="row" justifyContent="space-between" spacing={2} mb={2}>
              {players.map((player) => (
                <Box key={player.name} sx={{ textAlign: 'center' }}>
                  <Avatar src={player.avatar}>{player.name[0]}</Avatar>
                  <Typography variant="caption">{player.name}</Typography>
                  <Typography variant="caption">{player.stack}</Typography>
                  <Checkbox
                    checked={selectedPlayers.includes(player.name)}
                    onChange={() => this.handlePlayerSelection(player.name)}
                  />
                </Box>
              ))}
            </Stack>
            <Link
              to={{
                pathname: '/playpage',  // Replace with your actual path
                state: { selectedPlayers }, // Pass selectedPlayers as state
              }}
            >
            <Button variant="contained" size="large">Create Game</Button>
            </Link>
          </Box>
        </Box>
      </div>
    );
  }
};

export default CreateGamePage;