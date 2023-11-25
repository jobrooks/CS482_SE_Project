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
    Link,
    Stack,
    Fab
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';

class NavBar extends React.Component {
    
    constructor(props) {
        super(props);
        this.handleLogoClick = this.handleLogoClick.bind(this);
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

    handleLogoClick() {
        this.props.navigate("/");
    }

    render() {
        return (
            <div className='NavBar'>
                <div className='AppBar'>
                    <AppBar
                        elevation={0}
                        sx={{
                            mb: 2,
                            position: "sticky",
                            margin: 0,
                            padding:0
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
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Fab
                                    onClick={ this.handleLogoClick }
                                    sx={{
                                        width: "10%",
                                        height: "auto",
                                        aspectRatio: 1,
                                        m: "10px",
                                    }}
                                >
                                    <img src="/images/Logos/Logo Small.png" width="110%" height="auto"  />
                                </Fab>
                                <Typography variant="h6">
                                    Five Card Draw
                                </Typography>
                            </Stack>
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