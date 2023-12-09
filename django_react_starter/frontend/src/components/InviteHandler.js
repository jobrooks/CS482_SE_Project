import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Alert, Button, Icon, IconButton, Snackbar, Stack, Typography } from "@mui/material";
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';
import CloseIcon from '@mui/icons-material/Close';

/**
 * This component listens for incoming invites from the websocket connection specified by:
 * `ws://localhost:8000/ws/invites/${this.state.myUsername}`
 */
class InviteHandler extends React.Component {

    constructor(props) {
        super(props);
        this.getSessionToken = this.getSessionToken.bind(this);
        this.getMyUserData = this.getMyUserData.bind(this);
        this.getWebsocketConnection = this.getWebsocketConnection.bind(this);
        this.getInviteAlerts = this.getInviteAlerts.bind(this);
        this.closeInvite = this.closeInvite.bind(this);
        this.acceptInvite = this.acceptInvite.bind(this);
        this.state = {
            // User Data
            myUsername: null,
            myUserData: null,
            // Socket
            inviteSocket: null,
            invites: [],
            // Display
            snackbarOpen: false,
        }
    }

    componentDidMount() {
        this.getSessionToken()
        .then(this.getMyUserData)
        .then(this.getWebsocketConnection)
    }

    getSessionToken() {
        return new Promise((resolve, reject) => {
          let token = JSON.parse(localStorage.getItem("sessionToken"));
          this.setState({ sessionToken: token }, () => {
            resolve("Set session token in state");
          })
        })
    }

    getMyUserData() {
        return new Promise((resolve, reject) => {
          // Get my user data
          axios.get(`http://localhost:8000/user_profile/profile/${this.state.sessionToken}`)
          .then((response) => {
                return new Promise((resolve, reject) => {
                    this.setState({ myUserData: response.data }, () => {
                        this.setState({ myUsername: response.data.username }, () => {
                            resolve("Finished setting data states");
                        });
                    });
                });
          })
          .catch((response) => {
              console.log("Error getting my user data");
          })
          .finally(() => {
              resolve("Finished getting user data");
          });
        });
    }

    getWebsocketConnection() {
        return new Promise((resolve, reject) => {
            let ws = null;
            new Promise((resolve, reject) => {
                ws = new WebSocket(`ws://localhost:8000/ws/invites/${this.state.myUsername}`);
                ws.onopen = (event) => { // Initialize chat to global when opened
                    resolve("Finished connecting to invite websocket");
                }
            })
            .then(() => {
                this.setState({ inviteSocket: ws }, () => {
                    this.state.inviteSocket.addEventListener("message", this.onIncomingInvite.bind(this));
                    resolve("Finished getting invite websocket connection");
                });
            });
        });
    }

    onIncomingInvite(event) {
        let serialized_data = JSON.parse(event.data);
        console.log("Invite ", serialized_data);
        this.setState((prevState) => ({
            invites: [ ...prevState.invites, serialized_data ],
            snackbarOpen: true,
        }));
    }

    closeInvite(game_id) {
        this.setState((prevState) => ({
            invites: prevState.invites.filter((invite) => invite.game_id !== game_id),
        }));
        if (this.state.invites.length == 0) {
            this.setState({ snackbarOpen: false });
        }
    }

    acceptInvite(game_id) {
        this.props.navigate("/game")
        this.closeInvite(game_id);
    }

    getInviteAlerts() {
        let listBuffer = [];
        for (let i in this.state.invites) {
            let invite = this.state.invites[i];
            listBuffer.push(
                // <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                <Alert severity="success" sx={{ width: 'auto' }}>
                    <Stack direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{
                            width: "auto",
                            maxHeight: "100%",
                            overflow: "auto",
                        }}
                    >
                        <Typography variant="subtitle1">This is a invite message!</Typography>
                        <IconButton onClick={() => {this.acceptInvite(invite.game_id)}}>
                            <VideogameAssetIcon />
                        </IconButton>
                        <IconButton onClick={() => {this.closeInvite(invite.game_id)}}>
                            <CloseIcon />
                        </IconButton>
                    </Stack>
                </Alert>
            );
        }
        return ( //onClose={handleClose}
            <div id="friendTable">
                <Snackbar open={this.state.snackbarOpen} autoHideDuration={6000}  >
                    <Stack direction="column"
                        alignItems="center"
                        ref={ this.bottomRef }
                        sx={{
                            width: "auto",
                            maxHeight: "100%",
                            overflow: "auto",
                        }}
                    >
                        { listBuffer }
                    </Stack>
                </Snackbar>
            </div>
        );
    }

    render() {
        return (
            <div id="inviteHandler">
                { this.getInviteAlerts() }
            </div>
        );
    }

}

function WithNavigate(props) {
    const navigate = useNavigate();
    return <InviteHandler {...props} navigate={navigate} />
}

export default WithNavigate;
