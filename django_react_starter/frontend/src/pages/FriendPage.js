import React from "react";
import NavBar from "../components/NavBar";
import UserCard from "../components/UserCards/UserCard";
import TableCard from "../components/TableCard";
import { Grid } from "@mui/material";
import LoginRedirector from "../components/LoginRedirector";
import FriendRequest from "../components/FriendRequest";
import FriendList from "../components/FriendList";
import GuestRedirector from "../components/GuestRedirector";


class FriendPage extends React.Component {

    render() {
        return (
            <div>
                <LoginRedirector />
                <GuestRedirector />
                <NavBar />
                <FriendRequest />
                <FriendList />
            </div>
        )
    }

}

export default FriendPage;