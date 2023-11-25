import React from 'react';
import axios from "axios";
import { Button, Card, List, Stack } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import NavBar from './NavBar';
import SmallUserCard from './UserCards/SmallUserCard';


class AdminPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            // How component is displayed
            userManagerPageSize: 10,
            // Component State
            page: 1,
            isLoading: true,
            currentPageData: null,
        }
    }

    componentDidMount() {
        this.getUserManagerPage();
    }

    makeUserManagerTable() {
        let listBuffer = [];
        for (let i in this.state.currentPageData) {
            let user = this.state.currentPageData[i];
            listBuffer.push(
                <SmallUserCard
                    username={user.username}
                    wins={user.wins}
                    is_active={user.is_active}
                    avatarColor={user.avatar_color}
                    info={true}
                    friendable={true}
                    inviteable={true}
                    messageable={true}
                />
            );
        }
        return (
            <div id="userTable">
                <Stack direction="column"
                    alignItems="center"
                    spacing={0}
                >
                    { listBuffer }
                </Stack>
            </div>
        );
    }

    getUserManagerPage() {
        this.setState({ isLoading: true });
        axios.get(`http://localhost:8000/user_profile/profile/usermanager/${JSON.parse(localStorage.getItem("sessionToken"))}/${this.state.page}`)
        .then((response) => {
            this.setState({ currentPageData: response.data.users, isLoading: false });
            return response.data;
        })
        .catch((response) => {
            this.setState({ isLoading: false })
            console.log("Error getting users");
            return response;
        })
    }

    columns = [
        { field: 'id', headerName: 'ID', width: 90, type: 'number' },
        { field: 'username', headerName: 'Username', width: 150 },
        { field: 'email', headerName: 'Email', width: 150 },
        { field: 'wins', headerName: 'Wins', width: 90, type: 'number' },
        { field: 'games_played', headerName: 'Games Played', width: 150, type: 'number' },
        { field: 'money', headerName: 'Money', width: 150, type: 'number' },

    ];

    render() {
        return (
            <div id='adminpage'>
                <NavBar />
                <Card elevation={3}
                    sx={{
                        width: 1000,
                        height: "auto",
                        aspectRatio: 1,
                        m: 2
                    }}
                >
                    <DataGrid
                        rows={this.state.isLoading ? [{"id": "Loading..."}] : this.state.currentPageData}
                        columns={this.columns}
                        initialState={{
                          pagination: {
                            paginationModel: {
                              pageSize: this.state.userManagerPageSize,
                            },
                          },
                        }}
                        pageSizeOptions={[this.state.userManagerPageSize]}
                        checkboxSelection
                        disableRowSelectionOnClick
                    />
                </Card>
            </div>
        );
    }

}

export default AdminPage;