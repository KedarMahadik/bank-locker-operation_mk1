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

import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

// MODIFIED: Changed path for "My Lockers" to be the main user route
const navItems = [
  { text: 'My Lockers', icon: <DashboardIcon />, path: '/user' },
  { text: 'Apply for Locker', icon: <AddCircleOutlineIcon />, path: '/user/apply' },
  { text: 'Manage Nominees', icon: <PeopleIcon />, path: '/user/nominees' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/user/settings' },
];

const drawerWidth = 240;

const UserSidebar = () => {
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
                // Using end={true} for the main dashboard link
                end={item.path === '/user'}
                style={({ isActive }) => ({
                  backgroundColor: isActive ? 'rgba(13, 71, 161, 0.08)' : 'transparent',
                  color: isActive ? '#0D47A1' : 'inherit',
                  borderRight: isActive ? '3px solid #0D47A1' : 'none',
                })}
              >
                {/* === THE CRITICAL FIX IS HERE === */}
                {/* The icon color now correctly inherits from its parent */}
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

export default UserSidebar;
