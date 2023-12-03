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
            myPlayerID: this.props.myPlayerID
        }
    }


    // get my cards from hand
    getEnemies = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/game/${this.state.gameID}/enemies/${this.state.myPlayerID}`);
            //console.log("enemies", response.data)
            this.setState({enemies: response.data});
            console.log("enemies", this.state.enemies)
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