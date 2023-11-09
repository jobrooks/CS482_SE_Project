import React from "react";
import { Navigate } from "react-router-dom";

class LoginRedirector extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            sessionToken: localStorage.getItem("sessionToken"),
        }
    }

    render() {
        console.log(this.state.sessionToken);
        if (this.state.sessionToken == "null" || this.state.sessionToken == null || this.state.sessionToken == "") { // May need to change to something that just checks if is valid session token on backend
            return (
                <Navigate to="/login" />
            );
        }
        
    }

}

export default LoginRedirector;