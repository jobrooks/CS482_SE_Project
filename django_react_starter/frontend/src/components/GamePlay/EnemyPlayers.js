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
        axios.get(`http://127.0.0.1:8000/game/${this.props.gameID}/enemies/${this.props.myPlayerID}`)
        .then((response) => {
            this.setState({enemies: response.data})
        })
        .catch((response) => {
            console.log("error getting enemies")
            console.log(response)
        });
        //console.log("enemies", response.data))
    }


    // get my cards from hand
    // getEnemies = async () => {
    //     try {
    //         const response = await axios.get(`http://127.0.0.1:8000/game/${this.props.gameID}/enemies/${this.props.myPlayerID}`);
    //         //console.log("enemies", response.data)
    //         this.setState({enemies: response.data, loading: false});
    //         console.log("enemies", this.state.enemies)
    //     } catch (error) {
    //         console.log("unable to fetch enemies", error);
    //         this.setState({ loading: false });
    //     }
    // }

    // componentDidUpdate(prevProps) {
    //     // Check if gameID or myPlayerID props have changed
    //     if (prevProps.gameID !== this.props.gameID || prevProps.myPlayerID !== this.props.myPlayerID) {
    //       this.setState({ loading: true }); // Set loading to true before making the API request
    //       this.getEnemies();
    //     }
    //   }

    // async componentDidMount() {
    //     await this.getEnemies(); // Wait for the cards to be fetched before rendering
    // }

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