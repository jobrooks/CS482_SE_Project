import React from "react";
import { Navigate } from "react-router-dom";

class LoginRedirector extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            activeUserSession: localStorage.getItem("activeUserSession"),
        }
    }

    render() {
        console.log(this.state.activeUserSession);
        if (this.state.activeUserSession == "false") {
            return (
                <Navigate to="/login" />
            );
        }
        
    }

}

export default LoginRedirector;