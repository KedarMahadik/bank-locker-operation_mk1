import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './contexts/AuthContext';
import App from './App.jsx';
import theme from './theme';
import './index.css'; // Global resets
import './App.css';   // App-specific global styles

// This is the entry point of your React application.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Enables client-side routing for the entire app */}
    <BrowserRouter>
      {/* Applies your custom Material-UI theme from theme.js */}
      <ThemeProvider theme={theme}>
        {/* Provides global authentication state (user, login/logout functions) */}
        <AuthProvider>
          <App />
          {/* Enables pop-up notifications (toasts) throughout the app */}
          <Toaster position="top-right" reverseOrder={false} />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);