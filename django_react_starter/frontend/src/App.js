import React from 'react';
import logo from './logo.svg';
import './App.css';
import NavBar from './components/NavBar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AccountSettings from './pages/AccountSettingsPage';
import HomePage from './pages/HomePage';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

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
        default: "#e0e0e0",
        paper: "#e0e0e0",
      },
    },
    components: {
      MuiCard: {
        styleOverrides: { // Must override default style
          root: {
            borderRadius: '35px',
          },
        },
      },
    },
    spacing: 8, // Global spacing multiplier
    padding: 4,
    shadows: [
      'none', // elevation 0
      '0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)', // elevation 1
      "11px 11px 22px #a4a4a4, -11px -11px 22px #ffffff"
      // ... define more elevations as needed
      // You can define up to 25 elevations (0-24)
    ],
  });

  return (
    <div className="App">
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path="/account" element={<AccountSettings />} />
          </Routes>
        </ThemeProvider>
    </div>
  );
}

export default App;
