import React from 'react';
import logo from './logo.svg';
import './App.css';
import NavBar from './components/NavBar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AccountSettings from './pages/AccountSettingsPage';
import HomePage from './pages/HomePage';
import { ThemeProvider, createTheme } from '@mui/material/styles';

function App() {

  const theme = createTheme({
    spacing: 8,
    padding: 4,
  });

  return (
    <div className="App">
        <ThemeProvider theme={theme}>
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path="/account" element={<AccountSettings />} />
          </Routes>
        </ThemeProvider>
    </div>
  );
}

export default App;
