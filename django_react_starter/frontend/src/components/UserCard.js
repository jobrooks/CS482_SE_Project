import React from "react";
import { Avatar, Card, Grid, Typography } from "@mui/material";
import { red } from '@mui/material/colors';
import { Button } from "@mui/base";


class UserCard extends React.Component {

    render() {
        return (
            <div className="UserCard">
                <Card
                    sx={{
                        width: 500,
                        height: 285,
                        m: 12
                    }}

                >
                    <Grid
                        container
                    >
                        <Grid xs={2}>
                            <Avatar
                                sx={{
                                    bgcolor: red[500],
                                    width: 100,
                                    height: 100,
                                }}
                                aria-label="recipe"
                            >
                                U
                            </Avatar>
                        </Grid>
                        <Grid container>
                            <Grid>
                                <Typography>
                                    Username
                                </Typography>
                            </Grid>
                            <Grid>
                                <Button>
                                    Hi :3
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Card>
            </div>
        )
    }

}

export default UserCard;