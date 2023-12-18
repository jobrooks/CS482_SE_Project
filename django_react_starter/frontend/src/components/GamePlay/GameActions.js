import React from 'react';
import { Fab, Grid, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import NavigationIcon from '@mui/icons-material/Navigation';
import axios from 'axios';

class GameActions extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            gameId: this.props.gameId,
            playerId: this.props.playerId,
            currentBet: this.props.currentBet,
            isVisible: true,
            betDialogOpen: false,
            betAmountInput: ''
        }
    }

    // class assumes it is players turn

    handleFold = async () => {
        try {
            const foldData = {
                "action": "fold"
            }
            const response = await axios.put(`http://localhost:8000/taketurn/${this.state.playerId}/`, foldData)
            console.log(response);
        }
        catch (error) {
            console.log("ID: " + this.state.playerId + "fold turn not taken")
        }
    }

    handleCall = async () => {
        try {
            const callData = {
                "action": "call"
            }
            const response = await axios.put(`http://localhost:8000/taketurn/${this.state.playerId}/`, callData)
            console.log(response);
        }
        catch (error) {
            console.log("ID: " + this.state.playerId + "call turn not taken")
        }
    }

    handleAllIn = async () => {
        try {
            const allInData = {
                "action": "allIn"
            }
            const response = await axios.put(`http://localhost:8000/taketurn/${this.state.playerId}/`, allInData)
            console.log(response);
        }
        catch (error) {
            console.log("ID: " + this.state.playerId + "allIn turn not taken")
        }
    }

    handleRaiseClick = () => {
        this.setState({ betDialogOpen: true });
    }

    handleRaiseConfirm = async () => {
        const { betAmountInput } = this.state;

        if (!betAmountInput.trim() || isNaN(betAmountInput)) {
            alert('Invalid bet amount. Please enter a valid number.');
            return;
        }

        await this.handleRaise(betAmountInput);

        this.setState({
            betDialogOpen: false,
            betAmountInput: ''
        });
    }

    handleRaiseCancel = () => {
        this.setState({ betDialogOpen: false, betAmountInput: '' });
    }

    handleRaise = async (bet) => {
        try {
            const raiseData = {
                "action": "raise",
                "betAmount": bet
            }
            const response = await axios.put(`http://localhost:8000/taketurn/${this.state.playerId}/`, raiseData)
            console.log(response);
        }
        catch (error) {
            console.log("ID: " + this.state.playerId + "raise turn not taken")
        }
    }

    handleCheck = async () => {
        try {
            const checkData = {
                "action": "check"
            }
            const response = await axios.put(`http://localhost:8000/taketurn/${this.state.playerId}/`, checkData)
            console.log(response);
        }
        catch (error) {
            console.log("ID: " + this.state.playerId + "check turn not taken")
        }
    }

    render() {
        return (
            <Grid container justifyContent="center" alignItems="flex-start" spacing={2}
                position="relative"
                top="58%"
            >
                <Grid item>
                    <Fab onClick={this.handleFold} variant="extended" color="primary"> Fold </Fab>
                </Grid>
                <Grid item>
                    <Fab onClick={this.handleCall} variant="extended" color="primary"> Call ${this.state.currentBet} </Fab>
                </Grid>
                <Grid item>
                    <Fab onClick={this.handleAllIn} variant="extended" color="primary"> All In </Fab>
                </Grid>
                <Grid item>
                    <Fab onClick={this.handleRaiseClick} variant="extended" color="primary"> Raise </Fab>
                    <Dialog open={this.state.betDialogOpen} onClose={this.handleRaiseCancel}>
                        <DialogTitle>Enter Bet Amount</DialogTitle>
                        <DialogContent>
                            <TextField
                                label="Bet Amount"
                                type="number"
                                value={this.state.betAmountInput}
                                onChange={(e) => this.setState({ betAmountInput: e.target.value })}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleRaiseCancel} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={this.handleRaiseConfirm} color="primary">
                                Confirm
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Grid>
                <Grid item>
                    <Fab onClick={this.handleCheck} variant="extended" color="primary"> Check </Fab>
                </Grid>
            </Grid>
        )
    }
};

export default GameActions;
