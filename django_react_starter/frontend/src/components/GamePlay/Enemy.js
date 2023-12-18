import React from 'react';
import { Avatar, Box, TextField, Typography } from '@mui/material';

class Enemy extends React.Component {

    render() {

        const { player } = this.props;
        const { name, money, action, betAmount } = player;

        return (
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '200px', // Adjust the width as needed
                    padding: '16px',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    marginBottom: '16px',
                    backgroundColor: '#Dfdfdd'
                }}
            >
                <Avatar sx={{ width: 56, height: 56, marginRight: '16px' }}>{name.charAt(0)}</Avatar>
                <Box sx={{ display: 'flex', flexDirection: 'column', flex: '1' }}>
                    <TextField
                        label="Name"
                        variant="outlined"
                        value={name}
                        InputProps={{ readOnly: true }}
                        margin="dense"
                    />
                    <TextField
                        label="Money"
                        variant="outlined"
                        value={money}
                        InputProps={{ readOnly: true }}
                        margin="dense"
                    />
                    <TextField
                        label="Action"
                        variant="outlined"
                        value={action || 'No Action'}
                        InputProps={{ readOnly: true }}
                        margin="dense"
                    />
                    <TextField
                        label="Bet"
                        variant="outlined"
                        value={betAmount !== null ? `$${betAmount}` : 'No Bet'}
                        InputProps={{ readOnly: true }}
                        margin="dense"
                    />
                </Box>
            </Box>
        );
    }
};

export default Enemy;
