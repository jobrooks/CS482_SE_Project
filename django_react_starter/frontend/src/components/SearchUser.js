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

  render() {
    return (
      <div>
        <input type="" value={this.state.query} onChange={this.handleChange} />
        <button onClick={this.handleSearch}>Search</button>
        <ul>
            {this.state.users.map((user) => (
                <li key={user.id}>
                    {user.username}{''}
                    <button>Send Friend Request</button>
                </li>
            ))}
        </ul>
      </div>
    );
  }
}

export default SearchUser;
