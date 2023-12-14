import { Box, IconButton } from "@mui/material";
import React from "react";
import DeleteIcon from '@mui/icons-material/Delete';

class PlayingCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            deletable: this.props.deletable,
        }
    }

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
                    sx={{
                        position: "relative",
                        "&": {
                            transition: "0.5s",
                        },
                        "&:hover": {
                            // backgroundColor: `rgba(0, 0, 0, .3)`,
                            transform: "scale(1.1)",
                            boxShadow: (this.state.deletable ? "0px 0px 10px 2px #222222" : "0px 0px 10px 2px #FFFFFF"),
                            m: "20px",
                            transition: "0.5s",
                        },
                        borderRadius: "20.1px", // Exact border radius of cards
                        aspectRatio: 0.7142855, // Exact aspect ratio of cards
                        height: h,
                    }}
                >
                { this.state.deletable ?
                    <Box
                        sx={{
                            "&": {
                                transition: "0.5s",
                            },
                            "&:hover": {
                                transition: "0.5s",
                                opacity: 0.6,
                            },
                            backgroundColor: "#000000",
                            opacity: 0,
                            borderRadius: "20.1px", // Exact border radius of cards
                            aspectRatio: 0.7142855, // Exact aspect ratio of cards
                            height: h,
                            zIndex: 2,
                            position: "absolute",
                            top: "0px",
                            left: "0px",
                        }}
                    >
                        <IconButton disableRipple
                            sx={{
                                zIndex: 3,
                                opacity: "inherit",
                                width: "100%",
                                height: "100%",
                            }}
                        >
                            <DeleteIcon
                                sx={{
                                    color: "#FFFFFF",
                                    zIndex: 4,
                                    height: "50%",
                                    width: "50%",
                                }}
                            />
                        </IconButton>
                    </Box>
                :
                    <></>
                }
                <Box
                    component="img"
                    src={cardPath+cardSrc+extension}
                    alt={altText}
                    sx={{
                        borderRadius: "20.1px", // Exact border radius of cards
                        aspectRatio: 0.7142855, // Exact aspect ratio of cards
                        height: h,
                        zIndex: 1,
                        position: "absolute",
                        top: "0px",
                        left: "0px",
                    }}
                />
            </Box>
        );
    }

};

export default PlayingCard;