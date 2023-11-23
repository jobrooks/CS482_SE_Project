import React, { Suspense } from "react";
import axios from "axios";
import { Avatar, Badge, Box, Card, Divider, Grid, Skeleton, Stack, Typography } from "@mui/material";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

/** LargeUserCard
 * - This is a user card object that displays user information in a Large size
 * - It displays a complete set of user information by making a request for the user
 * specified by the username prop to the backend
 * Props:
 * - username: the username for the user being displayed
 * - friendable: whether or not to display an add friend button on the card
 */
class LargeUserCard extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            // Information
            username: this.props.username,
            userdata: null,
            // Component state
            isLoading: true,
            // How component is displayed
        }
    }

    componentDidMount() {
        this.getUserInfo();
    }

    getUserInfo() {
        axios.get(`http://localhost:8000/user_profile/profile/getuserprofile/${this.state.username}`)
        .then((response) => {
            this.setState({ userdata: response.data, isLoading: false });
            console.log(this.state.userdata);
            return response.data;
        })
        .catch((response) => {
            console.log("Error getting user data");
            return response;
        })
    }

    render() {
        return (
            <div className="LargeUserCard">
                <Card elevation={3}
                    sx={{
                        width: 430,
                        height: "auto",
                        m: 2,
                        p: 1
                    }}
                >
                    <Grid container>
                        <Grid item
                            xs={6}
                        >
                            <Badge
                                color="success"
                                badgeContent=" "
                                variant="dot"
                                size="large"
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                sx={{
                                    m: 2,
                                }}
                            >
                                <Avatar
                                    sx = {{
                                        bgcolor: this.state.avatarColor,
                                        width: "90%",
                                        height: "auto",
                                        aspectRatio: 1,
                                    }}
                                />
                            </Badge>
                        </Grid>
                        <Grid item
                            xs={6}
                        >
                            <Box
                                sx={{
                                    m: 2,
                                    width: "100%",
                                    height: "100%",
                                }}
                            >
                                {this.state.isLoading ? (
                                    <Skeleton variant="rounded" sx={{ width: "80%", height: "90%"}} />
                                ) : (
                                    <Grid container
                                        spacing={2}
                                    >
                                        <Grid item xs={6}>
                                            <Stack direction="column"
                                                alignItems="start"
                                            >
                                                <Typography variant="caption" noWrap={false}>
                                                    Username
                                                </Typography>
                                                <Typography variant="subtitle" noWrap={false}>
                                                    {this.state.userdata.username}
                                                </Typography>
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Stack direction="column"
                                                alignItems="start"
                                            >
                                                <Typography variant="caption" noWrap={false}>
                                                    Wins
                                                </Typography>
                                                <Stack direction="row"
                                                    alignContent="center"
                                                >
                                                    <Typography variant="caption" noWrap={false}>
                                                        <EmojiEventsIcon />
                                                    </Typography>
                                                    <Typography variant="subtitle" noWrap={false}>
                                                        {this.state.userdata.wins}
                                                    </Typography>
                                                </Stack>
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Stack direction="column"
                                                alignItems="start"
                                            >
                                                <Typography variant="caption" noWrap={false}>
                                                    Games Played
                                                </Typography>
                                                <Typography variant="subtitle" noWrap={false}>
                                                    {this.state.userdata.games_played}
                                                </Typography>
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Stack direction="column"
                                                alignItems="start"
                                            >
                                                <Typography variant="caption" noWrap={false}>
                                                    Money
                                                </Typography>
                                                <Typography variant="subtitle" noWrap={false}>
                                                    ${this.state.userdata.money}
                                                </Typography>
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Stack direction="column"
                                                alignItems="start"
                                            >
                                                <Typography variant="caption" noWrap={false}>
                                                    Status
                                                </Typography>
                                                <Typography variant="subtitle" noWrap={false}>
                                                    {this.state.userdata.is_active ? "Online" : "Offline"}
                                                </Typography>
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Stack direction="column"
                                                alignItems="start"
                                            >
                                                <Typography variant="caption" noWrap={false}>
                                                    Date Joined
                                                </Typography>
                                                <Typography variant="subtitle" noWrap={false}>
                                                    {this.state.userdata.date_joined}
                                                </Typography>
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                )}
                            </Box>
                        </Grid>
                        <Grid item
                            xs={12}
                        >
                            <Box
                                sx={{
                                    m: 2,
                                    width: 400,
                                    height: 100
                                }}
                            >
                                {this.state.isLoading ? (
                                    <Skeleton variant="rounded" sx={{ width: "100%", height: "100%"}} />
                                ) : (
                                    <Suspense fallback={<div>Loading...</div>}>{/* Here the suspense is really just an extra not really needed */}
                                        <Stack direction="column"
                                            alignItems="flex-start"
                                        >
                                            <Typography variant="caption" noWrap={false}>
                                                Bio
                                            </Typography>
                                            <Typography variant="subtitle" noWrap={false}>
                                                {this.state.userdata.bio}
                                            </Typography>
                                        </Stack>
                                    </Suspense>
                                )}
                            </Box>
                        </Grid>
                    </Grid>
                </Card>
            </div>
        );
    }

}

export default LargeUserCard;