import React from 'react';
import logo from './logo.svg';
import './App.css';
import NavBar from './components/NavBar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AccountSettings from './pages/AccountSettingsPage';
import HomePage from './pages/HomePage';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import LoginPage from './pages/LoginPage';

import CreateAccountPage from './pages/CreateAccountPage';
import ProfilePage from './pages/ProfilePage';
import SearchPage from './pages/SearchPage';
import FriendPage from './pages/FriendPage';
import CreateGamePage from './pages/CreateGamePage';
import PlayPage from './pages/PlayPage';
import PlayPage2 from './pages/PlayPage2';
import PlayPage3 from './pages/PlayPage3';

function App() {

  const theme = createTheme({
    palette: {
      primary: {
        main: "#4E0416",
      },
      secondary: {
        main: "#548114",
      },
      background: {
        default: "#e8e8f3",//"#e0e0e0",
        paper: "#e8e8f3",//#e0e0e0",
      },
    },
    components: {
      MuiCard: {
        styleOverrides: { // Must override default style
          root: {
            borderRadius: '20px',
          },
        },
      },
      MuiList: {
        styleOverrides: {
          root: {
            borderRadius: '20px',
          },
        },
      },
    },
    spacing: 8, // Global spacing multiplier
    padding: 4,
    shadows: [
      'none', // elevation 0
      // elevation 1 (Low Elevation mui)
      '0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)',
      // elevation 2 (Low neumorphic)
      "6px 6px 10px #bdbdbd, -6px -6px 10px #ffffff",//11px 11px 20px #bdbdbd, -11px -11px 20px #ffffff
      // elevation 3 (High neumorphic)
      "11px 11px 20px #bdbdbd, -11px -11px 20px #ffffff",
      // elevation 4 (Shallow Inset neumorphic)
      "inset 5px 5px 22px #bdbdbd, inset -5px -5px 22px #ffffff",
      // elevation 5 (Deep Inset neumorphic)
      "inset 11px 11px 22px #bdbdbd, inset -11px -11px 22px #ffffff",
    ],
  });

  return (
    <div className="App">
        {/* <ThemeProvider theme={theme}>
          <CssBaseline /> */}
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path="/account" element={<AccountSettings />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<CreateAccountPage />} />
            <Route path='/profile' element={<ProfilePage />} />
            <Route path='/search' element={<SearchPage />} />
            <Route path='/friends' element={<FriendPage />} />
            <Route path='/playpage' element={<PlayPage />} />
            <Route path='/playpage2' element={<PlayPage2 />} />
            <Route path='/creategame' element={<CreateGamePage />} />
            <Route path='/playpage3' element={<PlayPage3 />} />
          </Routes>
        {/* </ThemeProvider> */}
    </div>
  );
}

export default App;