import React from 'react';
import { Box, Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom';
import UserSidebar from '../../components/layout/UserSidebar'; // Your pre-built sidebar component

/**
 * The main layout for the authenticated user section.
 * It includes the persistent UserSidebar and a content area for nested routes like MyLockersPage.
 */
const UserDashboardLayout = () => {
  // This layout structure is very similar to the AdminDashboardLayout,
  // demonstrating a reusable pattern for creating dashboard interfaces.
  return (
    <Box sx={{ display: 'flex' }}>
      {/* Renders the user-specific navigation sidebar */}
      <UserSidebar />

      {/* This is the main content area for the user pages */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - 240px)` }, // Adjusts width for the sidebar
        }}
      >
        {/* The Toolbar adds vertical space to ensure content isn't hidden by the top Navbar */}
        <Toolbar />
        
        {/* The Outlet component from react-router-dom renders the active child route here.
            This is where MyLockersPage, SettingsPage, etc., will be displayed. */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default UserDashboardLayout;