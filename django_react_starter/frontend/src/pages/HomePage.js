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
import LargeUserCard from "../components/UserCards/LargeUserCard";
import Chat from "../components/Chat";


class HomePage extends React.Component {

    render() {
        return (
            <div className="HomePage">
                <LoginRedirector />
                <NavBar />
                <Grid container spacing={0}>
                    <Grid item xs={12}> {/* Top Bar */}

                    </Grid>
                    <Grid item xs={6}> {/* Left Column */}
                        <LargeUserCard
                            token={JSON.parse(localStorage.getItem("sessionToken"))}
                            guestUsername={JSON.parse(localStorage.getItem("guestUsername"))}
                            friendable={false}
                            editable={true}
                            messageable={false}
                            inviteable={false}
                        />
                        <Chat palUsername="smelly" mode="global" />
                        <TableCard 
                            token={JSON.parse(localStorage.getItem("sessionToken"))}
                            guestUsername={JSON.parse(localStorage.getItem("guestUsername"))}
                        />
                        <CardBackingCard 
                            token={JSON.parse(localStorage.getItem("sessionToken"))}
                            guestUsername={JSON.parse(localStorage.getItem("guestUsername"))}
                        />
                    </Grid>
                    <Grid item xs={6}> {/* Right Column */}
                        <LeaderboardCard />
                    </Grid>
                    <Grid item xs={6}>

                    </Grid>
                    <Grid item xs={6}>

                    </Grid>
                </Grid>
            </div>
        )
    }

}

export default HomePage;