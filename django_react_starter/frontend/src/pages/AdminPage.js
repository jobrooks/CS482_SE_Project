import React from 'react';
import axios from "axios";
import { Button } from '@mui/material';

class AdminPage extends React.Component {

    render() {
        return (
            <div id='adminpage'>
                <Button>I'm an admin</Button>
            </div>
        );
    }

}

export default AdminPage;