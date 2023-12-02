import React from "react";

class PlayingCard extends React.Component {

    mapIDToCard() {

        //modulus card id by 52
        //map to array

        cards = []
        
    }

    render(){
        const cardPath = "/images/Cards/"
        const extension = ".svg"
        const {cardSrc, altText, w, h} = this.props;
        return <img src={cardPath+cardSrc+extension} alt={altText} style={{ width: w, height: h}}/>;
    }

};

export default PlayingCard;