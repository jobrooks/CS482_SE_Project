import { Avatar, Card, CardContent, Stack, Item, Typography, Divider, CardActionArea, Button, Badge, IconButton, Box, Dialog } from "@mui/material";
import React from "react";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LargeUserCard from "./LargeUserCard";

/** SmallUserCard
 * - This is a user card object that displays user information in a small size
 * - It also allows users to click on the card to reveal extra information
 * Props:
 * - avatarColor: the avatar color for the card
 * - username: the username for the card
 * - wins: the number of wins for the card
 * - info: whether or not the box should be clickable in order to reveal more info
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
            // Governs how component is displayed
            info: this.props.info,
            friendable: this.props.friendable,
        }
    }

    handleInfoClick() {
        this.setState({ infoDialogOpen: true });
    }

    handleAddFriend() {
        console.log("Add Friend");
    }

    handleInfoDialogClose() {
        this.setState({ infoDialogOpen: false });
    }

    getAddFriendIcon() {
        if (this.state.friendable) {
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
                        { this.getAddFriendIcon() }
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

        return (
            <div className="UserCard">
                {/*
                    This ternary operator conditionally renders the main button
                    that the entire card component is in if info is true to enable
                    the user to open the info dialog with the button. Otherwise
                    it only renders the component in a box.
                */}
                { this.state.info ?
                    <Box
                        sx={{
                            p: 0,
                            m: 2,
                            textTransform: "none",
                        }}
                    >
                        <Button
                            onClick={this.handleInfoClick}
                            sx={{
                                p: 0,
                                m: 0,
                                textTransform: "none",
                            }}
                        >
                            { mainComponent }
                        </Button>
                        <Dialog open={this.state.infoDialogOpen} onClose={this.handleInfoDialogClose}>
                            <LargeUserCard
                                username={this.state.username}
                            />
                        </Dialog>
                    </Box>
                :
                    <Box
                        sx={{
                            p: 0,
                            m: 2,
                            textTransform: "none",
                        }}
                    >
                        { mainComponent }
                    </Box>
                }
            </div>
        )
    }
}

export default SmallUserCard;