import React from 'react';
import { Box, Button, Typography, Avatar, Stack, Card } from '@mui/material';
import CasinoIcon from '@mui/icons-material/Casino'; // You can choose an icon that suits your theme



//use for player profiles, get from db
const players = [
  { name: 'Sleepy', stack: '100c', avatar: 'path/to/sleepy_avatar.png' },
  { name: 'Loki', stack: '100c', avatar: 'path/to/loki_avatar.png' },
  // Add other players here...
];

// Replace with the actual logic to handle the button clicks
const handleFold = () => console.log('Fold');
const handleSetRaise = () => console.log('Set Raise');
const handleCall = () => console.log('Call');



class PlayPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            "game": {
                "players": {
                    "player1": {"id": "1", "pname": "Sajiv", "money":"100"},
                    "player2": {"id": "2", "pname": "Collin", "money":"100"},
                    "player3": {"id": "3", "pname": "Joshua", "money":"100"},
                    "player4": {"id": "4", "pname": "Kobe", "money":"100"}
  
                }


            }
        }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    }

    pullDBPlayers(event){
        

    }

    render() {
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
        );
    }
}
    
export default PlayPage;
