import React, { Component } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import LoginRedirector from "../components/LoginRedirector";
import {
  Button,
  Typography,
  TextField,
  TextareaAutosize,
  Stack,
  InputLabel,
  Input,
  InputAdornment,
  IconButton,
  Avatar,
} from "@mui/material";
import GuestRedirector from "../components/GuestRedirector";

class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: null,
      error: null,
    };
  }

  async componentDidMount() {
    const token = JSON.parse(localStorage.getItem("sessionToken"));
    console.log(token);
    try {
      const response = await axios.get(
        `http://localhost:8000/user_profile/profile/${token}`
      );
      console.log(response.data);
      this.setState({ userData: response.data });
    } catch (error) {
      console.error(error);
    }
  }

  handleClick = (e) => {
    e.preventDefault();
    try {
      this.props.navigate("/edit-profile");
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    const { userData, error } = this.state;

    if (error) {
      return <div>Error: {error.message}</div>;
    }

    if (!userData) {
      return <div>Loading...</div>;
    }

    return (
      <div>
        <GuestRedirector />
        <LoginRedirector />
        <NavBar />
        <h1>User Profile</h1>
        <Stack
          direction="column"
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
        >
          <Avatar
            alt="User Avatar"
            src={`http://localhost:8000/media/${userData.avatar}`}
            sx={{
              width: 150,
              height: 150,
              backgroundColor: "#808080",
            }}
          />
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
          >
            <TextField
            label="Username"
            variant="outlined"
            size="small"
            name="username"
            value={userData.username}
            type="read-only"
          />
          <TextField
            label="Email"
            variant="outlined"
            size="small"
            type="email"
            name="email"
            value={userData.email}
          />
          </Stack>
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
          >
            <TextField
              label="First Name"
              variant="outlined"
              size="small"
              name="first_name"
              value={userData.first_name}
              type="read-only"
            />
            <TextField
              label="Last Name"
              variant="outlined"
              size="small"
              name="last_name"
              value={userData.last_name}
              type="read-only"
            />
          </Stack>
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
          >
           <TextField
            label="Money"
            variant="outlined"
            name="money"
            size="small"
            value={userData.money}
            type="read-only"
          />
          <TextField
            label="Wins"
            variant="outlined"
            name="wins"
            size="small"
            value={userData.wins}
            type="read-only"
          /> 
          <TextField
            label="Games Played"
            variant="outlined"
            name="games_played"
            value={userData.games_played}
            type="read-only"
          /> 
          </Stack>
          <TextField
            label="Bio"
            variant="outlined"
            name="bio"
            value={userData.bio}
            rows={3}
            type="read-only"
          />
          <Button variant="contained" onClick={this.handleClick}>
            Edit Profile
          </Button>
        </Stack>
      </div>
    );
  }
}

function WithNavigate(props) {
  const navigate = useNavigate();
  return <ProfilePage {...props} navigate={navigate} />;
}

export default WithNavigate;
