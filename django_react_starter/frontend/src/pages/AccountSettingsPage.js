import { Button } from "@mui/material";
import React from "react";
import NavBar from "../components/NavBar";

class AccountSettingsPage extends React.Component {

    render() {
        return (
            <div className="AccountSettingsPage">
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