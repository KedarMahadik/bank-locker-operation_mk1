import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import toast from 'react-hot-toast';

import { unlockLocker } from '../../services/userService';
import PinInput from '../../components/auth/PinInput';
import OtpInput from '../../components/auth/OtpInput';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';

/**
 * The second step in the locker access flow: PIN and OTP Entry.
 * Collects the user's PIN and the received OTP and sends them for final verification.
 * @param {{onSuccess: () => void}} props
 */
const PinOtpEntryPage = ({ onSuccess }) => {
  const [pin, setPin] = useState('');
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // A countdown timer for the OTP
  const [counter, setCounter] = useState(300); // 5 minutes in seconds

  useEffect(() => {
    if (counter === 0) return;
    const timer = setTimeout(() => setCounter(counter - 1), 1000);
    return () => clearTimeout(timer);
  }, [counter]);


  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await unlockLocker(pin, otp);
      toast.success('Access Granted!');
      onSuccess(); // Signal to the parent to move to the final step
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Verification failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = pin.length === 4 && otp.length === 6;
  const minutes = Math.floor(counter / 60);
  const seconds = counter % 60;

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 2, textAlign: 'center' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Step 2: Final Verification
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        An OTP has been sent to your registered mobile number.
      </Typography>
      
      <form onSubmit={handleSubmit}>
        <Box sx={{ my: 3 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Enter Your 4-Digit PIN</Typography>
          <PinInput value={pin} onChange={setPin} />
        </Box>

        <Box sx={{ my: 3 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Enter Your 6-Digit OTP</Typography>
          <OtpInput value={otp} onChange={setOtp} />
          <Typography variant="caption" color="text.secondary">
            OTP expires in: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
          </Typography>
        </Box>
        
        {error && <Alert severity="error" sx={{ mt: 2, textAlign: 'left' }}>{error}</Alert>}

        <Button
          type="submit"
          variant="contained"
          color="secondary"
          fullWidth
          size="large"
          disabled={!isFormValid || isSubmitting || counter === 0}
          sx={{ mt: 3 }}
        >
          {isSubmitting ? 'Verifying...' : 'Unlock Locker'}
        </Button>
      </form>
    </Paper>
  );
};

export default PinOtpEntryPage;