import { Button } from "@mui/material";
import React from "react";
import NavBar from "../components/NavBar";
import UserCard from "../components/UserCard";

class HomePage extends React.Component {

    render() {
        return (
            <div className="HomePage">
                <NavBar />
                <UserCard />
            </div>
        )
    }

}

export default HomePage;