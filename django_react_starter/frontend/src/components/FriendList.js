import React, { Component } from "react";
import axios from "axios";

class FriendList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      friends: null,
    };
  }

  componentDidMount() {
    this.getFriends();
  }

  getFriends = async () => {
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
        "http://localhost:8000/friend/get_friends/",
        config
      );
      this.setState({ friends: response.data.friends });
    } catch (error) {
      console.error(error);
    }
  };

  removeFriend = async (friendId) => {
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
      await axios.post(
        `http://localhost:8000/friend/unfriend/${friendId}`,
        {},
        config
      );

      this.setState((prevState) => ({
        friends: prevState.friends.filter((friend) => friend.id !== friendId),
      }));
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    const { friends } = this.state;

    if (friends === null) {
      return <div>Loading...</div>;
    }

    if (!Array.isArray(friends) || friends.length === 0) {
      return <div>No friends</div>;
    }

    return (
      <div>
        <h2>Friends</h2>
        <ul>
          {friends.map((friend) => (
            <li key={friend.id}>
              {friend.username}{" "}
              <button onClick={() => this.removeFriend(friend.id)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default FriendList;
