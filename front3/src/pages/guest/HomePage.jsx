import React from 'react';
import { Container, Typography, Stack, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import Button from '../../components/common/Button';
import ShieldIcon from '@mui/icons-material/Shield';

/**
 * The main landing page for the LockBank application.
 * It provides a welcoming message and primary navigation for new and returning users.
 */
const HomePage = () => {
  return (
    <Container maxWidth="md" sx={{ textAlign: 'center', mt: { xs: 4, sm: 8 } }}>
      <Box sx={{ mb: 4 }}>
        <ShieldIcon sx={{ fontSize: 80, color: 'primary.main' }} />
      </Box>

      <Typography 
        variant="h3" 
        component="h1" 
        gutterBottom 
        sx={{ fontWeight: 700 }}
      >
        The Future of Secure Locker Access
      </Typography>

      <Typography 
        variant="h6" 
        color="text.secondary" 
        sx={{ mb: 5, maxWidth: '600px', mx: 'auto' }}
      >
        Experience seamless and secure access to your bank locker with our state-of-the-art multi-factor authentication system, combining face recognition and OTP verification.
      </Typography>

      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        spacing={2} 
        justifyContent="center"
      >
        <Button
          variant="contained"
          size="large"
          component={RouterLink}
          to="/register"
          sx={{ minWidth: '250px' }}
        >
          Register for a New Locker
        </Button>
        <Button
          variant="outlined"
          size="large"
          component={RouterLink}
          to="/auth/login"
          sx={{ minWidth: '250px' }}
        >
          User Login
        </Button>
      </Stack>
    </Container>
  );
};

export default HomePage;