import React from "react";
import axios from "axios";
import { Container, CssBaseline, Avatar, Typography, TextField, FormControlLabel, Checkbox, Button, Grid, Link, Box } from '@mui/material';
import { useNavigate } from "react-router-dom";
import LockIcon from '@mui/icons-material/Lock';

class LoginPage extends React.Component {

    constructor(props) {
        super(props);
        this.submitLogin = this.submitLogin.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
          submitError: false,
          errorMessage: "",
          loginInfo: {
            username: "",
            password: ""
          }
        }
    }

    handleChange(event) {
        const { name, value } = event.target;
        this.setState((prevState) => ({
          loginInfo: {
            ...prevState.loginInfo,
            [name]: value
          }
        }));
    }

    submitLogin(event, loginType) {
        event.preventDefault();
        
        console.log('Username:', this.state.username, 'Password:', this.state.password);

        if (loginType == "guest") {
          localStorage.setItem("sessionToken", JSON.stringify("guest"));
          this.props.navigate("/");
        } else {
          // Handle login from backend
          axios.post("http://localhost:8000/user_login/login/", this.state.loginInfo)
          .then((response) => {
            localStorage.setItem("sessionToken", JSON.stringify(response.data.token));
            this.props.navigate("/"); // Redirect to /
          })
          .catch((response) => {
            this.setState({submitError: true, errorMessage: "Incorrect username or password"})
          });
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
                <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                  <LockIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                  Sign in
                </Typography>
                <Box component="form" onSubmit={this.submitLogin} noValidate sx={{ mt: 1 }}>
                  <TextField
                    error={this.state.submitError}
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
                    error={this.state.submitError}
                    helperText={this.state.errorMessage}
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
                  <Grid container sx={{mt: 3, mb: 2}}>
                    <Grid item xs={6}>
                      <Button
                        type="submit"
                        onClick={(event) => {this.submitLogin(event, "user")}}
                        variant="contained"
                        sx={{ my: 1, width: "90%" }}
                      >
                        Sign In
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button
                        onClick={(event) => {this.submitLogin(event, "guest")}}
                        variant="outlined"
                        sx={{ my: 1, width: "90%" }}
                      >
                        Enter as Guest
                      </Button>
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        onClick={(event) => {this.props.navigate("/register")}}
                        variant="outlined"
                        sx={{ my: 1, width: "90%" }}
                      >
                        Create Account
                      </Button>
                    </Grid>
                  </Grid>
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