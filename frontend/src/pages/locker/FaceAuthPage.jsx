import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import Webcam from 'react-webcam';
import toast from 'react-hot-toast';

import useAuth from '../../hooks/useAuth';
import { verifyFace } from '../../services/userService';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const videoConstraints = {
  width: 540,
  height: 540,
  facingMode: 'user',
};

/**
 * The first step in the locker access flow: Face Verification.
 * It continuously scans the user's face and calls the onSuccess prop upon successful verification.
 * @param {{onSuccess: () => void}} props
 */
const FaceAuthPage = ({ onSuccess }) => {
  const { user } = useAuth();
  const webcamRef = useRef(null);
  const [status, setStatus] = useState('scanning'); // 'scanning', 'verifying', 'success', 'error'
  const [errorMessage, setErrorMessage] = useState('');
  
  // A ref to prevent multiple simultaneous verification requests
  const isVerifying = useRef(false);

  const captureAndVerify = useCallback(async () => {
    if (webcamRef.current && !isVerifying.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) return;

      isVerifying.current = true;
      setStatus('verifying');

      try {
        await verifyFace(imageSrc);
        setStatus('success');
        toast.success('Face Verified!');
        // Call the onSuccess prop to move to the next step in the parent component
        setTimeout(onSuccess, 1000); // Wait a second to show the success message
      } catch (error) {
        // If it's just a non-match, we quietly try again.
        // If it's another error, we display it.
        const detail = error.response?.data?.detail;
        if (error.response?.status !== 401) {
            setErrorMessage(detail || 'An unexpected error occurred.');
            setStatus('error');
        } else {
             // Reset to scanning after a brief pause on non-match
            setTimeout(() => {
                isVerifying.current = false;
                setStatus('scanning');
            }, 1500);
        }
      }
    }
  }, [onSuccess]);

  // Set up an interval to continuously try and verify the face
  useEffect(() => {
    if (status === 'success' || status === 'error') return;

    const intervalId = setInterval(() => {
      captureAndVerify();
    }, 2000); // Attempt verification every 2 seconds

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [captureAndVerify, status]);
  
  const getStatusMessage = () => {
      switch(status) {
          case 'scanning':
              return 'Scanning for face...';
          case 'verifying':
              return 'Verifying...';
          case 'success':
              return 'Verified!';
          case 'error':
              return errorMessage;
          default:
              return '';
      }
  }

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 2, textAlign: 'center' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Step 1: Face Verification
      </Typography>
      <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
        Hi, {user?.full_name}! Please look directly at the camera.
      </Typography>

      <Box
        sx={{
          width: 300,
          height: 300,
          borderRadius: '50%',
          overflow: 'hidden',
          position: 'relative',
          border: (theme) => `4px solid ${status === 'success' ? theme.palette.success.main : theme.palette.primary.main}`,
          mx: 'auto',
          transition: 'border-color 0.3s',
        }}
      >
        {status === 'success' ? (
             <Box sx={{ bgcolor: 'success.main', color: 'white', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircleOutlineIcon sx={{ fontSize: 100 }} />
             </Box>
        ) : (
            <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                mirrored={true}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
        )}
      </Box>
      <Box sx={{ mt: 3, minHeight: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {status === 'verifying' ? <CircularProgress size={24} /> : null}
        <Typography variant="h6" sx={{ ml: status === 'verifying' ? 2 : 0 }}>
            {getStatusMessage()}
        </Typography>
      </Box>
    </Paper>
  );
};

export default FaceAuthPage;