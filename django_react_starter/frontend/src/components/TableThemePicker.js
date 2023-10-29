import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import React from "react";

class TableThemePicker extends React.Component {

    constructor(props) {
        super(props);
        this.handleClose = this.handleClose.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.state = {
            open: this.props.avatarColorPickerOpen,
        };
    }

    handleClose() {
        this.props.toggleThemePicker();
    }
    
    handleSave() {
        this.props.toggleThemePicker();
    }

    handleThemeChange(theme) {
        this.props.changeTheme(theme);
        console.log(theme);
    }

    render() {
        return (
            <Dialog open={this.props.themePickerOpen} onClose={this.handleClose}>
                <DialogTitle>Change Table Theme</DialogTitle>
                <DialogContent>
                    
                </DialogContent>
            </Dialog>
        )
    }

}

export default TableThemePicker;