import React from 'react';
import { Container, Paper, Typography, Box } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { adminLogin } from '../../services/adminService';
import useAuth from '../../hooks/useAuth'; // <-- IMPORT useAuth
import InputField from '../../components/common/InputField';
import Button from '../../components/common/Button';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { loginAction } = useAuth(); // <-- GET loginAction from context

  const initialValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  // === MODIFIED HANDLE SUBMIT FUNCTION ===
  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      // The adminLogin service now returns the response from the API
      const { data } = await adminLogin(values.email, values.password);
      
      // Use the loginAction to update the global auth state
      loginAction(data); 

      toast.success('Admin login successful!');
      navigate('/admin'); // Redirect to the admin dashboard
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Admin login failed.';
      toast.error(errorMessage);
      setFieldError('password', 'Invalid email or password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, textAlign: 'center' }}>
        <AdminPanelSettingsIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Portal
        </Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form>
              <Box sx={{ mb: 2, mt: 3 }}>
                <Field
                  name="email"
                  as={InputField}
                  label="Admin Email"
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
                {isSubmitting ? 'Authenticating...' : 'Log In'}
              </Button>
            </Form>
          )}
        </Formik>
      </Paper>
    </Container>
  );
};

export default AdminLoginPage;
