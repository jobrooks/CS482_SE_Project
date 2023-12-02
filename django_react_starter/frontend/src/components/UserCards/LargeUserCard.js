import React, { Suspense } from "react";
import axios from "axios";
import { Avatar, Badge, Box, Button, Card, CardActionArea, Divider, Fab, Grid, IconButton, Paper, Skeleton, Stack, Typography } from "@mui/material";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import EditIcon from '@mui/icons-material/Edit';
import QueueIcon from '@mui/icons-material/Queue';
import ChatIcon from '@mui/icons-material/Chat';
import { blue, grey, red } from "@mui/material/colors";
import AvatarColorPicker from "../AvatarColorPicker";

let globalAvatarColor = red[500]

/** LargeUserCard
 * - This is a user card object that displays user information in a Large size
 * - It displays a complete set of user information by making a request for the user
 * specified by the username prop to the backend
 * Props:
 * - username: the username for the user being displayed
 * - token: alternative to username, can be used to load the data
 * - friendable: whether or not to display an add friend button on the card
 * - editable: whether or not this card can be edited, i.e. it is the logged in user's card
 * - messageable: whether or not this user can be messaged
 * - inviteable: whether or not this user can be invited to a game
 * Notes:
 * - in order to initialize the editable version, it is beneficial to use the users token
 */
class LargeUserCard extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            // Information
            username: this.props.username,
            token: this.props.token,
            guestUsername: this.props.guestUsername,
            // Component state
            userdata: null,
            isLoading: true,
            avatarColorPickerOpen: false,
            // How component is displayed
            friendable: this.props.friendable,
            editable: this.props.editable,
            messageable: this.props.messageable,
            inviteable: this.props.inviteable,
        }
    }

    componentDidMount() {
        this.getUserInfo();
    }

    getUserInfo() {
        if (this.state.token) {
            axios.get(`http://localhost:8000/user_profile/profile/${this.state.token}`)
            .then((response) => {
                this.setState({ userdata: response.data, isLoading: false });
                console.log(this.state.userdata);
                return response.data;
            })
            .catch((response) => {
                console.log("Error getting user data via token");
                return response;
            })
        } else if (this.state.username) {
            axios.get(`http://localhost:8000/user_profile/profile/getuserprofile/${this.state.username}`)
            .then((response) => {
                this.setState({ userdata: response.data, isLoading: false });
                console.log(this.state.userdata);
                return response.data;
            })
            .catch((response) => {
                console.log("Error getting user data via username");
                return response;
            })
        } else if (this.state.guestUsername) {
            axios.get(`http://localhost:8000/user_profile/profile/getguestprofile/${this.state.guestUsername}`)
            .then((response) => {
                this.setState({ userdata: response.data, isLoading: false });
                console.log(this.state.userdata);
                return response.data;
            })
            .catch((response) =>{
                console.log("Error getting guest data");
                return response;
            })
        } else {
            console.log("No token or username specified");
            return null;
        }
    }

    getInviteIcon() {
        if (this.state.inviteable && !this.state.editable) {
            return (
                <IconButton
                    aria-label="Invite to Game"
                    onClick={this.handleInvite}
                >
                    <QueueIcon />
                </IconButton>
            );
        }
    }

    getMessageIcon() {
        if (this.state.messageable && !this.state.editable) {
            return (
                <IconButton
                    aria-label="Message"
                    onClick={this.handleMessage}
                >
                    <ChatIcon />
                </IconButton>
            );
        }
    }

    getAddFriendIcon() {
        if (this.state.friendable && !this.state.editable) {
            return (
                <IconButton
                    aria-label="Add Friend"
                    onClick={this.handleAddFriend}
                >
                    <PersonAddIcon />
                </IconButton>
            );
        }
    }

    getEditIcon() {
        if (this.state.editable) {
            return (
                <Fab
                    size="small"
                    aria-label="Invite to Game"
                    onClick={() => {this.toggleAvatarColorPicker()}}
                >
                    <EditIcon />
                </Fab>
            );
        }
    }

    handleAddFriend() {
        console.log("Add Friend");
    }

    handleMessage() {
        console.log("Open Chat");
    }

    handleInvite() {
        console.log("Invited");
    }
    
    toggleAvatarColorPicker() {
        this.setState({ avatarColorPickerOpen: !this.state.avatarColorPickerOpen });
    }

    changeColor(color) {
        this.setState((prevState) => ({
            userdata: {
              ...prevState.userdata,
              avatar_color: color
            }
        }));
        this.patchAvatarColor(color);
    }

    patchAvatarColor(color) {
        const data = {
            "avatar_color": color
        }
        let token = this.state.token;
        axios.patch(`http://localhost:8000/user_profile/profile/avatarcolor/${token}/`, data)
        .then((response) => {
            return response.data;
        }).catch((response) => {
            console.log("Error patching avatar color")
            console.log(response);
        });
    }

    render() {
        return (
            <div className="LargeUserCard">
                <div className="AvatarColorPicker">
                    <AvatarColorPicker
                        colorPickerOpen={this.state.avatarColorPickerOpen}
                        toggleColorPicker={() => this.toggleAvatarColorPicker()}
                        changeColor={(color) => this.changeColor(color)}
                    />
                </div>
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
                                color={!this.state.isLoading ? (this.state.userdata.is_active ? "success" : "error") : "error"}
                                badgeContent=" "
                                overlap="circular"
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                            >
                                <Badge
                                    badgeContent={ this.getEditIcon() }
                                    overlap="circular"
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                    }}
                                >
                                    <Avatar
                                        sx = {{
                                            bgcolor: !this.state.isLoading ? this.state.userdata.avatar_color : grey[500],
                                            width: "70%",
                                            height: "auto",
                                            aspectRatio: 1,
                                        }}
                                    />
                                </Badge>
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
                                                    {new Date(this.state.userdata.date_joined).toLocaleDateString()}
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
                    <Stack direction="row"
                        spacing={2}
                        justifyContent="space-around"
                    >
                        { this.getInviteIcon() }
                        { this.getMessageIcon() }
                        { this.getAddFriendIcon() }
                    </Stack>
                </Card>
            </div>
        );
    }

}

export default LargeUserCard;