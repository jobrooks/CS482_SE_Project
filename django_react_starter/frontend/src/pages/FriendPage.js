import React from "react";
import NavBar from "../components/NavBar";
import UserCard from "../components/UserCard";
import TableCard from "../components/TableCard";
import { Grid } from "@mui/material";
import LoginRedirector from "../components/LoginRedirector";
import FriendRequest from "../components/FriendRequest";


class FriendPage extends React.Component {

    render() {
        return (
            <div>
                <LoginRedirector />
                <NavBar />
                <FriendRequest />
            </div>
        )
    }

}

export default FriendPage;