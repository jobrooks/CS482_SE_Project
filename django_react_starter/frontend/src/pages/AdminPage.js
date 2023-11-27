import React from 'react';
import axios from "axios";
import { Button, Card, List, Skeleton, Stack } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridRowParams } from '@mui/x-data-grid';
import NavBar from '../components/NavBar';
import SmallUserCard from '../components/UserCards/SmallUserCard';
import PublishIcon from '@mui/icons-material/Publish';
import DeleteIcon from '@mui/icons-material/Delete';
import _ from 'lodash';


class AdminPage extends React.Component {

    constructor(props) {
        super(props);
        this.handleUserUpdate = this.handleUserUpdate.bind(this);
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
        axios.get(`http://localhost:8000/user_profile/profile/usermanager/${JSON.parse(localStorage.getItem("sessionToken"))}/${this.state.page}/`)
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

    async handleUserUpdate(updatedRow, originalRow) {
        return await axios.patch(`http://localhost:8000/user_api/user-management/${JSON.parse(localStorage.getItem("sessionToken"))}/${updatedRow.username}/`, updatedRow)
        .then((response) => {
            // Map returns the current page data and applys a function on each row and if that row is the row needed to be updated it changes it to the updated row
            let newPageData = this.state.currentPageData.map((row) => {
                if (_.isEqual(row, originalRow)) {
                    return updatedRow;
                } else {
                    return row;
                }
            });
            this.setState({ currentPageData: newPageData });
            return updatedRow;
        })
        .catch((response) => { 
            console.log("Error patching user" + updatedRow.username);
            return originalRow;
        });
    }
    
    handleUserUpdateError(error) {
        console.log(error);
        return Promise.reject(error);
    }

    columns = [
        { field: 'id', headerName: 'User ID', width: 90, type: 'number', editable: false },
        { field: 'username', headerName: 'Username', width: 150, editable: true },
        { field: 'email', headerName: 'Email', width: 150, editable: true },
        { field: 'wins', headerName: 'Wins', width: 90, type: 'number', editable: true },
        { field: 'games_played', headerName: 'Games Played', width: 150, type: 'number', editable: true },
        { field: 'money', headerName: 'Money', width: 150, type: 'number', editable: true },
        { field: 'is_staff', headerName: 'Staff', width: 150, type: 'boolean', editable: true },
        { field: 'last_login', headerName: 'Last Login', width: 200, type: 'dateTime', editable: true,
        valueGetter: (params) => {return new Date(params.row.last_login)}
        },
        { field: 'date_joined', headerName: 'Date Joined', width: 200, type: 'dateTime', editable: true,
        valueGetter: (params) => {return new Date(params.row.date_joined)}
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            getActions: (params) => [
                <GridActionsCellItem icon={<SmallUserCard info={true} isButton={true} username={params.row.username}/>} label="Account" />,
                <GridActionsCellItem icon={<DeleteIcon />} onClick={() => {
                    if (!params.row.is_staff) {
                        // Add Delete
                    }
                }} label="Delete" />,
            ]
        },
    ];

    render() {
        return (
            <div id='adminpage'>
                <NavBar />
                <Card elevation={3}
                    sx={{
                        width: "auto",
                        height: "auto",
                        m: 2
                    }}
                >
                    { this.state.isLoading ? 
                    ( // Skeleton UI returned while data is loading
                        <Card>
                            <Skeleton variant="rounded" sx={{ height: 30, m: 2 }} />
                            <Skeleton variant="rounded" sx={{ height: 30, m: 2 }} />
                            <Skeleton variant="rounded" sx={{ height: 30, m: 2 }} />
                            <Skeleton variant="rounded" sx={{ height: 30, m: 2 }} />
                            <Skeleton variant="rounded" sx={{ height: 30, m: 2 }} />
                            <Skeleton variant="rounded" sx={{ height: 30, m: 2 }} />
                            <Skeleton variant="rounded" sx={{ height: 30, m: 2 }} />
                            <Skeleton variant="rounded" sx={{ height: 30, m: 2 }} />
                            <Skeleton variant="rounded" sx={{ height: 30, m: 2 }} />
                            <Skeleton variant="rounded" sx={{ height: 30, m: 2 }} />
                        </Card>
                    )
                    : 
                    (
                        <DataGrid
                            rows={this.state.currentPageData}
                            columns={this.columns}
                            processRowUpdate={this.handleUserUpdate}
                            onProcessRowUpdateError={this.handleUserUpdateError}
                            initialState={{
                            pagination: {
                                paginationModel: {
                                pageSize: this.state.userManagerPageSize,
                                },
                            },
                            }}
                            editMode="row"
                            isCellEditable={(params) => !params.row.is_staff}
                            pageSizeOptions={[this.state.userManagerPageSize]}
                            checkboxSelection
                            disableRowSelectionOnClick
                            sx={{
                                height: "auto"
                            }}
                        />
                    )
                    }
                </Card>
            </div>
        );
    }

}

export default AdminPage;