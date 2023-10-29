import React from "react";
import { Avatar, Box, Card, CardActionArea, CardContent, Divider, Grid, List, ListItem, Typography } from "@mui/material";
import { red, orange, yellow, green, blue, purple } from '@mui/material/colors';
import { Button } from "@mui/base";
import ColorPicker from "./AvatarColorPicker";
import TableThemePicker from "./TableThemePicker";

var globalTableTheme = "blue"

class TableCard extends React.Component {

    constructor(props) {
        super(props)
        this.toggleTableThemePicker = this.toggleTableThemePicker.bind(this);
        this.changeTheme = this.changeTheme.bind(this);
        this.state = {
            themePickerOpen: false,
            tableTheme: globalTableTheme,
            tableImage: "/images/Table Blue.png",
        }
    }

    toggleTableThemePicker() {
        this.setState({ themePickerOpen: !this.state.themePickerOpen });
    }

    changeTheme(theme) {
        var themeImage = "";
        globalTableTheme = theme;
        console.log(globalTableTheme);
        if (theme === "blue") {
            themeImage = "/images/Table Blue.png";
        } else if (theme === "green") {
            themeImage = "/images/Table Green.png";
        }
        this.setState({ tableTheme: theme, tableImage: themeImage });
    }

    render() {
        return (
            <div className="TableCard">
                <div className="TableThemePicker">
                    <TableThemePicker
                        themePickerOpen={this.state.themePickerOpen}
                        toggleThemePicker={() => this.toggleTableThemePicker()}
                        changeTheme={(theme) => this.changeTheme(theme)}
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
                            xs={12}
                        // Top item is avatar
                        >
                            <Box
                                component="img"
                                src={this.state.tableImage}
                                sx={{
                                    width: "100%",
                                    height: "auto",
                                }}
                            />
                        </Grid>
                        <Grid item
                        // Bottom item is new grid with info
                            container
                            justifyContent="flex-start"
                            alignItems="flex-start"
                            xs={12}
                            sx={{
                                height: "inherit"
                            }}
                        >
                            <List
                                sx={{
                                    // boxShadow: 4,
                                    width: '100%',
                                    bgcolor: 'background.paper'
                                }}
                                aria-label="mailbox folders"
                            >
                                <ListItem divider alignItems="center">
                                    <Grid container spacing={0}>
                                        <Grid item xs={12}>
                                            <Typography variant="caption" noWrap={false} textAlign="left">
                                                Current Theme
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="h6" noWrap={false} textAlign="left">
                                                Blue
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </ListItem>
                                <CardActionArea>
                                    <ListItem button onClick={this.toggleTableThemePicker}>
                                        <Typography color="textSecondary" noWrap={false} textAlign="left">
                                            Change Table Theme
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

export default TableCard;