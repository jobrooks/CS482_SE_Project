import { List, Card, Button, ListItem } from "@mui/material";
import axios from "axios";
import React from "react";

class LeaderboardCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            leaderboardData: this.getLeaderboard(),
        }
    }

    makeLeaderboardTable() {
        let listBuffer = [];
        listBuffer.push(<ListItem>Hi</ListItem>);
        listBuffer.push(<ListItem>Bye</ListItem>);
        listBuffer.push(<ListItem>Thanks</ListItem>);
        listBuffer.push(<ListItem>You're Welcome</ListItem>);
        return (
            <div id="leaderboardTable">
                <List>
                    { listBuffer }
                </List>
            </div>
        );
    }

    getLeaderboard() {
        axios.get("http://localhost:8000/user_profile/profile/leaderboard")
        .then((response) => {
            return response.data;
        })
        .catch((response) => {
            console.log("Error getting leaderboard")
            return response;
        })
    }

    render() {
        return (
            <div id="leaderboard">
                <Card elevation={3}
                    sx={{
                        width: 430,
                        height: "auto",
                        m: 2
                    }}
                >
                    <Button>Hi :3</Button>
                    { this.makeLeaderboardTable() }
                </Card>
            </div>
        );
    }

}

export default LeaderboardCard;