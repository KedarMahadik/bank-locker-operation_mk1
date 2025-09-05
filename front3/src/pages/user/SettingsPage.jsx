import React from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';

import { changePin } from '../../services/userService';
import Button from '../../components/common/Button';
import PinInput from '../../components/auth/PinInput';
import SettingsIcon from '@mui/icons-material/Settings';

const ChangePinSchema = Yup.object().shape({
  oldPin: Yup.string()
    .matches(/^[0-9]{4}$/, 'PIN must be 4 digits')
    .required('Current PIN is required'),
  newPin: Yup.string()
    .matches(/^[0-9]{4}$/, 'New PIN must be 4 digits')
    .required('New PIN is required')
    .notOneOf([Yup.ref('oldPin'), null], 'New PIN must be different from the old PIN'),
  confirmPin: Yup.string()
    .oneOf([Yup.ref('newPin'), null], 'PINs must match')
    .required('Please confirm your new PIN'),
});

/**
 * User settings page, starting with the ability to change the locker PIN.
 */
const SettingsPage = () => {

  const handleChangePin = async (values, { setSubmitting, resetForm }) => {
    try {
      await changePin({ oldPin: values.oldPin, newPin: values.newPin });
      toast.success('Your Locker PIN has been updated successfully!');
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to change PIN. Please check your current PIN.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <SettingsIcon sx={{ mr: 1 }} />
        Account Settings
      </Typography>

      <Paper sx={{ p: 4, maxWidth: '600px', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>Change Your Locker PIN</Typography>
        <Divider sx={{ mb: 3 }} />

        <Formik
          initialValues={{ oldPin: '', newPin: '', confirmPin: '' }}
          validationSchema={ChangePinSchema}
          onSubmit={handleChangePin}
        >
          {({ isSubmitting, errors, touched, setFieldValue }) => (
            <Form>
              <Box mb={3}>
                <Typography gutterBottom>Current PIN</Typography>
                <Field name="oldPin" component={PinInput} />
                {errors.oldPin && touched.oldPin && <Typography color="error" variant="caption" sx={{ display: 'block', textAlign: 'center', mt:1 }}>{errors.oldPin}</Typography>}
              </Box>

              <Box mb={3}>
                <Typography gutterBottom>New PIN</Typography>
                <Field name="newPin" component={PinInput} />
                {errors.newPin && touched.newPin && <Typography color="error" variant="caption" sx={{ display: 'block', textAlign: 'center', mt:1 }}>{errors.newPin}</Typography>}
              </Box>

              <Box mb={3}>
                <Typography gutterBottom>Confirm New PIN</Typography>
                <Field name="confirmPin" component={PinInput} />
                {errors.confirmPin && touched.confirmPin && <Typography color="error" variant="caption" sx={{ display: 'block', textAlign: 'center', mt:1 }}>{errors.confirmPin}</Typography>}
              </Box>

              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Updating...' : 'Update PIN'}
              </Button>
            </Form>
          )}
        </Formik>
      </Paper>
    </Box>
  );
};

export default SettingsPage;