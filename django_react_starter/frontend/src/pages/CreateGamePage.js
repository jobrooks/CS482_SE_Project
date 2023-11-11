import React, { useState } from 'react';

/*
const PlayerList = () => {
  const [players, setPlayers] = useState([]);
}
*/
const players = [
  { name: 'Sleepy', stack: '100c', avatar: 'path/to/sleepy_avatar.png' },
  { name: 'Loki', stack: '100c', avatar: 'path/to/loki_avatar.png' },
  // Add other players here...
];

  const handleAddPlayer = () => {
    //setPlayers(prevPlayers => [...prevPlayers, `Player ${prevPlayers.length + 1}`]);
  };

class CreateGamePage extends React.Component {

  render() {
    return (
      <div>
        <h1>Player List</h1>
        <ul>
          {players.map((player, index) => (
            <li key={index}>{player}</li>
          ))}
        </ul>
        <button onClick={handleAddPlayer}>Add Player</button>
        <button>Create Game</button>
      </div>
    );
  }
};

export default CreateGamePage;