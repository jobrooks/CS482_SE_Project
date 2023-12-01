import React, { Component } from "react";
import axios from "axios";
import { Container, Typography, TextField, Button, Box } from "@mui/material";

class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      security_question: "",
      security_answer: "",
      newPassword: "",
      isSecurityAnswerCorrect: "",
    };
  }

  componentDidMount() {
    this.getSecurityQuestion();
  }

  getSecurityQuestion = async () => {
    try {
    } catch (error) {
      console.error(error);
    }
  };

  handleAnswerSubmit = async (e) => {
    e.preventDefault();
    try {
    } catch (error) {
      console.error(error);
    }
  };

  handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    const {
      security_question,
      security_answer,
      newPassword,
      isSecurityAnswerCorrect,
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
          {isSecurityAnswerCorrect ? (
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
              <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
                Set New Password
              </Button>
            </Box>
          ) : (
            <Box component="form" onSubmit={this.handleAnswerSubmit}>
              <Typography sx={{ mt: 2, mb: 1 }}>{security_question}</Typography>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Security Answer"
                type="text"
                id="security_answer"
                value={security_answer}
                onChange={(e) =>
                  this.setState({ security_answer: e.target.value })
                }
              />
              <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
                Submit Answer
              </Button>
            </Box>
          )}
        </Box>
      </Container>
    );
  }
}
export default ResetPassword;
