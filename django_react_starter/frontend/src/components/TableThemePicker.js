import { Dialog, DialogContent, DialogTitle, Grid, Box, Button } from "@mui/material";
import React from "react";

class TableThemePicker extends React.Component {

    constructor(props) {
        super(props);
        this.handleClose = this.handleClose.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.state = {
            open: this.props.themePickerOpen,
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
    }

    render() {
        return (
            <Dialog open={this.props.themePickerOpen} onClose={this.handleClose}>
                <DialogTitle>Change Table Theme</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Button
                                onClick={() => {this.handleThemeChange("blue")}}
                            >
                                <Box
                                    component="img"
                                    src="/images/Table Themes/Table Blue.png"
                                    sx={{
                                        width: "100%",
                                        height: "auto",
                                    }}
                                />
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button
                                onClick={() => {this.handleThemeChange("green")}}
                            >
                                <Box
                                    component="img"
                                    src="/images/Table Themes/Table Green.png"
                                    sx={{
                                        width: "100%",
                                        height: "auto",
                                    }}
                                />
                            </Button>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        )
    }

}

export default TableThemePicker;