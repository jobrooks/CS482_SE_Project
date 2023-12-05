import React from "react";
import axios from "axios";
import { ChatBox, ReceiverMessage, SenderMessage } from "mui-chat-box";
import { AppBar, Avatar, Button, ButtonGroup, CardHeader, Grid, Icon, IconButton, Paper, Stack, Tab, Tabs, TextField, Typography } from "@mui/material";
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import SendIcon from '@mui/icons-material/Send';
import SmallUserCard from "./UserCards/SmallUserCard";

/**
 * Chat box will allow users to chat with eachother.
 * Depricated: "pal" is the prefix for the other person a user is chatting with.
 * I derrived the name from "penpal."
 */
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
        this.handleTabChange = this.handleTabChange.bind(this);
        this.bottomRef = null;
        this.state = {
            // Websocket
            chatSocket: null,

            // User Data
            myUsername: null,
            myUserdata: null,
            // palUsername: this.props.palUsername,
            // palUserData: null,

            // Internal State
            chatType: this.props.chatType, // [ global, friend, game ]
            groupName: this.props.groupName, // pass this as well if chatType is game or global
            gameId: this.props.gameId,
            currentTab: 0, // tab: [ 0, 1, 2 ] -> chatType: [ "global", "game", "friend" ]
            chattable: false, // Could use this to determine if user should be able to chat
            isLoading: true,
            textFieldData: "",
            chatData: [],
            friends: [],
        }
    }    

    componentDidMount() {
        this.setState((prevState) => ({
            chattable: prevState.chatType !== "friend"
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

    componentWillUnmount() {
        this.closeWebsocketConnection();
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
            let ws = null;
            new Promise((resolve, reject) => {
                ws = new WebSocket(`ws://localhost:8000/ws/chat/${this.state.groupName}/${this.state.chatType}`);
                ws.onopen = (event) => { // Initialize chat to global when opened
                    resolve("Finished connecting to websocket");
                }
            })
            .then(() => {
                this.setState({ chatSocket: ws }, () => {
                    this.state.chatSocket.addEventListener("message", this.onIncomingMessage.bind(this));
                    resolve("Finished getting websocket connection");
                });
            });
        });
    }

    setChatGroup(groupName, chatType) { // Sends a message to server to change group to that specified
        return new Promise((resolve, reject) => {
            this.setState({ groupName: groupName, chatType: chatType, chatData: [] }, () => {
                this.bottomRef = React.createRef();
                this.closeWebsocketConnection()
                .then(this.getWebsocketConnection)
                .then(this.getChatHistory)
                .finally(resolve("Set new chat group"));
            });
        });
        // Depricated way to change chat: this.state.chatSocket.send(JSON.stringify( {sender: this.state.myUsername, type: "set_group", group_name: groupName, chat_type: chatType} ));
    }

    closeWebsocketConnection() {
        return new Promise((resolve, reject) => {
            this.state.chatSocket.close(1000, "User closed websocket");
            this.setState({ chatSocket: null }, () => {
                resolve("Finished closing websocket");
            });
        });
    }

    getUserDatas() { // Pal depricated
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
                // axios.get(`http://localhost:8000/user_profile/profile/getuserprofile/${this.state.palUsername}`)
                // .then((response) => {
                //     this.setState({ palUserData: response.data });
                // })
                // .catch((response) => {
                //     console.log("Error getting pal user data");
                // }),
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
            axios.get(`http://localhost:8000/chat/get_chat_history/${this.state.groupName}`)
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
                    // You have to put it in a chat box so it fills the whole space available
                    <Grid container direction="column" sx={{width: "95%"}}>
                        <SenderMessage avatar={<SmallUserCard username={sender} avatarColor={avatar_color} info={true} isButton={true} />}>
                            { message }
                        </SenderMessage>
                    </Grid>
                );
            } else {
                listBuffer.push(
                    <Grid container direction="column" sx={{width: "95%"}}>
                        <ReceiverMessage avatar={<SmallUserCard username={sender} avatarColor={avatar_color} info={true} isButton={true} />}>
                            { message }
                        </ReceiverMessage>
                    </Grid>
                );
            }
            // listBuffer.push(<div className="stack-bottom" ref={ this.bottomRef } />)
        }
        return (
            <Stack direction="column" ref={ this.bottomRef } spacing={0} sx={{ maxHeight: 400, overflow: "auto", width: "auto"}}>
                { listBuffer }
            </Stack>
        );
    }

    getFriends() {
        return new Promise((resolve, reject) => {
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
                    isThin={true}
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
                    ref={ this.bottomRef }
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
        this.setState({ currentTab: 2, chatType: "friend" });
        let usernameList = [username, this.state.myUsername];
        usernameList = usernameList.sort().join("_"); // Sort the two alphabetically and join them with an _ (Note: websocket url's cannot contain -) this way either friend can get the right group_name
        this.setChatGroup(usernameList, "friend")
        .then(() => {
            this.setState({ friendChatOpen: true })
        })
    }

    handleTabChange(event, newValue) {
        let valueToChatType = {0: "global", 1: "game", 2: "friend"}
        let newChatType = valueToChatType[newValue]
        console.log(newChatType)
        this.setState({ currentTab: newValue, friendChatOpen: false }, () => {
            if (newChatType === "global") {
                this.setChatGroup("global", newChatType)
            } else if (newChatType === "game") {
                this.setChatGroup(this.state.gameId, newChatType)
            } else if (newChatType === "friend") {
                // Do nothing until friend is selected
            }
        });
    }

    render() {
        let friendInterface = (
            <div id="friendInterface">
                { this.getFriendChatList() }
            </div>
        );
        let chatBoxInterface = (
            <Paper elevation={3}
                sx={{
                    p: 1,
                    m: 2,
                    width: 430,
                    height: "auto",
                }}
            >
                <TabContext value={this.state.currentTab}>
                    <Tabs
                        value={this.state.currentTab}
                        onChange={this.handleTabChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                        aria-label="chat tabs"
                    >
                        <Tab label="Global" />
                        <Tab label="Game" disabled={!this.state.gameId}/>
                        <Tab label="Friends" />
                    </Tabs>
                    <TabPanel value={0}>
                        { this.makeMessagesFromChatData() }
                    </TabPanel>
                    <TabPanel value={1}>
                        { this.makeMessagesFromChatData() }
                    </TabPanel>
                    <TabPanel value={2}>
                        { this.state.friendChatOpen ?
                            <>
                                { this.makeMessagesFromChatData() }
                            </>
                        :
                            friendInterface
                        }
                    </TabPanel>
                    
                </TabContext>
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
        return (
            <div id="chat">
                {chatBoxInterface}
            </div>
        );
    }

}

export default Chat;
