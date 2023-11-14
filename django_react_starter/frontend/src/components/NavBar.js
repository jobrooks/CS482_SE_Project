import React from 'react';
import {
    AppBar,
    Toolbar,
    Button,
    IconButton,
    Typography,
    Drawer,
    ClickAwayListener,
    MenuItem,
    Link
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';

class NavBar extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            drawerOpen: false
        };
    }

    toggleDrawer = () => {
        this.setState({ drawerOpen: !this.state.drawerOpen});
        console.log("Toggling Drawer");
    }

    handleLogout = () => {
        localStorage.setItem("sessionToken", "null");
        this.props.navigate("/login");
    }

    render() {
        return (
            <div className='NavBar'>
                <div className='AppBar'>
                    <AppBar
                        elevation={0}
                        sx={{
                            mb: 2,
                            position: "sticky"
                        }}
                    >
                        <Toolbar sx={{square: true}}>
                            <IconButton
                                size="large"
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                sx={{ mr: 2 }}
                                onClick={this.toggleDrawer}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Typography variant="h6">
                                Five Card Draw
                            </Typography>
                        </Toolbar>
                    </AppBar>
                </div>
                <div className='Drawer'>
                    <Drawer
                        variant='temporary'
                        open={this.state.drawerOpen}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                            onBackdropClick: this.toggleDrawer,
                        }}
                        PaperProps={{
                            width: "50px"
                        }}
                    >
                        <MenuItem
                        component={"a"}
                        href={"/creategame"}
                        >
                            Play
                        </MenuItem>
                        <MenuItem
                            component={"a"}
                            href={"/"}
                        >
                            Home
                        </MenuItem>
                        <MenuItem
                            component={"a"}
                            href={"/account"}
                        >
                            Account
                        </MenuItem>
                        <MenuItem
                            component={"a"}
                            href={"/profile"}
                        >
                            Profile
                        </MenuItem>
                        <MenuItem
                            component={"a"}
                            href={"/search"}
                        >
                            Search
                        </MenuItem>
                        <MenuItem
                            component={"a"}
                            href={"/friends"}
                        >
                            Friends
                        </MenuItem>
                        <MenuItem
                            // component={"a"}
                            onClick={this.handleLogout}
                        >
                            Logout
                        </MenuItem>
                    </Drawer>
                </div>
            </div>
        )
    }
}

// Necessary to use the navigate react hook in a class component #goofy
// Class components cant use hooks idk why
function WithNavigate(props) {
    const navigate = useNavigate();
    return <NavBar {...props} navigate={navigate} />
}

export default WithNavigate;