import React, { Component } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  CssBaseline,
  Avatar,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Grid,
  Link,
  FormControl,
  Box,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

class CreateAccountPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      credentials: {
        username: "",
        email: "",
        password: "",
        security_question: "",
        security_answer: "",
      },
    };
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState(
      (prevState) => ({
        credentials: {
          ...prevState.credentials,
          [name]: value,
        },
      }),
      () => {
        console.log(this.state.credentials);
      }
    );
  };

  navigateGuest = async (e) => {
    e.preventDefault();
    try {
      this.props.navigate("/guest");
    } catch (error) {
      console.error(error);
    }
  };

  handleClick = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:8000/user_api/register/",
        this.state.credentials
      );

      this.props.navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    const security_questions = {
      Q1: "What was your childhood nickname?",
      Q2: "Who was your childhood hero?",
      Q3: "What is your main hobby?",
    };
    return (
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
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
            <FormControl fullWidth>
              <InputLabel
                id="sq-Label"
                sx={{ fontWeight: "bold", color: "black" }}
              >
                Security Question
              </InputLabel>
              <Select
                labelId="sq-Label"
                id="security_question"
                name="security_question"
                value={this.state.credentials.security_question || ""}
                onChange={this.handleChange}
                required
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={security_questions.Q1}>
                  {security_questions.Q1}
                </MenuItem>
                <MenuItem value={security_questions.Q2}>
                  {security_questions.Q2}
                </MenuItem>
                <MenuItem value={security_questions.Q3}>
                  {security_questions.Q3}
                </MenuItem>
              </Select>
            </FormControl>

            <TextField
              margin="normal"
              required
              fullWidth
              name="security_answer"
              label="Answer"
              type="password"
              id="security_answer"
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
              onChange={this.handleChange}
            />
            <Button
              type="submit"
              variant="contained"
              sx={{ mt: 3, mb: 2, mx: 1, width: "45%" }}
              onClick={this.handleClick}
            >
              Sign Up
            </Button>
            <Button
              type="submit"
              variant="outlined"
              sx={{ mt: 3, mb: 2, mx: 1, width: "45%" }}
              onClick={this.navigateGuest}
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
  return <CreateAccountPage {...props} navigate={navigate} />;
}

export default WithNavigate;
