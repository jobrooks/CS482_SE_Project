import React from "react";
import axios from "axios";
import { ChatBox, ReceiverMessage, SenderMessage } from "mui-chat-box";
import { Avatar, Icon, IconButton, Paper, Stack, TextField } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';

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
        // this.onIncomingMessage = this.onIncomingMessage.bind(this);
        this.state = {
            // Websocket
            chatSocket: new WebSocket(`ws://localhost:8000/ws/chat/${roomName}/`),

            // User Data
            myUsername: null,
            myUserdata: null,
            palUsername: "smelly",//this.props.palUsername,
            palUserData: null,

            // Internal State
            isLoading: true,
            textFieldData: "",
            chatData: [{sender: "smelly", message: "I am so so cool"}, {sender: "notadmin", message: "Wow good for you"}, {sender: "smelly", message: "I know, and you suck too"}],
        }
    }

    

    componentDidMount() {
        this.getUserDatas();
        this.setState({ chatSocket: new WebSocket(`ws://localhost:8000/ws/chat/${roomName}/`) }, () => {
            this.state.chatSocket.addEventListener("message", this.onIncomingMessage.bind(this));
        });
    }
    
    onIncomingMessage(event) {
        let serialized_data = JSON.parse(event.data);
        console.log("Message from pal ", serialized_data);
        this.setState((prevState) => ({
            chatData: [ ...prevState.chatData, serialized_data ]
        }));
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
        this.state.chatSocket.send(JSON.stringify( {sender: this.state.myUsername, message: this.state.textFieldData} ));
        this.setState({ textFieldData: "" });
    }

    handleEnterPressed(event) {
        if(event.keyCode == 13){
            this.handleSend();
        }
    }

    getChatData() {
        // Handle request to backend
    }

    makeMessagesFromChatData() {
        let listBuffer = [];
        for (let i in this.state.chatData) {
            let sender = this.state.chatData[i].sender;
            let message = this.state.chatData[i].message;
            if (sender === this.state.palUsername) { // Sender is pal
                listBuffer.push(
                    <SenderMessage avatar={<Avatar />}>
                        { message }
                    </SenderMessage>
                );
            } else {
                listBuffer.push(
                    <ReceiverMessage avatar={<Avatar />}>
                        { message }
                    </ReceiverMessage>
                );
            }
        }
        return (
            <>
                { listBuffer }
            </>
        );
    }

    render() {
        return (
            <div id="chat">
                <Paper elevation={3}
                    sx={{
                        p: 1,
                        m: 2,
                        width: 430,
                        height: "auto",
                    }}
                >
                    <ChatBox>
                        { this.makeMessagesFromChatData() }
                    </ChatBox>
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
                </Paper>
            </div>
        );
    }

}

export default Chat;
