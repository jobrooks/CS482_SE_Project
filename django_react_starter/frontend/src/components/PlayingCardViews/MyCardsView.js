import React from "react";
import {Grid} from "@mui/material";
import PlayingCard from "./PlayingCard";
import axios from 'axios';

class MyCardsView extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            myHandID: this.props.myHandID,
            myCards: [] //array of strings "2H, 4D, etc"
        }
    }

    //get my cards from hand
    getMyCards = async() => {
        try {
            const response = await axios.get(`http://localhost:8000/hand/${myHandID}`);
            this.state.myCards = response.data;
        }
        catch (error) {
            console.log("unable to fetch hand", error);
        }

    }

    //method to get the correct abreviation for the card so the right filename is accessed
    parseCardJSONS(cardJSONS) {
        //assumes 5 cards from response
        cardJSONS.forEach((card) => {
            const rank = parseInt(card.rank[0], 10)
            const suit = card.suit[0];
            const fname = rank.toString() + suit;
            myCards.push(fname);
        });
    }

    render() {
        return(
            <div>
            {this.state.myCards.map((card) => (
                <PlayingCard cardSrc={card} w='100px' h='200px'/>
            ))};
            </div>
        );
    }

};

export default MyCardsView;