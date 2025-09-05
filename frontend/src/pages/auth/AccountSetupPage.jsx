import React from 'react';
import { Container, Paper, Typography, Box, Divider } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { setupAccount } from '../../services/authService';
import useAuth from '../../hooks/useAuth';
import InputField from '../../components/common/InputField';
import Button from '../../components/common/Button';
import PinInput from '../../components/auth/PinInput';
import PasswordStrengthMeter from '../../components/auth/PasswordStrengthMeter'; // The component we created

/**
 * A secure, one-time page for new users to set their permanent password and PIN.
 */
const AccountSetupPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Get the current user's data for a personalized message

  const validationSchema = Yup.object({
    new_password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/[0-9]/, 'Password must contain at least one number')
      .matches(/[^A-Za-z0-9]/, 'Password must contain at least one special character')
      .required('New password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('new_password'), null], 'Passwords must match')
      .required('Please confirm your password'),
    new_pin: Yup.string()
      .matches(/^[0-9]{4}$/, 'PIN must be exactly 4 digits')
      .required('A 4-digit PIN is required'),
    confirmPin: Yup.string()
      .oneOf([Yup.ref('new_pin'), null], 'PINs must match')
      .required('Please confirm your PIN'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const payload = {
        new_password: values.new_password,
        new_pin: values.new_pin,
      };
      await setupAccount(payload);
      toast.success('Account secured successfully! Welcome to your dashboard.');
      navigate('/user/dashboard', { replace: true });
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Failed to update credentials. Please try again.';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Secure Your Account
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 3 }}>
          Welcome, {user?.full_name || 'User'}! As a final security step, please create your permanent password and a 4-digit locker PIN.
        </Typography>

        <Formik
          initialValues={{
            new_password: '',
            confirmPassword: '',
            new_pin: '',
            confirmPin: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched, values }) => (
            <Form>
              {/* --- Password Section --- */}
              <Typography variant="h6" sx={{ mb: 2 }}>Create Permanent Password</Typography>
              <Box sx={{ mb: 2 }}>
                <Field name="new_password" as={InputField} label="New Password" type="password" error={touched.new_password && !!errors.new_password} helperText={touched.new_password && errors.new_password} />
                <PasswordStrengthMeter password={values.new_password} />
              </Box>
              <Box sx={{ mb: 3 }}>
                <Field name="confirmPassword" as={InputField} label="Confirm New Password" type="password" error={touched.confirmPassword && !!errors.confirmPassword} helperText={touched.confirmPassword && errors.confirmPassword} />
              </Box>

              <Divider sx={{ my: 4 }} />

              {/* --- PIN Section --- */}
              <Typography variant="h6" sx={{ mb: 2 }}>Create 4-Digit Locker PIN</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>This will be used for final verification when accessing your locker.</Typography>
              <Box sx={{ mb: 2 }}>
                <Field name="new_pin" component={PinInput} />
                {touched.new_pin && errors.new_pin && <Typography color="error" variant="caption" sx={{ display: 'block', textAlign: 'center' }}>{errors.new_pin}</Typography>}
              </Box>
              <Box sx={{ mb: 3 }}>
                <Field name="confirmPin" component={PinInput} />
                 {touched.confirmPin && errors.confirmPin && <Typography color="error" variant="caption" sx={{ display: 'block', textAlign: 'center' }}>{errors.confirmPin}</Typography>}
              </Box>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isSubmitting}
                sx={{ mt: 2 }}
              >
                {isSubmitting ? 'Securing Account...' : 'Save and Secure My Account'}
              </Button>
            </Form>
          )}
        </Formik>
      </Paper>
    </Container>
  );
};

export default AccountSetupPage;