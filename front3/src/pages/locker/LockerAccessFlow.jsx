import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FaceAuthPage from './FaceAuthPage';
import PinOtpEntryPage from './PinOtpEntryPage';
import LockerUnlockedPage from './LockerUnlockedPage';
import { Container } from '@mui/material';

/**
 * Parent component that orchestrates the multi-step locker access flow.
 * It manages the current step and renders the appropriate child component.
 */
const LockerAccessFlow = () => {
  // The 'flowStep' state determines which component to show the user.
  const [flowStep, setFlowStep] = useState('face-auth'); // Initial step
  const navigate = useNavigate();

  // This function is passed down to FaceAuthPage and is called upon success.
  const handleFaceVerified = () => {
    setFlowStep('pin-otp'); // Transition to the next step
  };

  // This function is passed down to PinOtpEntryPage and is called upon success.
  const handleUnlockSuccess = () => {
    setFlowStep('unlocked'); // Transition to the final success step
  };

  // This function is passed down to LockerUnlockedPage to end the flow.
  const handleFlowComplete = () => {
    navigate('/user/dashboard'); // Go back to the user dashboard
  };
  
  const renderStep = () => {
    switch (flowStep) {
      case 'face-auth':
        return <FaceAuthPage onSuccess={handleFaceVerified} />;
      case 'pin-otp':
        return <PinOtpEntryPage onSuccess={handleUnlockSuccess} />;
      case 'unlocked':
        return <LockerUnlockedPage onComplete={handleFlowComplete} />;
      default:
        // If state is invalid, navigate back to the dashboard
        navigate('/user/dashboard');
        return null;
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      {renderStep()}
    </Container>
  );
};

export default LockerAccessFlow;