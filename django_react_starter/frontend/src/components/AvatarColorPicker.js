import React from 'react';
import { Dialog, Avatar, Button, DialogActions, DialogContent, DialogTitle, Box } from '@mui/material';
import { red, orange, yellow, green, blue, purple } from '@mui/material/colors';

class AvatarColorPicker extends React.Component {

    constructor(props) {
        super(props);
        this.handleClose = this.handleClose.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.state = {
            open: this.props.avatarColorPickerOpen,
        };
    }

    handleClose() {
        this.props.toggleColorPicker();
    }
    
    handleSave() {
        this.props.toggleColorPicker();
    }

    handleColorChange(color) {
        this.props.changeColor(color);
        console.log(color);
    }

    render() {
        return (
            <Dialog open={this.props.colorPickerOpen} onClose={this.handleClose}>
            <DialogTitle>Change Avatar Color</DialogTitle>
            <DialogContent>
                <Box display="flex" justifyContent="space-between" p={2}>
                    <Avatar
                        sx={{ bgcolor: red[500], cursor: 'pointer' }}
                        onClick={() => this.handleColorChange(red[500])}
                    />
                    <Avatar
                        sx={{ bgcolor: orange[500], cursor: 'pointer' }}
                        onClick={() => this.handleColorChange(orange[500])}
                    />
                    <Avatar
                        sx={{ bgcolor: yellow[500], cursor: 'pointer' }}
                        onClick={() => this.handleColorChange(yellow[500])}
                    />
                    <Avatar
                        sx={{ bgcolor: green[500], cursor: 'pointer' }}
                        onClick={() => this.handleColorChange(green[500])}
                    />
                    <Avatar
                        sx={{ bgcolor: blue[500], cursor: 'pointer' }}
                        onClick={() => this.handleColorChange(blue[500])}
                    />
                    <Avatar
                        sx={{ bgcolor: purple[500], cursor: 'pointer' }}
                        onClick={() => this.handleColorChange(purple[500])}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={this.handleClose}>Cancel</Button>
                <Button onClick={this.handleSave} color="primary">
                Save
                </Button>
            </DialogActions>
            </Dialog>
        )
    };
};

export default AvatarColorPicker;