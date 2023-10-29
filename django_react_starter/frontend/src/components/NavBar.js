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

class NavBar extends React.Component {

    state = {
        drawerOpen: false
    };

    toggleDrawer = () => {
        this.setState({ drawerOpen: !this.state.drawerOpen});
        console.log("Toggling Drawer");
    }

    render() {
        return (
            <div className='NavBar'>
                <div className='AppBar'>
                    <AppBar>
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
                            onBackdropClick: this.toggleDrawer
                        }}
                    >
                        <MenuItem
                        >
                            Play
                        </MenuItem>
                        <MenuItem
                            // This is how you put a link in a menuitem
                            component={"a"}
                            href={"/account"}
                        >
                            Account
                        </MenuItem>
                    </Drawer>
                </div>
            </div>
        )
    }
}

export default NavBar;