import React from 'react';
import './App.css';
import NavBar from './components/NavBar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import EditProfilePage from './pages/EditProfilePage';
import HomePage from './pages/HomePage';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import LoginPage from './pages/LoginPage';
import axios from 'axios';

import CreateAccountPage from './pages/CreateAccountPage';
import ProfilePage from './pages/ProfilePage';
import SearchPage from './pages/SearchPage';
import FriendPage from './pages/FriendPage';
import GamePage from './pages/GamePage';
import GuestPage from './pages/GuestPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import PlayPage from './pages/PlayPage';
import PlayPage2 from './pages/PlayPage2';
import PlayPage3 from './pages/PlayPage3';
import PlayPage4 from './pages/PlayPage4';
import PlayPage5 from './pages/PlayPage5';
import AdminPage from './pages/AdminPage';
import InviteHandler from './components/InviteHandler';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isAdmin: true,
    }
  }

  theme = createTheme({
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

  /**
   * This method for checking whether a user is an admin when app to allow 
   * them access to the admin page is likely insecure. 
   * Possibly app state can be changed in browser, or response object can be spoofed/altered
   * Nonetheless, every admin-related endpoint should recieve a session token and should
   * verify user&token&admin authenticity before performing any operations on the database
   * Principle is, you should not trust the user even if they say they are an admin
   */
  componentDidMount() {
    axios.get(`http://localhost:8000/user_profile/profile/isadmin/${JSON.parse(localStorage.getItem("sessionToken"))}`)
    .then((response) => {
      this.setState({ isAdmin: response.data });
    })
    .catch((response) => {
      console.log("Error checking user admin");
      console.log(response);
    })
  }

  getAdminSite() {
    let adminSiteRouting = (
      <Route path='/admin' element={<AdminPage />}>
        
      </Route>
    );
    if (this.state.isAdmin) {
      return adminSiteRouting;
    } else {
      return null;
    }
  }

  render() {
    return (
      <div className="App">
          {/* <ThemeProvider theme={theme}>
            <CssBaseline /> */}
            <InviteHandler />
            <Routes>
              <Route path='/' element={<HomePage />} />
              <Route path="/edit-profile" element={<EditProfilePage />} />
              <Route path='/login' element={<LoginPage />} />
              <Route path='/reset-password' element={<ResetPasswordPage />} />
              <Route path='/register' element={<CreateAccountPage />} />
              <Route path='/guest' element={<GuestPage />} />
              <Route path='/profile' element={<ProfilePage />} />
              <Route path='/search' element={<SearchPage />} />
              <Route path='/friends' element={<FriendPage />} />
              <Route path='/playpage' element={<PlayPage />} />
              <Route path='/playpage2' element={<PlayPage2 />} />
              <Route path='/game' element={<GamePage />} />
              <Route path='/playpage3' element={<PlayPage3 />} />
              <Route path='/playpage4' element={<PlayPage4 />} />
              <Route path='/playpage5' element={<PlayPage5 />} />
              { this.getAdminSite() }
            </Routes>
          {/* </ThemeProvider> */}
      </div>
    );
  }
}

export default App;