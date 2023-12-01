import React from "react";
import axios from "axios";
import { ChatBox, ReceiverMessage, SenderMessage } from "mui-chat-box";
import { Avatar, Grid, Icon, IconButton, Paper, Stack, TextField, Typography } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import SmallUserCard from "./UserCards/SmallUserCard";

/**
 * Chat box will allow users to chat with eachother.
 * "pal" is the prefix for the other person a user is chatting with.
 * I derrived the name from "penpal."
 */
const roomName = "chat1";

class Chat extends React.Component {

    constructor(props) {
        super(props);
        this.handleMessageChange = this.handleMessageChange.bind(this);
        this.handleSend = this.handleSend.bind(this);
        this.handleEnterPressed = this.handleEnterPressed.bind(this);
        this.getChatData = this.getChatData.bind(this);
        this.bottomRef = null;
        // this.onIncomingMessage = this.onIncomingMessage.bind(this);
        this.state = {
            // Websocket
            chatSocket: new WebSocket(`ws://localhost:8000/ws/chat/${roomName}/`),

            // User Data
            myUsername: null,
            myUserdata: null,
            palUsername: this.props.palUsername,
            palUserData: null,

            // Internal State
            mode: this.props.mode, // [ friend, global, game ]
            gameId: this.props.gameId, // pass this as well if mode is game
            chattable: false,
            isLoading: true,
            textFieldData: "",
            chatData: [],
            friends: [],
        }
    }    

    componentDidMount() {
        this.setState((prevState) => ({
            chattable: prevState.mode !== "friend"
        }));
        this.bottomRef = React.createRef();
        this.getUserDatas();
        if (this.state.mode === "friend") {
            this.getFriends();
        }
        this.setState({ chatSocket: new WebSocket(`ws://localhost:8000/ws/chat/${roomName}/`) }, () => {
            this.state.chatSocket.addEventListener("message", this.onIncomingMessage.bind(this));
        });
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }
    
    onIncomingMessage(event) {
        let serialized_data = JSON.parse(event.data);
        console.log("Message from pal ", serialized_data);
        this.setState((prevState) => ({
            chatData: [ ...prevState.chatData, serialized_data ]
        }));
        this.scrollToBottom();
    }

    getUserDatas() {
        // Get my user data
        axios.get(`http://localhost:8000/user_profile/profile/${JSON.parse(localStorage.getItem("sessionToken"))}`)
        .then((response) => {
            this.setState({ myUserdata: response.data, isLoading: false });
            this.setState({ myUsername: response.data.username });
        })
        .catch((response) => {
            console.log("Error getting my user data");
        })
        // Get pals user data
        axios.get(`http://localhost:8000/user_profile/profile/getuserprofile/${this.state.palUsername}`)
        .then((response) => {
            this.setState({ palUserData: response.data, isLoading: false });
        })
        .catch((response) => {
            console.log("Error getting pal user data");
        })
    }

    handleMessageChange(event) {
        let message = event.target.value;
        this.setState({ textFieldData: message });
    }

    handleSend() {
        if (this.state.textFieldData !== "") {
            this.state.chatSocket.send(JSON.stringify( {sender: this.state.myUsername, avatar_color: this.state.myUserdata.avatar_color, message: this.state.textFieldData} ));
            this.setState({ textFieldData: "" });
        }
    }

    handleEnterPressed(event) {
        if(event.keyCode == 13){
            this.handleSend();
        }
    }

    getChatData() {
        // Handle request to backend
    }

    scrollToBottom() {
        if (this.state.chattable) {
            this.bottomRef.current.scroll({
                top: this.bottomRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    };

    makeMessagesFromChatData() {
        let listBuffer = [];
        for (let i in this.state.chatData) {
            let sender = this.state.chatData[i].sender;
            let message = this.state.chatData[i].message;
            let avatar_color = this.state.chatData[i].avatar_color;
            if (sender === this.state.myUsername) { // Sender is me
                listBuffer.push(
                    <SenderMessage avatar={<SmallUserCard username={sender} avatarColor={avatar_color} info={true} isButton={true} />}>
                        { message }
                    </SenderMessage>
                );
            } else {
                listBuffer.push(
                    <ReceiverMessage avatar={<SmallUserCard username={sender} avatarColor={avatar_color} info={true} isButton={true} />}>
                        { message }
                    </ReceiverMessage>
                );
            }
            // listBuffer.push(<div className="stack-bottom" ref={ this.bottomRef } />)
        }
        return (
            <>
                { listBuffer }
            </>
        );
    }

    getFriends() {
        let token = JSON.parse(localStorage.getItem("sessionToken"));

        let config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        axios.get("http://localhost:8000/friend/get_friends/", config)
        .then((response) => {
            console.log(response.data.friends);
            this.setState({ friends: response.data.friends });
        })
        .catch((response) => {
            console.log("Error getting friends");
            console.error(response);
        });
    }

    render() {
        let chatBoxInterface = (
            <Paper elevation={3}
                    sx={{
                        p: 1,
                        m: 2,
                        width: 430,
                        height: "auto",
                    }}
                >
                    <Stack direction="column" ref={ this.bottomRef } spacing={2} sx={{maxHeight: 400, overflow: "auto", width: "auto"}}>
                        { this.makeMessagesFromChatData() }
                    </Stack>
                    { this.state.chattable ?
                        <Stack direction="row" justifyContent="space-around">
                            <TextField
                                id="chat-entry"
                                label="Send a Message"
                                variant="outlined"
                                onChange={ this.handleMessageChange }
                                onKeyDown={ this.handleEnterPressed }
                                value={ this.state.textFieldData }
                                sx={{
                                    m: 2,
                                    width: "80%",
                                    height: "auto",
                                }}
                            />
                            <IconButton
                                onClick={ this.handleSend }
                            >
                                <SendIcon />
                            </IconButton>
                        </Stack>
                        :
                        <></>
                    }
                </Paper>
        );
        let friendInterface = (
            <div id="friendInterface">
                <Typography>This doesn't work yet since get_friends doesn't work</Typography>
            </div>
        );
        return (
            <div id="chat">
                { this.state.mode === "friend" ?
                    friendInterface
                :
                    chatBoxInterface
                }
            </div>
        );
    }

}

export default Chat;
