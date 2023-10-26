import React from 'react';
import {
    AppBar,
    Toolbar,
    Button,
    IconButton,
    Typography,
    Drawer,
    ClickAwayListener,
    MenuItem
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
            <>
                <AppBar>
                    <Toolbar>
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
                    <Drawer
                        variant='temporary'
                        open={this.state.drawerOpen}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                            onBackdropClick: this.toggleDrawer
                        }}
                    >
                        <Button>Help lol</Button>
                        <MenuItem>drawer item 1</MenuItem>
                    </Drawer>
            </>
        )
    }
}

export default NavBar;