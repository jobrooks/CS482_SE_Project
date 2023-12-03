import React from "react";
import NavBar from "../components/NavBar";
import UserCard from "../components/UserCards/UserCard";
import TableCard from "../components/TableCard";
import { Grid } from "@mui/material";
import LoginRedirector from "../components/LoginRedirector";
import SearchUser from "../components/SearchUser";
import GuestRedirector from "../components/GuestRedirector";


class SearchPage extends React.Component {

    render() {
        return (
            <div>
                <LoginRedirector />
                <GuestRedirector />
                <NavBar />
                <SearchUser />
            </div>
        )
    }

}

export default SearchPage;