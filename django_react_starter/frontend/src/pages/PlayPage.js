import { Box, Button, Typography, Avatar, Stack, Card } from '@mui/material';
import CasinoIcon from '@mui/icons-material/Casino'; // You can choose an icon that suits your theme
import axios from "axios";
import React, { useState, useEffect } from 'react';
import NavBar from "../components/NavBar";
import LoginRedirector from "../components/LoginRedirector";
import { withRouter } from 'react-router-dom';

const CardDisplay = () => {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    // Fetch data from your Django API endpoint
    fetch('your-django-api-endpoint')
      .then(response => response.json())
      .then(data => setCards(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);
}

// Replace with the actual logic to handle the button clicks
const handleFold = () => console.log('Fold');
const handleSetRaise = () => console.log('Set Raise');
const handleCall = () => console.log('Call');


class PlayPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
    
        }
        this.handleChange = this.handleChange.bind(this);
        this.getGame = this.getGame.bind(this);
    }

    handleChange(event) {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    }

    getGame(event){
        event.preventDefault();
        const response = axios.get('http://127.0.0.1:8000/game/1')
    }

    render() {
        const { players } = this.props.location.state || { selectedPlayers: [] };
        return (
            <div className='PlayPage'>
            <NavBar />
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
                  
                </Box>
              ))}
            </Stack>
            
            <Box sx={{display: 'flex', justifyContent: 'center', mb: 2}}>
                <Button variant="contained" onClick={handleFold}>Invite Players</Button>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                {/* Render poker chips or dealer button here */}
                <CasinoIcon fontSize="large" /> {/* Placeholder for dealer button */}
            </Box>

            <Stack direction="row" spacing={2} justifyContent="center">
                <Button variant="contained" onClick={handleFold}>Fold</Button>
                <Button variant="contained" onClick={handleSetRaise}>Set Raise</Button>
                <Button variant="contained" onClick={handleCall}>Call 2c</Button>
            </Stack>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                {/* Replace with actual card components or images */}
                <Card sx={{ m: 1 }}>K♦</Card>
                <Card sx={{ m: 1 }}>Q♦</Card>
            </Box>

            <Typography variant="h6" align="center" mt={2}>
                Stack: 100c
            </Typography>
            </Box>
            </div>
        );
    }
}
    
export default PlayPage;
