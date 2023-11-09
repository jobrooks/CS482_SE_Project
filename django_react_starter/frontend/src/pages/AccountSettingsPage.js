import { Button } from "@mui/material";
import React from "react";
import NavBar from "../components/NavBar";
import LoginRedirector from "../components/LoginRedirector";

class AccountSettingsPage extends React.Component {

    render() {
        return (
            <div className="AccountSettingsPage">
                <LoginRedirector />
                <NavBar />
                <Button
                >
                    Hi :3
                </Button>
            </div>
        )
    }

}

export default AccountSettingsPage;