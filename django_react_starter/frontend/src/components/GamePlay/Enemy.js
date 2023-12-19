import { Avatar, Badge, Box, Card, CardActionArea, CardContent, Divider, Stack, Typography } from "@mui/material";
import React from "react";
import SmallUserCard from "../UserCards/SmallUserCard";
import PlayingCard from "../PlayingCardViews/PlayingCard";

class Enemy extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            linkedEnemy: this.props.linkedEnemy,
        
        };
    }

    render() {
        return (
            <div className="enemy">
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '150px', // Adjust the width as needed
                        padding: '2px',
                        borderRadius: '20.1px',
                        my: '16px',
                        backgroundColor: 'rgba(0, 0, 0, 0.25)',
                    }}
                >
                    <CardContent
                        sx={{
                            py: "5px"
                        }}
                    >
                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            justifyContent="space-between"
                        >
                            <Stack direction="column"
                                alignItems="flex-start"
                            >
                                <Typography variant="h6" noWrap={false} color="#FFFFFF">
                                    {this.state.linkedEnemy.name}
                                </Typography>
                                <SmallUserCard username={this.state.linkedEnemy.name} avatarColor={"#000000"} info={true} isButton={true} />
                            </Stack>
                            <Typography variant="h6" noWrap={false} color="#FFFFFF">
                                {"Bet: $" + (this.state.linkedEnemy.betAmount ? this.state.linkedEnemy.betAmount : 0)}
                            </Typography>
                        </Stack>
                    </CardContent>
                    <CardActionArea>
                        {/*
                            Empty CardActionArea is necessary to center cardcontent
                            Card gives last item in card an extra padding idk why
                            ^ just default mui formatting
                        */}
                    </CardActionArea>
                <Stack direction="row" spacing={.5}>
                    <PlayingCard backwards={true} />
                    <PlayingCard backwards={true} />
                    <PlayingCard backwards={true} />
                    <PlayingCard backwards={true} />
                    <PlayingCard backwards={true} />
                </Stack>
                </Box>
            </div>
        );
    }

}

export default Enemy;