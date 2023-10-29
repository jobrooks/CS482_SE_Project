import React from "react";
import { Avatar, Box, Card, CardActionArea, CardContent, Divider, Grid, List, ListItem, Typography } from "@mui/material";
import { red, orange, yellow, green, blue, purple } from '@mui/material/colors';
import { Button } from "@mui/base";
import ColorPicker from "./ColorPicker"

var globalAvatarColor = red[500]

class UserCard extends React.Component {

    constructor(props) {
        super(props)
        this.toggleColorPicker = this.toggleColorPicker.bind(this);
        this.changeColor = this.changeColor.bind(this);
        this.state = {
            colorPickerOpen: false,
            avatarColor: globalAvatarColor,
        }
    }

    toggleColorPicker() {
        this.setState({ colorPickerOpen: !this.state.colorPickerOpen });
    }

    changeColor(color) {
        this.setState({ avatarColor: color});
        globalAvatarColor = color;
        console.log(globalAvatarColor);
    }

    render() {
        return (
            <div className="UserCard">
                <div className="ColorPicker">
                    <ColorPicker
                        colorPickerOpen={this.state.colorPickerOpen}
                        toggleColorPickerFunction={() => this.toggleColorPicker()}
                        changeColorFunction={(color) => this.changeColor(color)}
                    />
                </div>
                <Card elevation={2}
                    sx={{
                        width: 430,
                        height: 220,
                        m: 12
                    }}

                >
                <CardContent>
                    <Grid
                    // Outer grid divides card
                        container
                        display="flex"
                        justifyContent="space-around"
                        alignItems="center"
                        sx={{
                            height: "inherit"
                        }}
                    >
                        <Grid item
                        // Left item is avatar
                        >
                            <Avatar
                                sx={{
                                    bgcolor: globalAvatarColor,
                                    width: 150,
                                    height: 150,
                                }}
                                aria-label="recipe"
                            />
                        </Grid>
                        <Grid item
                        // Right item is new grid with info
                            container
                            justifyContent="flex-start"
                            alignItems="flex-start"
                            xs={7}
                            sx={{
                                height: "inherit"
                            }}
                        >
                            <List
                                sx={{
                                    width: '100%',
                                    maxWidth: 360, 
                                    bgcolor: 'background.paper'
                                }}
                                aria-label="mailbox folders"
                            >
                                <ListItem divider alignItems="center">
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                        <Typography color="textSecondary" noWrap={false} textAlign="left">
                                            Username
                                        </Typography>
                                        <Typography color="textPrimary" noWrap={false} textAlign="left">
                                            Guest Account
                                        </Typography>
                                    </Box>
                                </ListItem>
                                <ListItem divider alignItems="center">
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                        <Typography color="textSecondary" noWrap={false} textAlign="left">
                                            Balance
                                        </Typography>
                                        <Typography color="textPrimary" noWrap={false} textAlign="left">
                                            $500
                                        </Typography>
                                    </Box>
                                </ListItem>
                                <ListItem divider alignItems="center">
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                        <Typography color="textSecondary" noWrap={false} textAlign="left">
                                            Wins
                                        </Typography>
                                        <Typography color="textPrimary" noWrap={false} textAlign="left">
                                            56
                                        </Typography>
                                    </Box>
                                </ListItem>
                                <CardActionArea>
                                    <ListItem button onClick={this.toggleColorPicker}>
                                        <Typography color="textSecondary" noWrap={false} textAlign="left">
                                            Customize Avatar
                                        </Typography>
                                    </ListItem>
                                </CardActionArea>
                            </List>
                        </Grid>
                    </Grid>
                </CardContent>
                </Card>
            </div>
        )
    }

}

export default UserCard;