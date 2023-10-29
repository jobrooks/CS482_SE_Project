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
                <Card elevation={3}
                    sx={{
                        width: 430,
                        height: "auto",
                        m: 2
                    }}

                >
                <CardContent>
                    <Grid
                    // Outer grid divides card
                        container
                        display="flex"
                        justifyContent="space-around"
                        alignItems="center"
                        spacing={2}
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
                                    // boxShadow: 4,
                                    width: "100%",
                                    height: "auto",
                                    bgcolor: 'background.paper'
                                }}
                                aria-label="mailbox folders"
                            >
                                <ListItem divider alignItems="center">
                                    <Grid container spacing={0}>
                                        <Grid item xs={12}>
                                            <Typography variant="caption" noWrap={false} textAlign="left">
                                                Username
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="h6" noWrap={false} textAlign="left">
                                                Guest Account
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </ListItem>
                                <ListItem divider alignItems="center">
                                    <Grid container spacing={0}>
                                        <Grid item xs={12}>
                                            <Typography variant="caption" noWrap={false} textAlign="left">
                                                Balance
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="h6" noWrap={false} textAlign="left">
                                                $500
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </ListItem>
                                <ListItem divider alignItems="center">
                                    <Grid container spacing={0}>
                                        <Grid item xs={12}>
                                            <Typography variant="caption" noWrap={false} textAlign="left">
                                                Wins
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="h6" noWrap={false} textAlign="left">
                                                56
                                            </Typography>
                                        </Grid>
                                    </Grid>
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