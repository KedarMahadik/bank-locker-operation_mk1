import React, { useEffect } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import useAuth from '../../hooks/useAuth';

/**
 * The final success screen in the locker access flow.
 * Displays an animated success message and then redirects the user.
 * @param {{onComplete: () => void}} props
 */
const LockerUnlockedPage = ({ onComplete }) => {
  const { user } = useAuth();
  const lockerNumber = user?.locker?.locker_number || 'Your Locker';

  // After the component mounts, wait 5 seconds and then call the onComplete
  // function (which navigates back to the dashboard).
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 5000); // 5 seconds

    // Cleanup function to clear the timer if the component is unmounted early
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 4, 
        borderRadius: 2, 
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
      }}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 20,
          delay: 0.2,
        }}
      >
        <LockOpenIcon sx={{ fontSize: 100, color: 'success.main' }} />
      </motion.div>
      
      <Typography variant="h4" component="h1" sx={{ mt: 3, fontWeight: 'bold' }}>
        Access Granted
      </Typography>

      <Typography variant="h6" color="text.secondary" sx={{ mt: 1 }}>
        {lockerNumber} is now unlocked.
      </Typography>

      <Typography variant="body2" sx={{ mt: 4 }}>
        You will be automatically redirected to your dashboard shortly.
      </Typography>
    </Paper>
  );
};

export default LockerUnlockedPage;