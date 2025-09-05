import React from 'react';
import { Box, Typography, Paper, Grid, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import LockIcon from '@mui/icons-material/Lock';
import VpnKeyIcon from '@mui/icons-material/VpnKey';

/**
 * The main dashboard page for a logged-in user.
 * Displays their locker details and provides the entry point to the locker access flow.
 */
const MyLockersPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Access the logged-in user's data from the context

  const handleOpenLocker = () => {
    navigate('/locker/locker-access'); // Navigate to the start of the access flow
  };

  // The backend should provide locker details nested within the user object
  const lockerNumber = user?.locker?.locker_number || 'Not Assigned';
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome back, {user?.full_name}!
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Here are the details for your assigned secure locker.
      </Typography>

      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          borderRadius: 2, 
          maxWidth: '700px'
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
            <LockIcon sx={{ fontSize: 80, color: 'primary.main', mb: 1 }} />
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              Locker #{lockerNumber}
            </Typography>
            <Typography variant="subtitle1" color="secondary.main" sx={{ fontWeight: 'medium' }}>
              Status: {user?.status}
            </Typography>
          </Grid>

          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>
              Account Details
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography><strong>Full Name:</strong> {user?.full_name}</Typography>
            <Typography><strong>Email ID:</strong> {user?.email}</Typography>
            <Typography sx={{ mb: 3 }}><strong>Phone Number:</strong> {user?.phone_number}</Typography>
            
            <Button
              variant="contained"
              size="large"
              startIcon={<VpnKeyIcon />}
              onClick={handleOpenLocker}
              disabled={lockerNumber === 'Not Assigned'}
            >
              Open My Locker
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default MyLockersPage;