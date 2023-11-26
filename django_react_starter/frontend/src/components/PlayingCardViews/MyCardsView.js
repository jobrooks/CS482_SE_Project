import React from "react";
import {Grid} from "@mui/material";
import PlayingCard from "./PlayingCard";

class MyCardsView extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            myCards: [] //array of strings "2H, 4D, etc"
        }
    }

    //get my cards from hand
    getMyCards() {

    }

};

export default MyCardsView;