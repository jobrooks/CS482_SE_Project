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
import PhotoCamera from "@mui/icons-material/PhotoCamera";
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
    this.setState({
      userData: {
        ...this.state.userData,
        avatar: event.target.files[0],
      },
    });
  };

  handleClick = async (e) => {
    e.preventDefault();
    const token = JSON.parse(localStorage.getItem("sessionToken"));
    console.log(token);
    
    try {
      const { username, email, password, first_name, last_name, bio } = this.state.userData;
  
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("first_name", first_name);
      formData.append("last_name", last_name);
      formData.append("bio", bio);
  
      // Append the avatar file if it exists
      if (this.state.userData.avatar) {
        formData.append("avatar", this.state.userData.avatar);
      }
  
      const res = await axios.put(
        `http://localhost:8000/user_profile/profile/edit/${token}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
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
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="avatar-input"
            type="file"
            onChange={this.handleAvatarChange}
          />
          <Avatar
            alt="User Avatar"
            src={`http://localhost:8000/media/${userData.avatar}`}
            sx={{
              width: 150,
              height: 150,
              backgroundColor: "#808080",
            }}
          />
          <label htmlFor="avatar-input">
            <Input
              id=""
              type=""
              inputProps={{
                accept: "image/*",
              }}
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
          </label>
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
