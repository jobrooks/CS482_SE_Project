import React from "react";
import NavBar from "../components/NavBar";
import UserCard from "../components/UserCards/UserCard";
import TableCard from "../components/TableCard";
import { Grid } from "@mui/material";
import LoginRedirector from "../components/LoginRedirector";
import CardBackingCard from "../components/CardBackingCard";
import LeaderboardCard from "../components/LeaderboardCard";
import SmallUserCard from "../components/UserCards/SmallUserCard";
import { blue, red } from "@mui/material/colors";


class HomePage extends React.Component {

    render() {
        return (
            <div className="HomePage">
                <LoginRedirector />
                <NavBar />
                <Grid container spacing={0}>
                    <Grid item xs={6}>
                        <UserCard />
                    </Grid>
                    <Grid item xs={6}>
                        <LeaderboardCard />
                        <SmallUserCard
                            avatarColor={blue[500]}
                            username="My Account"
                            wins={5}
                            info={true}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TableCard />
                    </Grid>
                    <Grid item xs={6}>
                        <CardBackingCard />
                    </Grid>
                </Grid>
            </div>
        )
    }

}

export default HomePage;