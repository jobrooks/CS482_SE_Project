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
      const response = await axios.get(`http://localhost:8000/friend/search_users/?username=${this.state.query}`);
      this.setState({ users: response.data.users }); // Assuming the response has a 'users' property
    } catch (error) {
      console.error(error);
    }
  };

  sendFriendRequest = (userId) => {
    // Implement logic to send a friend request using userId
    console.log(`Sending friend request to user with id ${userId}`);
  };

  render() {
    return (
      <div>
        <input type="text" value={this.state.query} onChange={this.handleChange} />
        <button onClick={this.handleSearch}>Search</button>
        <ul>
          {this.state.users.map((user) => (
            <li key={user.id}>
              {user.username}{" "}
              <button onClick={() => this.sendFriendRequest(user.id)}>Send Friend Request</button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default SearchUser;
