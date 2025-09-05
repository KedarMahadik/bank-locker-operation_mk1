import React from 'react';
import { Box, Typography, Paper, Divider, MenuItem } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';

import { applyForNewLocker } from '../../services/userService';
import Button from '../../components/common/Button';
import InputField from '../../components/common/InputField';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const ApplicationSchema = Yup.object().shape({
  lockerType: Yup.string().required('Please select a locker type'),
  reason: Yup.string()
    .min(10, 'Please provide a brief reason (at least 10 characters)')
    .max(200, 'Reason cannot exceed 200 characters')
    .required('A reason for the application is required'),
});

/**
 * A form for existing users to apply for an additional locker.
 */
const ApplyForLockerPage = () => {

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await applyForNewLocker(values);
      toast.success('Your application for a new locker has been submitted for review!');
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to submit application.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <AddCircleOutlineIcon sx={{ mr: 1 }} />
        Apply for an Additional Locker
      </Typography>

      <Paper sx={{ p: 4, maxWidth: '700px', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>New Locker Request Form</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Please fill out the form below. Your application will be reviewed by our team, and you will be notified via email about the status.
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Formik
          initialValues={{ lockerType: '', reason: '' }}
          validationSchema={ApplicationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form>
              <Box mb={3}>
                <Field
                  as={InputField}
                  name="lockerType"
                  label="Select Locker Type"
                  select
                  error={touched.lockerType && !!errors.lockerType}
                  helperText={touched.lockerType && errors.lockerType}
                >
                  <MenuItem value="Small">Small (S)</MenuItem>
                  <MenuItem value="Medium">Medium (M)</MenuItem>
                  <MenuItem value="Large">Large (L)</MenuItem>
                </Field>
              </Box>

              <Box mb={3}>
                <Field
                  as={InputField}
                  name="reason"
                  label="Reason for Application"
                  multiline
                  rows={4}
                  error={touched.reason && !!errors.reason}
                  helperText={touched.reason && errors.reason}
                />
              </Box>

              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </Button>
            </Form>
          )}
        </Formik>
      </Paper>
    </Box>
  );
};

export default ApplyForLockerPage;