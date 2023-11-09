import React from "react";
import NavBar from "../components/NavBar";
import UserCard from "../components/UserCard";
import TableCard from "../components/TableCard";
import { Grid } from "@mui/material";
import LoginRedirector from "../components/LoginRedirector";
import SearchUser from "../components/SearchUser";


class HomePage extends React.Component {

    render() {
        return (
            <div className="HomePage">
                <LoginRedirector />
                <NavBar />
                <SearchUser />
            </div>
        )
    }

}

export default HomePage;