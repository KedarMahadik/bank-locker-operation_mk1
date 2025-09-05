import React from 'react';
import { Box, Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../../components/layout/AdminSidebar';

/**
 * The main layout for the admin section of the application.
 * It includes the persistent AdminSidebar and a content area for nested routes.
 */
const AdminDashboardLayout = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      {/* The persistent sidebar for navigation */}
      <AdminSidebar />

      {/* The main content area where different admin pages will be rendered */}
      <Box
        component="main"
        sx={{
          flexGrow: 1, // Allows the content area to take up the remaining space
          p: 3, // Adds padding to the content
          width: { sm: `calc(100% - 240px)` }, // Adjust width to account for the sidebar
        }}
      >
        {/* Toolbar provides a necessary spacing offset from the top Navbar */}
        <Toolbar /> 
        
        {/* Outlet is a placeholder from react-router-dom. It will render the 
            specific child route component (e.g., PendingRequestsPage) here. */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminDashboardLayout;