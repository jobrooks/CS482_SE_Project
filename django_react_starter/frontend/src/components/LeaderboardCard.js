import { List, Card, Button, ListItem } from "@mui/material";
import axios from "axios";
import React from "react";
import SmallUserCard from "./UserCards/SmallUserCard";

class LeaderboardCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            leaderboardData: null,
        }
    }

    componentDidMount() {
        this.getLeaderboard();
    }

    makeLeaderboardTable() {
        let listBuffer = [];
        console.log(this.state.leaderboardData);
        for (let i in this.state.leaderboardData) {
            let leader = this.state.leaderboardData[i];
            console.log(leader);
            listBuffer.push(
                <SmallUserCard
                    username={leader.username}
                    wins={leader.wins}
                    info={true}
                    friendable={false}
                />
            );
        }
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
            this.setState({ leaderboardData: response.data.leaders });
            return response.data;
        })
        .catch((response) => {
            console.log("Error getting leaderboard");
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
                    { this.makeLeaderboardTable() }
                </Card>
            </div>
        );
    }

}

export default LeaderboardCard;