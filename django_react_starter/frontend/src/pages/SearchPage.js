import React from "react";
import NavBar from "../components/NavBar";
import UserCard from "../components/UserCard";
import TableCard from "../components/TableCard";
import { Grid } from "@mui/material";
import LoginRedirector from "../components/LoginRedirector";
import SearchUser from "../components/SearchUser";


class SearchPage extends React.Component {

    render() {
        return (
            <div>
                <LoginRedirector />
                <NavBar />
                <SearchUser />
            </div>
        )
    }

}

export default SearchPage;