import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Box, IconButton } from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import ReplayIcon from '@mui/icons-material/Replay';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const videoConstraints = {
  width: 540,
  height: 360,
  facingMode: 'user',
};

const WebcamCapture = ({ onCapture }) => {
  const webcamRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);

  const handleCapture = useCallback(() => {
    const capturedImage = webcamRef.current.getScreenshot();
    setImageSrc(capturedImage);
  }, [webcamRef]);

  const handleRecapture = () => {
    setImageSrc(null);
  };

  const handleConfirm = () => {
    if (imageSrc) {
      onCapture(imageSrc);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box
        sx={{
          width: 350,
          height: 350,
          borderRadius: '50%',
          overflow: 'hidden',
          position: 'relative',
          border: (theme) => `3px solid ${theme.palette.primary.main}`,
          bgcolor: 'black',
        }}
      >
        {imageSrc ? (
          <img src={imageSrc} alt="Captured face" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            mirrored={true}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        )}
      </Box>
      <Box sx={{ mt: 2 }}>
        {!imageSrc ? (
          <IconButton color="primary" aria-label="capture photo" onClick={handleCapture}>
            <CameraAltIcon sx={{ fontSize: 40 }} />
          </IconButton>
        ) : (
          <Box>
            <IconButton color="secondary" aria-label="recapture photo" onClick={handleRecapture} sx={{ mr: 2 }}>
              <ReplayIcon sx={{ fontSize: 40 }} />
            </IconButton>
            <IconButton color="success" aria-label="confirm photo" onClick={handleConfirm}>
              <CheckCircleIcon sx={{ fontSize: 40 }} />
            </IconButton>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default WebcamCapture;