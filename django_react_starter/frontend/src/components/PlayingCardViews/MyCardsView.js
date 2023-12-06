import React from "react";
import { Stack } from "@mui/material";
import PlayingCard from "./PlayingCard";
import axios from 'axios';

class MyCardsView extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            myHandID: this.props.myHandID,
            myCards: [] // array of strings "2H, 4D, etc"
        }
    }

    // get my cards from hand
    getMyCards() {
        return new Promise((resolve, reject) => {
            axios.get(`http://127.0.0.1:8000/hand/${this.state.myHandID}`)
            .then((response) => {
                this.parseJson(response.data)
                .then(() => {
                    resolve("done getting my cards");
                })
            })
            .catch((response) => {
                console.log(response);
            });
        });
    }

    parseJson(cardJSON) {
        return new Promise((resolve, reject) => {
            const myCards = cardJSON.map(item => {
                const rankNumber = item.rank.match(/\d+/)[0];
                const suitFirstLetter = item.suit.match(/\b\w/g)[0].toUpperCase();

                return rankNumber + suitFirstLetter;
            });

            this.setState({ myCards }, () => {
                // Callback function to ensure that removeLeadingZeros is called after the state is updated
                this.removeLeadingZeros().then(() => {
                    resolve("done parsing json");
                })
            });
        });
    }

    removeLeadingZeros() {
        return new Promise((resolve, reject) => {
            const modifiedArray = this.state.myCards.map(card => {
                let rank = parseInt(card.slice(0, -1), 10).toString();
                // Convert numeric ranks to letters
                if (rank === '11') {
                    rank = 'J';
                } else if (rank === '12') {
                    rank = 'Q';
                } else if (rank === '13') {
                    rank = 'K';
                } else if (rank === '14') {
                    rank = 'A';
                }
                const suit = card.slice(-1);
                return rank + suit;
            });
    
            this.setState({ myCards: modifiedArray }, () => {
                resolve("finished removing leading zeros");
            });
        })
    }

   
    async componentDidMount() {
        await this.getMyCards(); // Wait for the cards to be fetched before rendering
    }


    render() {
        return (
            <Stack direction="row" spacing={2}>
                {this.state.myCards.map((card, index) => (
                    <PlayingCard key={index} cardSrc={card} w='100px' h='200px' />
                ))}
            </Stack>
        );
    }

}

export default MyCardsView;
