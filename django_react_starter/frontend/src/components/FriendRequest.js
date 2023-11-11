import React, { Component } from "react";
import axios from "axios";

class FriendRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      friendRequest: [],
    };
  }

  componentDidMount() {
    this.getFriendRequest();
  }

  getFriendRequest = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("sessionToken"));
      if (!token) {
        console.error("Token not found");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(
        "http://localhost:8000/friend/requests/",
        config
      );
        console.log(response.data.friend_requests);
      this.setState({ friendRequest: response.data.friend_requests });
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    const { friendRequest } = this.state;

    // Check if friendRequest is an array before using map
    if (!Array.isArray(friendRequest)) {
      return <div>No friend requests available</div>;
    }
    return (
      <div>
        <h2>Friend Requests</h2>
        <ul>
          {this.state.friendRequest.map((request) => (
            <li key={request.id}>
              {request.sender.username} <button>Accept</button>
              <button>Decline</button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default FriendRequest;
