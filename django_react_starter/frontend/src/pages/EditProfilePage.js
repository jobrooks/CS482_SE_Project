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
} from "@mui/material";
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import React from "react";
import NavBar from "../components/NavBar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LoginRedirector from "../components/LoginRedirector";

class EditProfilePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userData: {
        avatar: "",
        username: "",
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        bio: "",
      },
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

  handleChange = (e) => {
    this.setState({
      userData: {
        ...this.state.userData,
        [e.target.name]: e.target.value,
      },
    });
  };

  handleAvatarChange = (event) => {
    console.log(event.target.files[0]);
  };

  handleClick = async (e) => {
    e.preventDefault();
    const token = JSON.parse(localStorage.getItem("sessionToken"));
    console.log(token);
    try {
      const { avatar, username, email, password, first_name, last_name, bio } =
        this.state.userData;
      const updateData = {
        avatar,
        username,
        email,
        password,
        first_name,
        last_name,
        bio,
      };
      console.log(updateData);
      const res = await axios.put(
        `http://localhost:8000/user_profile/profile/edit/${token}/`,
        updateData
      );
      console.log(res.data);
      this.props.navigate("/profile");
    } catch (error) {
      console.error(error);
      console.error(error.response.data);
    }
  };

  render() {
    const { userData } = this.state;
    return (
      <div>
        <LoginRedirector />
        <Typography variant="h4"> User Profile</Typography>
        <Stack
          direction="column"
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
        >
          <InputLabel htmlFor="avatar">Avatar</InputLabel>
          <Input
            id=""
            type=""
            inputProps={{
              accept: "image/*",
            }}
            onChange={this.handleAvatarChange}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  edge="end"
                  aria-label="upload picture"
                  component="span"
                >
                  <PhotoCamera />
                </IconButton>
              </InputAdornment>
            }
          />
          <TextField
            label="Username"
            variant="outlined"
            size="small"
            name="username"
            value={userData.username}
            onChange={this.handleChange}
          />

          <TextField
            label="Email"
            variant="outlined"
            type="email"
            name="email"
            value={userData.email}
            onChange={this.handleChange}
          />

          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
          >
            <TextField
              label="First Name"
              variant="outlined"
              name="first_name"
              value={userData.first_name}
              onChange={this.handleChange}
            />
            <TextField
              label="Last Name"
              variant="outlined"
              name="last_name"
              value={userData.last_name}
              onChange={this.handleChange}
            />
          </Stack>

          <TextareaAutosize
            minRows={3}
            placeholder="Bio"
            name="bio"
            value={userData.bio}
            onChange={this.handleChange}
          />

          <Button variant="contained" onClick={this.handleClick}>
            Save
          </Button>
        </Stack>
      </div>
    );
  }
}

function WithNavigate(props) {
  const navigate = useNavigate();
  return <EditProfilePage {...props} navigate={navigate} />;
}

export default WithNavigate;
