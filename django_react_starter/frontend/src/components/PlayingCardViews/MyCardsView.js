import React from "react";
import { Stack } from "@mui/material";
import PlayingCard from "./PlayingCard";
import axios from 'axios';

class MyCardsView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            deletable: this.props.deletable,
            myHandID: this.props.myHandID,
            myCards: [] // array of strings "2H, 4D, etc"
        }
    }

    componentDidMount() {
        this.getMyCards();
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
            let myCards = cardJSON.map(item => {
                let rankNumber = item.rank.match(/\d+/)[0];
                let suitFirstLetter = item.suit.match(/\b\w/g)[0].toUpperCase();

                return rankNumber + suitFirstLetter;
            });

            this.setState({ myCards: myCards }, () => {
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

    render() {
        return (
            <Stack
                direction="row"
                spacing={0}
                justifyContent="space-around"
                sx={{
                    width: "100vh",
                }}
            >
                {this.state.myCards.map((card, index) => (
                    <PlayingCard deletable={this.state.deletable} key={index} cardSrc={card} w='100px' h='200px' />
                ))}
            </Stack>
        );
    }

}

export default MyCardsView;
