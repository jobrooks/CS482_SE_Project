import { List, Card, Button, ListItem, Stack, CardHeader, Typography } from "@mui/material";
import axios from "axios";
import React from "react";
import SmallUserCard from "./UserCards/SmallUserCard";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

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
        for (let i in this.state.leaderboardData) {
            let leader = this.state.leaderboardData[i];
            listBuffer.push(
                <SmallUserCard
                    username={leader.username}
                    wins={leader.wins}
                    is_active={leader.is_active}
                    avatarColor={leader.avatar_color}
                    info={true}
                    friendable={true}
                    inviteable={true}
                    messageable={true}
                />
            );
        }
        return (
            <div id="leaderboardTable">
                <Stack direction="column"
                    alignItems="center"
                >
                    { listBuffer }
                </Stack>
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
                        m: 2,
                        p: 0.5,
                    }}
                >
                    <CardHeader
                        title={"Leaderboard"}
                    />
                    { this.makeLeaderboardTable() }
                </Card>
            </div>
        );
    }

}

export default LeaderboardCard;