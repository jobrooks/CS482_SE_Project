import { Avatar, Card, CardContent, Stack, Item, Typography, Divider, CardActionArea, Button, Badge, IconButton, Box, Dialog, ButtonGroup } from "@mui/material";
import React from "react";
import axios from "axios";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ChatIcon from '@mui/icons-material/Chat';
import QueueIcon from '@mui/icons-material/Queue';
import PersonIcon from '@mui/icons-material/Person';
import { blue, grey, red } from "@mui/material/colors";
import LargeUserCard from "./LargeUserCard";

/** SmallUserCard
 * This is a user card object that displays user information in a small size
 * It also allows users to click on the card to reveal extra information
 * Props:
 * - avatarColor: the avatar color for the card
 * - username: the username for the card
 * - wins: the number of wins for the card
 * - is_active: the users online status
 * - info: whether or not the box should be clickable in order to reveal more info
 * - friendable: whether or not the add friend icon appears
 * - inviteable: whether or not the invite icon appears
 * - messageable: whether or not the message icon appears
 * Notes:
 * - If you don't specify username, avatar color, wins, and is_active, the component will automatically make a
 * request to the backend to retrieve the rest of the user data based on the username
 */
class SmallUserCard extends React.Component {

    constructor(props) {
        super(props);
        this.handleInfoClick = this.handleInfoClick.bind(this);
        this.handleInfoDialogClose = this.handleInfoDialogClose.bind(this);
        this.handleAddFriend = this.handleAddFriend.bind(this);
        this.state = {
            // Info displayed
            avatarColor: this.props.avatarColor,
            username: this.props.username,
            wins: this.props.wins,
            is_active: this.props.is_active,
            // Component state
            infoDialogOpen: false,
            isLoading: true,
            userdata: null,
            // Governs how component is displayed
            info: this.props.info,
            isButton: this.props.isButton,
            friendable: this.props.friendable,
            inviteable: this.props.inviteable,
            messageable: this.props.messageable,
        }
    }

    componentDidMount() {
        if (this.state.username && !this.state.isButton && (!this.state.avatarColor || !this.state.wins || !this.state.is_active)) {
            axios.get(`http://localhost:8000/user_profile/profile/getuserprofile/${this.state.username}`)
            .then((response) => {
                this.setState({
                    userdata: response.data, isLoading: false,
                    avatarColor: response.data.avatar_color, wins: response.data.wins, is_active: response.data.is_active,
                });
                return response.data;
            })
            .catch((response) => {
                console.log("Error getting user data");
                return response;
            })
        }
    }

    handleInfoClick() {
        this.setState({ infoDialogOpen: true });
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

    handleInfoDialogClose() {
        this.setState({ infoDialogOpen: false });
    }

    getAddFriendIcon() {
        if (this.state.friendable && !this.state.info) {
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

    getMessageIcon() {
        if (this.state.messageable && !this.state.info) {
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

    getInviteIcon() {
        if (this.state.inviteable && !this.state.info) {
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

    getButtonGroup() {
        if ( (this.state.friendable || this.state.inviteable || this.state.messageable) && !this.state.info) {
            return (
                <ButtonGroup>
                    { this.getInviteIcon() }
                    { this.getMessageIcon() }
                    { this.getAddFriendIcon() }
                </ButtonGroup>
            );
        }
    }

    render() {
        let mainComponent = (
            <Card elevation={3}
                sx={{
                    width: 400,
                    height: "auto",
                    m: 0
                }}
            >
                <CardContent
                    sx={{
                        pb: "16px"
                    }}
                >
                    <Stack
                        direction="row"
                        divider={<Divider orientation="vertical" flexItem />}
                        spacing={0}
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Badge
                            color={this.state.is_active ? "success" : "error"}
                            badgeContent=" "
                            overlap="circular"
                            variant="dot"
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                        >
                            <Avatar
                                sx = {{
                                    bgcolor: this.state.avatarColor,
                                    width: 50,
                                    height: 50,
                                }}
                            />
                        </Badge>
                        <Stack direction="column"
                            alignItems="flex-start"
                        >
                            <Typography variant="caption" noWrap={false}>
                                Username
                            </Typography>
                            <Typography variant="subtitle" noWrap={false}>
                                {this.state.username}
                            </Typography>
                        </Stack>
                        <Stack direction="column"
                            alignItems="center"
                        >
                            <Typography variant="caption" noWrap={false}>
                                <EmojiEventsIcon />
                            </Typography>
                            <Typography variant="h6" noWrap={false}>
                                {this.state.wins}
                            </Typography>
                        </Stack>
                        { this.getButtonGroup() }
                    </Stack>
                </CardContent>
                <CardActionArea>
                    {/*
                        Empty CardActionArea is necessary to center cardcontent
                        Card gives last item in card an extra padding idk why
                        ^ just default mui formatting
                    */}
                </CardActionArea>
            </Card>
        );
        let largeCardDialog = (
            <Dialog open={this.state.infoDialogOpen} onClose={this.handleInfoDialogClose}>
                <LargeUserCard
                    username={this.state.username}
                    friendable={this.state.friendable}
                    inviteable={this.state.inviteable}
                    messageable={this.state.friendable}
                />
            </Dialog>
        );

        return (
            <div className="UserCard">
                {/*
                    This ternary operator conditionally renders the main button
                    that the entire card component is in if info is true to enable
                    the user to open the info dialog with the button. Otherwise
                    it only renders the component in a box.
                */}
                { this.state.info ?
                    ( this.state.isButton ?
                        (
                            <>
                            
                                <IconButton onClick={this.handleInfoClick}>
                                    {/* <PersonIcon /> */}
                                    <Avatar
                                        sx = {{
                                            bgcolor: this.state.avatarColor,
                                        }}
                                    />
                                </IconButton>
                                { largeCardDialog }
                            </>
                        )
                        :
                        (
                            <Box
                                sx={{
                                    p: 0,
                                    m: 1,
                                    textTransform: "none",
                                }}
                            >
                                <CardActionArea
                                    onClick={this.handleInfoClick}
                                    sx={{
                                        p: 0,
                                        m: 0,
                                        width: "auto",
                                        textTransform: "none",
                                    }}
                                >
                                    { mainComponent }
                                </CardActionArea>
                                { largeCardDialog }
                            </Box>
                        )
                    )
                :
                    (
                        <Box
                            sx={{
                                p: 0,
                                m: 1,
                                textTransform: "none",
                            }}
                        >
                            { mainComponent }
                        </Box>
                    )
                }
            </div>
        )
    }
}

export default SmallUserCard;