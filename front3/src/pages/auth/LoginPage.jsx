import React from 'react';
import { Container, Paper, Typography, Box, Link } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import toast from 'react-hot-toast';

import { login } from '../../services/authService';
import useAuth from '../../hooks/useAuth';
import InputField from '../../components/common/InputField';
import Button from '../../components/common/Button';

/**
 * The login page for regular users.
 * Handles form validation, API submission, and conditional redirection
 * based on the user's `is_first_login` status.
 */
const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginAction } = useAuth();

  // This determines where to redirect the user after a successful login.
  // If they were trying to access a protected page, we'll send them there.
  const from = location.state?.from?.pathname || '/user/dashboard';

  const initialValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      const { data } = await login(values.email, values.password);
      
      // Update the global state with the user data from the response
      loginAction(data);
      toast.success('Login successful!');

      // CRITICAL: Check the flag from the backend response
      if (data.user.is_first_login) {
        navigate('/account/setup', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Login failed. Please check your credentials.';
      toast.error(errorMessage);
      setFieldError('password', errorMessage); // Show error on a field
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          User Login
        </Typography>
        <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
          Access your secure locker dashboard.
        </Typography>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form>
              <Box sx={{ mb: 2 }}>
                <Field
                  name="email"
                  as={InputField} // Use your custom styled InputField
                  label="Email Address"
                  type="email"
                  error={touched.email && !!errors.email}
                  helperText={touched.email && errors.email}
                />
              </Box>
              <Box sx={{ mb: 3 }}>
                <Field
                  name="password"
                  as={InputField}
                  label="Password"
                  type="password"
                  error={touched.password && !!errors.password}
                  helperText={touched.password && errors.password}
                />
              </Box>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing In...' : 'Sign In'}
              </Button>
            </Form>
          )}
        </Formik>
        
        <Typography variant="body2" align="center" sx={{ mt: 3 }}>
          Don't have an account?{' '}
          <Link component={RouterLink} to="/register" fontWeight="medium">
            Register here
          </Link>
        </Typography>

      </Paper>
    </Container>
  );
};

export default LoginPage;