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
      const senderIds = response.data.friend_requests.map(
        (request) => request.sender
      );
      const name_res = senderIds.map((senderId) =>
        axios.get(`http://localhost:8000/friend/get_username/${senderId}`)
      );

      const usernameRes = await Promise.all(name_res);
      const usernames = usernameRes.map((res) => res.data.username);

      const updatedRequests = response.data.friend_requests.map(
        (request, index) => ({
          ...request,
          sender: { username: usernames[index] },
        })
      );

      this.setState({ friendRequest: updatedRequests });
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
