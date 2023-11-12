import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CasinoIcon from '@mui/icons-material/Casino';
import Card from '@mui/material/Card';

class PlayPage2 extends React.Component {
  state = {
    players: [], // Assuming you have a state for players
    hand: [], // State to store fetched deck
  };

  componentDidMount() {
    // Fetch data from your Django API endpoint for playing cards
    fetch('http://127.0.0.1:8000/hand/1/')
      .then(response => response.json())
      .then(data => this.setState({ hand: data }))
      .catch(error => console.error('Error fetching deck:', error));

    fetch('http://127.0.0.1:8000/player')
      .then(response => response.json())
      .then(data => this.setState({ players: data }))
      .catch(error => console.error('Error fetching deck:', error));
  }

  render() {
    const { players, hand } = this.state;

    return (
      <Box sx={{ p: 2, maxWidth: 'sm', margin: 'auto' }}>
        <Stack direction="row" justifyContent="space-between" spacing={2} mb={2}>
          {players.map((player) => (
            <Box key={player.name} sx={{ textAlign: 'center' }}>
              <Avatar src={player.avatar}>{player.name[0]}</Avatar>
              <Typography variant="caption">{player.name}</Typography>
              <Typography variant="caption">{player.stack}</Typography>
            </Box>
          ))}
        </Stack>
        {/* ... other components ... */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          {hand.map((card) => (
            <Card key={card.id} sx={{ m: 1 }}>
              {/* Assuming card.image_url points to the image of the card */}
              <img src={card.image_url} alt={card.name} style={{ maxWidth: '100px' }} />
            </Card>
          ))}
        </Box>
        <Typography variant="h6" align="center" mt={2}>
          Stack: 100c
        </Typography>
      </Box>
    );
  }
}

export default PlayPage2;
