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
      axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
      axios.defaults.xsrfCookieName = "csrftoken";
      axios.defaults.withCredentials = true;
      const response = await axios.post(
        `http://localhost:8000/friend/send_requests/${userId}`
      );

      // Check the response to determine if the friend request was successful
      if (response.data.success) {
        // Optionally update the UI or provide feedback to the user
        console.log(`Friend request sent to ${userId}`);
      } else {
        // Handle the case where the friend request was not successful
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
