import { Dialog, DialogContent, DialogTitle, Grid, Box, Button } from "@mui/material";
import React from "react";

class CardBackingPicker extends React.Component {

    constructor(props) {
        super(props);
        this.handleClose = this.handleClose.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.state = {
            open: this.props.backingPickerOpen,
        };
    }

    handleClose() {
        this.props.toggleBackingPicker();
    }
    
    handleSave() {
        this.props.toggleBackingPicker();
    }

    handleBackingChange(backing) {
        this.props.changeBacking(backing);
    }

    render() {
        return (
            <Dialog open={this.props.backingPickerOpen} onClose={this.handleClose}>
                <DialogTitle>Change Card Backing</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Button
                                onClick={() => {this.handleBackingChange("blue")}}
                            >
                                <Box
                                    component="img"
                                    src="/images/Card_Backings/Back Blue Plaid.png"
                                    sx={{
                                        width: "100%",
                                        height: "auto",
                                    }}
                                />
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button
                                onClick={() => {this.handleBackingChange("green")}}
                            >
                                <Box
                                    component="img"
                                    src="/images/Card_Backings/Back Green Plaid.png"
                                    sx={{
                                        width: "100%",
                                        height: "auto",
                                    }}
                                />
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button
                                onClick={() => {this.handleBackingChange("red")}}
                            >
                                <Box
                                    component="img"
                                    src="/images/Card_Backings/Back Red Plaid.png"
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

export default CardBackingPicker;