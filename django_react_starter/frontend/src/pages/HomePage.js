import React from "react";
import NavBar from "../components/NavBar";
import UserCard from "../components/UserCard";
import TableCard from "../components/TableCard";
import { Grid } from "@mui/material";

class HomePage extends React.Component {

    render() {
        return (
            <div className="HomePage">
                <NavBar />
                <Grid container spacing={0}>
                    <Grid item xs={6}>
                        <UserCard />
                    </Grid>
                    <Grid item xs={6}>

                    </Grid>
                    <Grid item xs={6}>
                        <TableCard />
                    </Grid>
                    <Grid item xs={6}>
                        
                    </Grid>
                </Grid>
            </div>
        )
    }

}

export default HomePage;