import React, { Component } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      security_question: "",
      security_answer: "",
      newPassword: "",
      isSecurityAnswerCorrect: false,
      userExists: false,
    };
  }

  handleUsernameSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `http://localhost:8000/user_profile/validate/${this.state.username}`
      );

      if (response.data.user_exist) {
        this.fetchSecurityQuestion();
        this.setState({ userExists: true });
      } else {
        console.log("User does not exist");
      }
    } catch (error) {
      console.error("Error checking user existence:", error);
    }
  };

  fetchSecurityQuestion = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/user_profile/question/${this.state.username}`
      );

      this.setState({ security_question: response.data.security_question });
    } catch (error) {
      console.error("Error fetching security question:", error);
    }
  };

  handleAnswerSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8000/user_profile/verify-security-answer/",
        {
          username: this.state.username,
          security_answer: this.state.security_answer,
        }
      );

      if (response.data.is_answer_correct) {
        this.setState({ isSecurityAnswerCorrect: true });
      } else {
        console.log("Incorrect answer");
      }
    } catch (error) {
      console.error("Error verifying security answer:", error);
    }
  };

  handlePasswordChange = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.put(
        "http://localhost:8000/user_profile/reset-password/",
        {
          username: this.state.username,
          newPassword: this.state.newPassword,
        }
      );
      localStorage.setItem("sessionToken", JSON.stringify(res.data.token));
      console.log(res.data);
      this.props.navigate('/login')
    } catch (error) {
      console.error("Error resetting password:", error);
    }
  };

  render() {
    const {
      username,
      security_question,
      security_answer,
      newPassword,
      isSecurityAnswerCorrect,
      userExists,
    } = this.state;

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
            Password Reset
          </Typography>
          {!userExists ? (
            // If user does not exist, show username input
            <Box component="form" onSubmit={this.handleUsernameSubmit}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Username"
                type="text"
                id="username"
                value={username}
                onChange={(e) => this.setState({ username: e.target.value })}
              />
              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Check User Existence
              </Button>
            </Box>
          ) : isSecurityAnswerCorrect ? (
            // If the security answer is correct, show the password change form
            <Box component="form" onSubmit={this.handlePasswordChange}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="New Password"
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => this.setState({ newPassword: e.target.value })}
              />
              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Set New Password
              </Button>
            </Box>
          ) : (
            // If the security answer is not yet verified, show the security question and answer form
            <Box component="form" onSubmit={this.handleAnswerSubmit}>
              <Typography sx={{ mt: 2, mb: 1 }}>
                {security_question}
              </Typography>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Security Answer"
                type="text"
                id="security_answer"
                value={security_answer}
                onChange={(e) => this.setState({ security_answer: e.target.value })}
              />
              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Submit Answer
              </Button>
            </Box>
          )}
        </Box>
      </Container>
    );
  }
}

function WithNavigate(props) {
  const navigate = useNavigate();
  return <ResetPassword {...props} navigate={navigate} />;
}

export default WithNavigate;
