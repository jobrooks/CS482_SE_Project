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
            const response = await axios.get(`http://127.0.0.1:8000/hand/${this.state.myHandID}`);
            this.parseJson(response.data)
            this.removeLeadingZeros()
        }
        catch (error) {
            console.log("unable to fetch hand", error);
        }

    }

    parseJson = (cardJSON) => {
        const myCards = cardJSON.map(item => {
          const rankNumber = item.rank.match(/\d+/)[0];
          const suitFirstLetter = item.suit.match(/\b\w/g)[0].toUpperCase();
    
          return rankNumber + suitFirstLetter;
        });
    
        this.setState({ myCards });
      }

      removeLeadingZeros = () => {
        console.log(this.state.myCards)
        const modifiedArray = this.state.myCards.map(card => {
          const rank = parseInt(card.slice(0, -1), 10).toString();
          const suit = card.slice(-1);
          return rank + suit;
        });
        console.log(modifiedArray)
    
        this.setState({ myCards: modifiedArray });
      }

    //method to get the correct abreviation for the card so the right filename is accessed
    parseCardJSONS(cardJSONS) {
        //assumes 5 cards from response.

        const temp = cardJSONS.map((element) => {
            return {
                suit: element.suit,
                rank: element.rank
            };
        });


        const fnames = [];
        console.log(temp)
        temp.forEach((card) => {
            console.log("running")
            //console.log(cardJSONS)
            const rankNumber = Number(card.rank.match(/\('([^']*)', '([^']*)'\)/)[1]);
            const rank = String(rankNumber);
            const suitLetter = card.suit.match(/\('([^']*)', '([^']*)'\)/)[1];
            const fname = rank + suitLetter;
            fnames.push(fname);
        });

        this.state.myCards = fnames;
    }

    async componentDidMount() {
        await this.getMyCards(); // Wait for the cards to be fetched before rendering
      }

    render() {
        console.log(this.state.myCards)
        return(
            <div>
            {this.state.myCards.map((card) => (
                <PlayingCard cardSrc={card} w='100px' h='200px'/>
            ))}
            </div>
        );
    }

};

export default MyCardsView;