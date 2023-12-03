import React from 'react';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';

class EnemyPlayers extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            gameID: this.props.gameID,
            myCards: [] // array of strings "2H, 4D, etc"
        }
    }

    

render() {
    return (
    
    <Grid container justifyContent="center" alignItems="flex-start" spacing={2} >

        <Grid item md={4}>
            <Avatar  sx = {{width: 50, height: 50,}}/>
        </Grid>

        <Grid item md={4}>
            <Avatar  sx = {{width: 50, height: 50,}}/>
        </Grid>

        <Grid item md={4}>
            <Avatar  sx = {{width: 50, height: 50,}}/>
        </Grid>

    </Grid>

    )
}

};

export default EnemyPlayers;