import React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { NavLink } from 'react-router-dom';

import PendingActionsIcon from '@mui/icons-material/PendingActions';
import GroupIcon from '@mui/icons-material/Group';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';

// MODIFIED: Changed path for "Pending Requests" to match the actual route
const navItems = [
  { text: 'Pending Requests', icon: <PendingActionsIcon />, path: '/admin' },
  { text: 'Manage Users', icon: <GroupIcon />, path: '/admin/users' },
  { text: 'System Settings', icon: <SettingsApplicationsIcon />, path: '/admin/settings' },
];

const drawerWidth = 240;

const AdminSidebar = () => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: '1px solid rgba(0, 0, 0, 0.12)',
        },
      }}
    >
      <Box sx={{ overflow: 'auto', mt: 8 }}>
        <List>
          {navItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                component={NavLink}
                to={item.path}
                // Using end={true} for the main dashboard link to prevent it from matching child routes
                end={item.path === '/admin'}
                style={({ isActive }) => ({
                  backgroundColor: isActive ? 'rgba(13, 71, 161, 0.08)' : 'transparent',
                  color: isActive ? '#0D47A1' : 'inherit',
                  borderRight: isActive ? '3px solid #0D47A1' : 'none',
                })}
              >
                {/* === THE CRITICAL FIX IS HERE === */}
                {/* The icon color should inherit directly from its parent ListItemButton */}
                <ListItemIcon sx={{ color: 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default AdminSidebar;
