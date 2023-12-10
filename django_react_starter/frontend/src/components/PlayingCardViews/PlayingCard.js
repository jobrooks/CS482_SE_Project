import { Box } from "@mui/material";
import React from "react";

class PlayingCard extends React.Component {

    mapIDToCard() {
        //modulus card id by 52
        //map to array
        const cards = [];
    }

    render() {
        const cardPath = "/images/Cards/"
        const extension = ".svg"
        const {cardSrc, altText, w, h} = this.props;
        return (
            <Box
                component="img"
                src={cardPath+cardSrc+extension}
                alt={altText}
                sx={{
                    "&": {
                        transition: "0.5s",
                    },
                    "&:hover": {
                        // backgroundColor: `rgba(0, 0, 0, .3)`,
                        transform: "scale(1.1)",
                        boxShadow: "0px 0px 10px 2px #FFFFFF",
                        m: "20px",
                        transition: "0.5s",
                    },
                    borderRadius: "20.1px", // Exact border radius of cards
                    aspectRatio: 0.7142855, // Exact aspect ratio of cards
                    height: h,
                }}
            />
        );
    }

};

export default PlayingCard;