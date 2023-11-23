import React from "react";

class LargeUserCard extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            username: this.props.username,
            userdata: null,
        }
    }

    componentDidMount() {
        this.getUserInfo();
    }

    getUserInfo() {
        axios.get(`http://localhost:8000/user_profile/profile/getuserprofile/${this.state.username}`)
        .then((response) => {
            this.setState({ userdata: response.data });
            return response.data;
        })
        .catch((response) => {
            console.log("Error getting user data");
            return response;
        })
    }

}

export default LargeUserCard;