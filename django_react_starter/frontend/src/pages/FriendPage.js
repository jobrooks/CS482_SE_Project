import React from "react";
import NavBar from "../components/NavBar";
import UserCard from "../components/UserCard";
import TableCard from "../components/TableCard";
import { Grid } from "@mui/material";
import LoginRedirector from "../components/LoginRedirector";
import FriendRequest from "../components/FriendRequest";
import FriendList from "../components/FriendList";


class FriendPage extends React.Component {

    render() {
        return (
            <div>
                <LoginRedirector />
                <NavBar />
                <FriendRequest />
                <FriendList />
            </div>
        )
    }

}

export default FriendPage;