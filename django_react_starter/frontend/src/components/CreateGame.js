import React from "react"
import {Box, Stack, Avatar, Typography, Checkbox} from "@mui/material";
import axios from "axios";

class CreateGame extends React.Component {

    constructor(props) {
        super(props)
        //this state will hold user info and friends
        this.state = {
            username: "",
            friends: [],
            selectedPlayers: []
        }

    }

    getFriends() {
        let token = JSON.parse(localStorage.getItem("sessionToken"));

        //get username
        axios.get(`http://localhost:8000/user_profile/profile/${token}/`)
        .then((response) => {
            this.setState({username: response.data['username']})
            console.log(this.state.username);
        })
        .catch((response) => {
            console.log("username not found")
        })

        //get friends
        const config = {headers: {Authorization: `Bearer ${token}`}};
        axios.get(`http://localhost:8000/friend/get_friends`,config)
        .then((response) => {
            this.setState({friends: response.data})
            console.log(response.data['friends']);
        })
        .catch((response) => {
            console.log("this loser got no friends")
        })

    }

    componentDidMount() {
        this.getFriends()
    }

    handlePlayerSelection = (playerName) => {
        this.setState((prevState) => {
          const isSelected = prevState.selectedPlayers.includes(playerName);
    
          if (isSelected) {
            // If player is already selected, remove from selectedPlayers
            return {
              selectedPlayers: prevState.selectedPlayers.filter(name => name !== playerName),
            };
          } else {
            // If player is not selected, add to selectedPlayers
            return {
              selectedPlayers: [...prevState.selectedPlayers, playerName],
            };
          }
        });
      }

    render() {
        const friends = this.state.friends;
        const selectedPlayers = [];
        return (
            <div className="CreateGame">
                <Stack direction="row" justifyContent="space-between" spacing={2} mb={2}>
              {friends.map((friend) => (
                <Box key={friend.username} sx={{ textAlign: 'center' }}>
                  <Avatar src={friend.avatar}>{friend.username[0]}</Avatar>
                  <Typography variant="caption">{friend.username}</Typography>
                  <Typography variant="caption">{friend.money}</Typography>
                  <Checkbox
                    checked={selectedPlayers.includes(friend.username)}
                    onChange={() => this.handlePlayerSelection(friend.username)}
                  />
                </Box>
              ))}
            </Stack>
                {/* <Box sx={{ display: 'flex', justifyContent: 'center'}}> */}
                {/* stack to hold waiting players */}
                {/* <Stack justifyContent='space-between' direction='row' spacing={2} sx={{ border: '1px solid'}}>

                    <Box sx={{backgroundColor: '#ccc', height:'100px', width:'100px'}}/>
                    <Box sx={{backgroundColor: '#ccc', height:'100px', width:'100px'}}/>
                    <Box sx={{backgroundColor: '#ccc', height:'100px', width:'100px'}}/>
                </Stack> */}


                    {/* <Box sx={{backgroundColor: '#ccc'}}>
                    </Box>
                    <div
                    style={{
                        flex: 1,
                        width: '144px',
                        height: '201px',
                        marginRight: '10px',
                        backgroundColor: '#ccc', // Set the background color to grey
                        border: '1px solid #888', // Add a border for better visibility
                    }}
                    />
                    <div
                    style={{
                        flex: 1,
                        width: '144px',
                        height: '201px',
                        marginRight: '10px',
                        backgroundColor: '#ccc', // Set the background color to grey
                        border: '1px solid #888', // Add a border for better visibility
                    }}
                    /> */}
                {/* </Box> */}

            </div>
        )
    }
};

export default CreateGame;