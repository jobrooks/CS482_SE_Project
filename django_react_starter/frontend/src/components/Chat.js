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
const roomName = "global";

class Chat extends React.Component {

    constructor(props) {
        super(props);
        this.handleMessageChange = this.handleMessageChange.bind(this);
        this.handleSend = this.handleSend.bind(this);
        this.handleEnterPressed = this.handleEnterPressed.bind(this);
        this.getChatHistory = this.getChatHistory.bind(this);
        this.getFriendChatList = this.getFriendChatList.bind(this);
        this.getFriends = this.getFriends.bind(this);
        this.getWebsocketConnection = this.getWebsocketConnection.bind(this);
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
            chattable: false, // Could use this to determine if user should be able to chat
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
        // Synchronously runs getting data stuff
        this.getUserDatas()
        .then(this.getFriends)
        .then(this.getWebsocketConnection)
        .then(this.getChatHistory);
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

    getWebsocketConnection() {
        return new Promise((resolve, reject) => {
            this.setState({ chatSocket: new WebSocket(`ws://localhost:8000/ws/chat/${roomName}/`) }, () => {
                this.state.chatSocket.addEventListener("message", this.onIncomingMessage.bind(this));
                resolve("Finished getting websocket connection");
            });
        });
    }

    getUserDatas() {
        return new Promise((resolve, reject) => {
            Promise.all([ // Array of two promises that resolves the outer promise when they're finished
                // Get my user data
                axios.get(`http://localhost:8000/user_profile/profile/${JSON.parse(localStorage.getItem("sessionToken"))}`)
                .then((response) => {
                    this.setState({ myUserdata: response.data });
                    this.setState({ myUsername: response.data.username });
                })
                .catch((response) => {
                    console.log("Error getting my user data");
                }),
                // Get pals user data
                axios.get(`http://localhost:8000/user_profile/profile/getuserprofile/${this.state.palUsername}`)
                .then((response) => {
                    this.setState({ palUserData: response.data });
                })
                .catch((response) => {
                    console.log("Error getting pal user data");
                }),
            ]).finally(() => {
                resolve("Finished getting user data");
            })
        });
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

    getChatHistory() {
        return new Promise((resolve, reject) => {
            axios.get(`http://localhost:8000/chat/get_chat_history/${roomName}`)
            .then((response) => {
                this.setState({ chatData: response.data.messages });
            })
            .catch((response) => {
                console.log("Error getting my user data");
            })
            .finally(() => {
                resolve("Finished getting chat history");
            });
        });
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
        return new Promise((resolve, reject) => {
            if (this.state.mode === "friend") {
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
                })
                .finally(() => {
                    resolve("Finished getting friends");
                });
            } else {
                resolve("Finished getting friends: not in friend mode");
            }
        });
    }

    getFriendChatList() {
        let listBuffer = [];
        for (let i in this.state.friends) {
            let friend = this.state.friends[i];
            listBuffer.push(
                <SmallUserCard
                    username={friend.username}
                    wins={friend.wins}
                    is_active={friend.is_active}
                    avatarColor={friend.avatar_color}
                    info={false}
                    friendable={false}
                    inviteable={false}
                    messageable={true}
                    handleMessage={(friendUsername) => this.handleOpenFriendChat(friendUsername)}
                />
            );
        }
        return (
            <div id="friendTable">
                <Stack direction="column"
                    alignItems="center"
                    sx={{
                        width: "auto",
                        maxHeight: "100%",
                        overflow: "auto",
                    }}
                >
                    { listBuffer }
                </Stack>
            </div>
        );
    }

    handleOpenFriendChat(username) {
        
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
                { this.getFriendChatList() }
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
