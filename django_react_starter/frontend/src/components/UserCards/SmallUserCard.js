import { Avatar, Card, CardContent, Stack, Item, Typography, Divider, CardActionArea, Button, Badge } from "@mui/material";
import React from "react";

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
        this.state = {
            avatarColor: this.props.avatarColor,
            username: this.props.username,
            wins: this.props.wins,
            
            info: this.props.info,
        }
    }

    render() {
        return (
            <div className="UserCard">
                <Button
                    disabled={!this.state.info}
                    sx={{
                        p: 0,
                        m: 2,
                        textTransform: "none",
                    }}
                >
                <Card elevation={3}
                    sx={{
                        width: 350,
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
                            justifyContent="space-around"
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
                                <Typography variant="h6" noWrap={false}>
                                    {this.state.username}
                                </Typography>
                            </Stack>
                            <Stack direction="column"
                                alignItems="flex-start"
                            >
                                <Typography variant="caption" noWrap={false}>
                                    Wins
                                </Typography>
                                <Typography variant="h6" noWrap={false}>
                                    {this.state.wins}
                                </Typography>
                            </Stack>
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
                </Button>
            </div>
        )
    }
}

export default SmallUserCard;