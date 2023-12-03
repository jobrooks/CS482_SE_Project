import React from 'react';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import axios from 'axios';
import Enemy from './Enemy';

class EnemyPlayers extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            gameID: this.props.gameID,
            enemies: [],
            username: this.props.username
        }
    }

    //remove self from enemies
    removeSelf() {
        const updatedEnemies = this.state.enemies.filter(player => player.name !== this.state.username);
        this.setState({enemies: updatedEnemies});
    }


    // get my cards from hand
    getEnemies = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/player/game/${this.state.gameID}`);
            this.setState({enemies: response.data});
            this.removeSelf();
        } catch (error) {
            console.log("unable to fetch enemies", error);
        }
    }

    async componentDidMount() {
        await this.getEnemies(); // Wait for the cards to be fetched before rendering
    }


render() {
    return (


    <Grid container justifyContent="center" alignItems="flex-start" spacing={2} >

        {this.state.enemies.map((playerData, index) => (
            <Grid item key={index} md={4}>
                <Enemy player={playerData}/>
            </Grid>
        ))}
    </Grid>

    )
}

};

export default EnemyPlayers;