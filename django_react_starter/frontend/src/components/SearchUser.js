import React, { Component } from "react";
import axios from "axios";

class SearchUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: "",
      users: [],
    };
  }

  handleChange = (e) => {
    this.setState({
      query: e.target.value,
    });
  };

  handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `http://localhost:8000/friend/search_users/?username=${this.state.query}`
      );
      this.setState({ users: response.data.users });
    } catch (error) {
      console.error(error);
    }
  };

  sendFriendRequest = async (userId) => {
    try {
      const token = JSON.parse(localStorage.getItem("sessionToken"))
      if (!token) {
        console.error("Token not found");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post(
        `http://localhost:8000/friend/send_requests/${userId}`,
        {},
        config
      );

      if (response.data.success) {
        console.log(`Friend request sent to ${userId}`);
      } else {
        console.error("Friend request failed");
      }
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    return (
      <div>
        <input
          type="text"
          value={this.state.query}
          onChange={this.handleChange}
        />
        <button onClick={this.handleSearch}>Search</button>
        <ul>
          {this.state.users.map((user) => (
            <li key={user.id}>
              {user.username}{" "}
              <button onClick={() => this.sendFriendRequest(user.id)}>
                Send Friend Request
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default SearchUser;
