import React, { Component } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import LoginRedirector from "../components/LoginRedirector";

class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: null,
      error: null,
    };
  }

  async componentDidMount() {
    const token = JSON.parse(localStorage.getItem("sessionToken"))
    console.log(token)
    try {
      const response = await axios.get(
        `http://localhost:8000/user_profile/profile/${token}`
      );
      console.log(response.data)
      this.setState({ userData: response.data });
    } catch (error) {
      console.error(error);
    }
  }

  handleClick = (e) =>{
    e.preventDefault();
    try {
        this.props.navigate("/edit-profile")
    } catch (error) {
        console.error(error);
    }
}

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
        <LoginRedirector />
        <NavBar />
        <h1>User Profile</h1>
        <img src={userData.avatar} alt="User Avatar" />
        <p>
          <strong>Username:</strong> {userData.username}
        </p>
        <p>
          <strong>Email:</strong> {userData.email}
        </p>
        <p>
          <strong>First Name:</strong> {userData.first_name}
          <strong >Last Name: </strong> {userData.last_name}
        </p>
        <p>
          <strong>Money:</strong> {userData.money}
        </p>
        <p>
          <strong>Wins:</strong> {userData.wins}
        </p>
        <p>
          <strong>Games Played:</strong> {userData.games_played}
        </p>
        <p>
          <strong>Bio:</strong> {userData.bio}
        </p>
        <button onClick={this.handleClick}>Edit Profile</button>
      </div>
    );
  }
}

function WithNavigate(props) {
  const navigate = useNavigate();
  return <ProfilePage {...props} navigate={navigate} />
}

export default WithNavigate;
