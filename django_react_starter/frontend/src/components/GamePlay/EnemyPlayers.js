import React from 'react';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import axios from 'axios';
import Enemy from './Enemy';

class EnemyPlayers extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            enemies: [],
        }
    }

    getEnemies() {
        const gameID = this.props.gameID;
        const playerID = this.props.playerID;
        axios.get(`http://127.0.0.1:8000/game/${gameID}/enemies/${playerID}`)
        .then((response) => {
            this.setState({enemies: response.data})
        })
        .catch((response) => {
            console.log("error getting enemies")
            console.log(response)
        });
        //console.log("enemies", response.data))
    }

    componentDidMount() {
        this.getEnemies()
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