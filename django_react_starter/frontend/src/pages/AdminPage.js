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
        this.handleUserUpdateError = this.handleUserUpdateError.bind(this);
        this.getUserManagerPage = this.getUserManagerPage.bind(this);
        this.setPaginationModel = this.setPaginationModel.bind(this);
        this.getLoadingBuffer = this.getLoadingBuffer.bind(this);
        this.state = {
            // Component State
            paginationModel: {
                pageSize: 10,
                page: 0,
            },
            totalUsers: 0,
            isLoading: true,
            currentPageData: null,
        }
    }

    componentDidMount() {
        this.getUserManagerPage();
        this.getUserCount()
    }

    getUserManagerPage() {
        this.setState({ isLoading: true });
        axios.get(`http://localhost:8000/user_profile/profile/usermanager/${JSON.parse(localStorage.getItem("sessionToken"))}/${this.state.paginationModel.page}/`)
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

    setPaginationModel(newModel) {
        this.setState({ paginationModel: newModel }, () => {
            this.getUserManagerPage();
        });
    }

    getUserCount() {
        axios.get(`http://localhost:8000/user_api/total-users`)
        .then((response) => {
            this.setState({ isLoading: false, totalUsers: response.data });
            return response.data;
        })
        .catch((response) => {
            this.setState({ isLoading: false })
            console.log("Error getting user count");
            return response;
        })
    }

    getLoadingBuffer() {
        let listBuffer = [];
        for (let i = 0; i < this.state.paginationModel.pageSize; i++) {
            listBuffer.push(
                <Skeleton variant="rounded" sx={{ height: 30, m: 2 }} />
            );
        }
        console.log(listBuffer);
        return listBuffer;
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
                            { this.getLoadingBuffer() }
                        </Card>
                    )
                    : 
                    (
                        <DataGrid pagination
                            rows={this.state.currentPageData}
                            columns={this.columns}
                            processRowUpdate={this.handleUserUpdate}
                            onProcessRowUpdateError={this.handleUserUpdateError}

                            rowCount={this.state.totalUsers}
                            paginationModel={this.state.paginationModel}
                            onPaginationModelChange={this.setPaginationModel}
                            paginationMode="server"
                            editMode="row"
                            isCellEditable={(params) => !params.row.is_staff}
                            pageSizeOptions={[this.state.paginationModel.pageSize]}
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