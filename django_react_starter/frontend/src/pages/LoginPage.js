import React from "react";
import axios from "axios";
import { Container, CssBaseline, Avatar, Typography, TextField, FormControlLabel, Checkbox, Button, Grid, Link, Box } from '@mui/material';
import { useNavigate } from "react-router-dom";

class LoginPage extends React.Component {

    constructor(props) {
        super(props);
        this.submitLogin = this.submitLogin.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            username: "",
            password: ""
        }
    }

    handleChange(event) {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    }

    submitLogin(event) {
        event.preventDefault();
        
        console.log('Username:', this.state.username, 'Password:', this.state.password);
        // Handle login from backend
        axios.post("http://localhost:8000/user_login/login/", this.state)
        .then((response) => {
          localStorage.setItem("sessionToken", response.data.token);
          this.props.navigate("/"); // Redirect to /
        });
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
                {/* <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>

                </Avatar> */}
                <Typography component="h1" variant="h5">
                  Sign in
                </Typography>
                <Box component="form" onSubmit={this.submitLogin} noValidate sx={{ mt: 1 }}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    autoComplete="username"
                    autoFocus
                    value={this.state.username}
                    onChange={this.handleChange}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={this.state.password}
                    onChange={this.handleChange}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ mt: 3, mb: 2, mx: 1, width: "45%"}}
                  >
                    Sign In
                  </Button>
                  <Button
                    type="submit"
                    variant="outlined"
                    sx={{ mt: 3, mb: 2, mx: 1, width: "45%"}}
                  >
                    Enter as Guest
                  </Button>
                </Box>
              </Box>
            </Container>
        );      
    }
    
}

function WithNavigate(props) {
  const navigate = useNavigate();
  return <LoginPage {...props} navigate={navigate} />
}

export default WithNavigate;