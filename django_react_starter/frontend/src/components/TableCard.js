import React from "react";
import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  CardContent,
  Divider,
  Grid,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import { red, orange, yellow, green, blue, purple } from "@mui/material/colors";
import { Button } from "@mui/base";
import TableThemePicker from "./TableThemePicker";
import axios from "axios";

class TableCard extends React.Component {
  constructor(props) {
    super(props);
    this.toggleTableThemePicker = this.toggleTableThemePicker.bind(this);
    this.changeTheme = this.changeTheme.bind(this);
    this.state = {
      token: this.props.token,
      guestUsername: this.props.guestUsername,
      themePickerOpen: false,
      tableTheme: "blue",
      tableImage: this.mapThemeToImage(this.tableTheme),
    };
  }

  /*
        Sets table theme to the theme recieved from the backend
    */
  setTableTheme() {
    let theme = "blue";
    let themeImage = this.mapThemeToImage(theme);

    if (this.state.token) {
      axios
        .get(
          `http://localhost:8000/user_profile/profile/tabletheme/${this.state.token}/`
        )
        .then((response) => {
          theme = response.data;
          themeImage = this.mapThemeToImage(theme);
          console.log("real theme is: " + theme);
          this.setState({ tableTheme: theme, tableImage: themeImage });
          return theme;
        })
        .catch((response) => {
          console.log("Error getting table theme");
          console.log(response);
        });
    } else if (this.state.guestUsername) {
      axios
        .get(
          `http://localhost:8000/user_profile/profile/guesttabletheme/${this.state.guestUsername}/`
        )
        .then((response) => {
          theme = response.data;
          themeImage = this.mapThemeToImage(theme);
          console.log("real theme is: " + theme);
          this.setState({ tableTheme: theme, tableImage: themeImage });
          return theme;
        })
        .catch((response) => {
          console.log("Error getting table theme");
          console.log(response);
        });
    } else {
      console.log("No token or username specified");
      return null;
    }
  }

  patchTableTheme(theme) {
    const data = {
      table_theme: theme,
    };

    if (this.state.token) {
      axios
        .patch(
          `http://localhost:8000/user_profile/profile/tabletheme/${this.state.token}/`,
          data
        )
        .then((response) => {
          return response.data;
        })
        .catch((response) => {
          console.log("Error patching table theme");
          console.log(response);
        });
    } else if (this.state.guestUsername) {
      axios
        .patch(
          `http://localhost:8000/user_profile/profile/guesttabletheme/${this.state.guestUsername}/`,
          data
        )
        .then((response) => {
          return response.data;
        })
        .catch((response) => {
          console.log("Error patching table theme");
          console.log(response);
        });
    } else {
      console.log("No token or username specified");
      return null;
    }
  }

  mapThemeToImage(theme) {
    const themeDict = {
      blue: "/images/Table_Themes/table_blue.png",
      green: "/images/Table_Themes/table_green.png",
    };
    let themeImage = themeDict[theme];
    if (themeImage !== undefined) {
      return themeImage;
    } else {
      return themeDict["blue"];
    }
  }

  componentDidMount() {
    this.setTableTheme();
  }

  toggleTableThemePicker() {
    this.setState({ themePickerOpen: !this.state.themePickerOpen });
  }

  changeTheme(theme) {
    let themeImage = this.mapThemeToImage(theme);
    this.setState({ tableTheme: theme, tableImage: themeImage });
    this.patchTableTheme(theme);
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
        <Card
          elevation={3}
          sx={{
            width: 430,
            height: "auto",
            m: 2,
            p: 1,
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
                height: "inherit",
              }}
            >
              <Grid
                item
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
              <Grid
                item
                // Bottom item is new grid with info
                container
                justifyContent="flex-start"
                alignItems="flex-start"
                xs={12}
                sx={{
                  height: "inherit",
                }}
              >
                <List
                  sx={{
                    // boxShadow: 4,
                    width: "100%",
                    bgcolor: "background.paper",
                  }}
                  aria-label="mailbox folders"
                >
                  <ListItem divider alignItems="center">
                    <Grid container spacing={0}>
                      <Grid item xs={12}>
                        <Typography
                          variant="caption"
                          noWrap={false}
                          textAlign="left"
                        >
                          Current Theme
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography
                          variant="h6"
                          noWrap={false}
                          textAlign="left"
                        >
                          {this.state.tableTheme}
                        </Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                  <CardActionArea>
                    <ListItem button onClick={this.toggleTableThemePicker}>
                      <Typography
                        color="textSecondary"
                        noWrap={false}
                        textAlign="left"
                      >
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
    );
  }
}

export default TableCard;
