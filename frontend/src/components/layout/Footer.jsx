import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

/**
 * A consistent footer component for the application.
 * It displays copyright information and important links.
 */
const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3, // Padding top and bottom
        px: 2, // Padding left and right
        mt: 'auto', // Pushes the footer to the bottom of the page content
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {'© '}
            {new Date().getFullYear()}
            {' LockBank. All rights reserved.'}
          </Typography>
          <Box>
            <Link component={RouterLink} to="/privacy-policy" variant="body2" sx={{ ml: 2 }}>
              Privacy Policy
            </Link>
            <Link component={RouterLink} to="/terms-of-service" variant="body2" sx={{ ml: 2 }}>
              Terms of Service
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;