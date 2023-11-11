import React, { Component } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
        <h1>User Profile</h1>
        <img src={userData.avatar} alt="User Avatar" />
        <p>
          <strong>Username:</strong> {userData.username}
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
      </div>
    );
  }
}

export default ProfilePage;
