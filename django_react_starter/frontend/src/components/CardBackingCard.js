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
import CardBackingPicker from "./CardBackingPicker";
import axios from "axios";

class CardBackingCard extends React.Component {
  constructor(props) {
    super(props);
    this.toggleBackingPicker = this.toggleBackingPicker.bind(this);
    this.changeBacking = this.changeBacking.bind(this);
    this.state = {
      token: this.props.token,
      guestUsername: this.props.guestUsername,
      backingPickerOpen: false,
      cardBacking: "red",
      cardBackingImage: this.mapBackingToImage(this.cardBacking),
    };
  }

  /*
        Sets card backing to the backing recieved from the backend
    */
  setCardBacking() {
    let backing = "red";
    let backingImage = this.mapBackingToImage(backing);

    if (this.state.token) {
      axios
        .get(
          `http://localhost:8000/user_profile/profile/cardbacking/${this.state.token}/`
        )
        .then((response) => {
          backing = response.data;
          backingImage = this.mapBackingToImage(backing);
          console.log("real backing is: " + backing);
          this.setState({
            cardBacking: backing,
            cardBackingImage: backingImage,
          });
          return backing;
        })
        .catch((response) => {
          console.log("Error getting card backing");
          console.log(response);
        });
    } else if (this.state.guestUsername) {
      axios
        .get(
          `http://localhost:8000/user_profile/profile/guestcardbacking/${this.state.guestUsername}/`
        )
        .then((response) => {
          backing = response.data;
          backingImage = this.mapBackingToImage(backing);
          console.log("real backing is: " + backing);
          this.setState({
            cardBacking: backing,
            cardBackingImage: backingImage,
          });
          return backing;
        })
        .catch((response) => {
          console.log("Error getting card backing");
          console.log(response);
        });
    } else {
      console.log("No token or username specified");
      return null;
    }
  }

  patchCardBacking(backing) {
    const data = {
      card_backing: backing,
    };
    
    if (this.state.token) {
        axios
      .patch(
        `http://localhost:8000/user_profile/profile/cardbacking/${this.state.token}/`,
        data
      )
      .then((response) => {
        return response.data;
      })
      .catch((response) => {
        console.log("Error patching card backing");
        console.log(response);
      });
    } else if (this.state.guestUsername) {
        axios
      .patch(
        `http://localhost:8000/user_profile/profile/guestcardbacking/${this.state.guestUsername}/`,
        data
      )
      .then((response) => {
        return response.data;
      })
      .catch((response) => {
        console.log("Error patching card backing");
        console.log(response);
      });
    } else {
      console.log("No token or username specified");
      return null;
    }
  }

  mapBackingToImage(backing) {
    const backingDict = {
      red: "/images/Card_Backings/Back Red Plaid.svg",
      blue: "/images/Card_Backings/Back Blue Plaid.svg",
      green: "/images/Card_Backings/Back Green Plaid.svg",
    };
    let backingImage = backingDict[backing];
    if (backingImage !== undefined) {
      return backingImage;
    } else {
      return backingDict["red"];
    }
  }

  componentDidMount() {
    this.setCardBacking();
  }

  toggleBackingPicker() {
    this.setState({ backingPickerOpen: !this.state.backingPickerOpen });
  }

  changeBacking(backing) {
    let backingImage = this.mapBackingToImage(backing);
    this.setState({ cardBacking: backing, cardBackingImage: backingImage });
    this.patchCardBacking(backing);
  }

  render() {
    return (
      <div className="CardBackingCard">
        <div className="CardBackingPicker">
          <CardBackingPicker
            backingPickerOpen={this.state.backingPickerOpen}
            toggleBackingPicker={() => this.toggleBackingPicker()}
            changeBacking={(backing) => this.changeBacking(backing)}
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
                xs={4}
                // Top item is avatar
              >
                <Box
                  component="img"
                  src={this.state.cardBackingImage}
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
                xs={8}
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
                          Current Card Backing
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography
                          variant="h6"
                          noWrap={false}
                          textAlign="left"
                        >
                          {this.state.cardBacking}
                        </Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                  <CardActionArea>
                    <ListItem button onClick={this.toggleBackingPicker}>
                      <Typography
                        color="textSecondary"
                        noWrap={false}
                        textAlign="left"
                      >
                        Change Card Backing
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

export default CardBackingCard;
