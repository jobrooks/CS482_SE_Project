import React, { Component } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, CssBaseline, Avatar, Typography, TextField, FormControlLabel, Checkbox, Button, Grid, Link, Box } from '@mui/material';

class GuestPage extends Component{
    constructor(props) {
        super(props);
        this.state = {
            credentials: {
                username: undefined,
                email: undefined,
            },
        };
    }

    handleChange = (e) => {
        const { id, value } = e.target;
        this.setState((prevState) => ({
            credentials: {
                ...prevState.credentials,
                [id]: value,
            },
        }));
    };

    handleClick = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(
                "http://localhost:8000/user_api/register-guest/",
                this.state.credentials
            );
            
            this.props.navigate("/login");
        } catch (error) {
            console.error(error);
        }
    }

    render() {
        return (
            <Container component="main" maxWidth="xs">
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box component="form" noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            onChange={this.handleChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            onChange={this.handleChange}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            sx={{ mt: 3, mb: 2 }}
                            onClick={this.handleClick}
                        >
                            Continue As Guest
                        </Button>
                    </Box>
                </Box>
            </Container>
        );
    }
}

function WithNavigate(props) {
    const navigate = useNavigate();
    return <GuestPage {...props} navigate={navigate} />
}
export default GuestPage