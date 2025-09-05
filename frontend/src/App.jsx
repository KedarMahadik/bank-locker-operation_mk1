import React from 'react';
import { Box, CssBaseline } from '@mui/material';

// Import the main router and layout components
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

/**
 * The root component of the application.
 * It sets up the main layout structure (Navbar, main content, Footer)
 * and renders the AppRoutes component which handles all page navigation.
 */
function App() {
  return (
    // This Box component creates a flex container that ensures the footer
    // sticks to the bottom of the page, even on short content pages.
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* CssBaseline provides a consistent styling baseline (a CSS reset) */}
      <CssBaseline />
      
      {/* The Navbar will be displayed on every page */}
      <Navbar />

      {/* This is the main content area where pages will be rendered */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, // Allows this area to grow and push the footer down
          p: { xs: 2, sm: 3 } // Adds responsive padding around the content
        }}
      >
        {/* AppRoutes contains all the <Route> logic for the application */}
        <AppRoutes />
      </Box>

      {/* The Footer will be displayed on every page */}
      <Footer />
    </Box>
  );
}

export default App;