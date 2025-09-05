import React, { useState } from 'react';
import { Container, Typography, Box, Paper, Stepper, Step, StepLabel } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { register } from '../../services/authService';
import InputField from '../../components/common/InputField';
import Button from '../../components/common/Button';
import WebcamCapture from '../../components/auth/WebcamCapture';
import Spinner from '../../components/common/Spinner';

// Define the steps for the visual stepper
const steps = ['Your Details', 'Capture Face', 'Review & Submit'];

// Define the validation schema for the user details form
const detailsSchema = Yup.object({
  full_name: Yup.string().max(100, 'Name is too long').required('Full name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  phone_number: Yup.string()
    .matches(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number')
    .required('Phone number is required'),
  account_number: Yup.string().matches(/^[0-9]{9,18}$/, 'Enter a valid account number').required('Bank account number is required'),
  ifsc_code: Yup.string()
    .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code format')
    .required('IFSC code is required'),
});

/**
 * A multi-step component to handle the new user registration process.
 */
const RegisterFlow = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  // Called when the user details form is submitted
  const handleDetailsSubmit = (values) => {
    setFormData(values);
    handleNext();
  };

  // Called when a photo is captured in the WebcamCapture component
  const handleCapture = (imageSrc) => {
    setCapturedImage(imageSrc);
    toast.success('Photo captured!');
    handleNext();
  };
  
  // Called when the final "Submit Application" button is clicked
  const handleFinalSubmit = async () => {
    if (!formData || !capturedImage) {
      toast.error('Something went wrong. Please start over.');
      return;
    }
    setIsLoading(true);
    
    const payload = {
      ...formData,
      base64_image: capturedImage,
    };

    try {
      await register(payload);
      toast.success('Application submitted successfully! It is now under review by our team.', {
        duration: 5000,
      });
      navigate('/'); // Redirect to homepage after successful submission
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Registration failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to render the content for the current step
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Formik
            initialValues={{
              full_name: '', email: '', phone_number: '', account_number: '', ifsc_code: '',
            }}
            validationSchema={detailsSchema}
            onSubmit={handleDetailsSubmit}
          >
            {({ errors, touched }) => (
              <Form>
                <Field name="full_name" label="Full Name (as per bank records)" as={InputField} error={touched.full_name && !!errors.full_name} helperText={touched.full_name && errors.full_name} sx={{ mb: 2 }} />
                <Field name="email" label="Email Address (This will be your Login ID)" type="email" as={InputField} error={touched.email && !!errors.email} helperText={touched.email && errors.email} sx={{ mb: 2 }} />
                <Field name="phone_number" label="10-Digit Mobile Number" as={InputField} error={touched.phone_number && !!errors.phone_number} helperText={touched.phone_number && errors.phone_number} sx={{ mb: 2 }} />
                <Field name="account_number" label="Bank Account Number" as={InputField} error={touched.account_number && !!errors.account_number} helperText={touched.account_number && errors.account_number} sx={{ mb: 2 }} />
                <Field name="ifsc_code" label="IFSC Code" as={InputField} error={touched.ifsc_code && !!errors.ifsc_code} helperText={touched.ifsc_code && errors.ifsc_code} sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button variant="contained" type="submit">Next: Capture Face</Button>
                </Box>
              </Form>
            )}
          </Formik>
        );
      case 1:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h6" align="center" sx={{ mb: 2 }}>Position your face in the oval and ensure good lighting.</Typography>
            <WebcamCapture onCapture={handleCapture} />
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', width: '100%', mt: 2 }}>
              <Button onClick={handleBack}>Back to Details</Button>
            </Box>
          </Box>
        );
      case 2:
        return (
           <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" sx={{ mb: 2 }}>Review Your Application</Typography>
            <Paper variant="outlined" sx={{ p: 2, textAlign: 'left', mb: 3, display: 'inline-block' }}>
                <Typography><strong>Full Name:</strong> {formData?.full_name}</Typography>
                <Typography><strong>Email:</strong> {formData?.email}</Typography>
                <Typography><strong>Phone:</strong> {formData?.phone_number}</Typography>
                <Typography><strong>Account No:</strong> {formData?.account_number}</Typography>
            </Paper>
            <Box>
                <img src={capturedImage} alt="Your captured face" width="150" style={{ borderRadius: '50%', border: '3px solid var(--color-primary)' }}/>
            </Box>
            {isLoading ? <Spinner /> : (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mt: 4 }}>
                  <Button onClick={handleBack}>Back to Face Capture</Button>
                  <Button onClick={handleFinalSubmit} variant="contained" color="secondary">Confirm & Submit Application</Button>
              </Box>
            )}
          </Box>
        );
      default:
        return <Typography>Unknown step</Typography>;
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          New Locker Application
        </Typography>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {getStepContent(activeStep)}

      </Paper>
    </Container>
  );
};

export default RegisterFlow;