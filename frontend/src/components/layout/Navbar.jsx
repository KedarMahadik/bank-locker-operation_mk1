import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ShieldIcon from '@mui/icons-material/Shield';
import Button from '../common/Button';

/**
 * The main navigation bar for the application.
 * It displays the brand logo/name and navigation links.
 */
const Navbar = () => {
  return (
    <AppBar 
      // === THE CRITICAL FIX IS HERE ===
      // Changed position from "static" to "fixed"
      position="fixed" 
      color="transparent" 
      elevation={0} 
      sx={{ 
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(8px)',
        // Add zIndex to ensure it stays on top of other content
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        {/* Brand Logo and Name */}
        <Box 
          component={RouterLink} 
          to="/" 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            flexGrow: 1, 
            textDecoration: 'none', 
            color: 'inherit' 
          }}
        >
          <ShieldIcon sx={{ color: 'primary.main', mr: 1 }} />
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              fontWeight: 'bold', 
              color: 'text.primary' 
            }}
          >
            LockBank
          </Typography>
        </Box>

        {/* Navigation Links */}
        <Box>
          <Button 
            variant="outlined" 
            component={RouterLink} 
            to="/auth/login" 
            sx={{ mr: 2 }}
          >
            User Login
          </Button>
          <Button 
            variant="contained" 
            component={RouterLink} 
            to="/admin/login"
          >
            Admin Login
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
