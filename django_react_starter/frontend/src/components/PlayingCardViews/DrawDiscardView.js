import React from "react";
import { Stack } from "@mui/material";
import PlayingCard from "./PlayingCard";
import axios from 'axios';
import MyCardsView from "./MyCardsView";

class DrawDiscardView extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            myPlayerID: null,
        }
    }

    

    render() {
        return (
            <MyCardsView>
                deletable={false}
                myHandID={this.state.myPlayerID}
            </MyCardsView>
        )
    }


}

export default DrawDiscardView;