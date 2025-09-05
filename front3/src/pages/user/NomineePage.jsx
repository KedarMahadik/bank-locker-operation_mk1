import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  CircularProgress
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';

import { getNominees, addNominee } from '../../services/userService';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import InputField from '../../components/common/InputField';
import Alert from '../../components/common/Alert';
import PeopleIcon from '@mui/icons-material/People';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const AddNomineeSchema = Yup.object().shape({
  name: Yup.string().required('Nominee name is required'),
  relationship: Yup.string().required('Relationship is required'),
  phone: Yup.string().matches(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number').required('Phone number is required'),
});

/**
 * Page for users to view and add nominees to their account.
 */
const NomineePage = () => {
  const [nominees, setNominees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchNominees = async () => {
      try {
        setLoading(true);
        // const { data } = await getNominees();
        // setNominees(data);
        // MOCK DATA until backend is ready:
        setNominees([
          { id: 1, name: 'Jane Doe', relationship: 'Spouse', phone: '9876543210' },
        ]);
      } catch (err) {
        setError('Failed to fetch nominee information.');
      } finally {
        setLoading(false);
      }
    };
    fetchNominees();
  }, []);

  const handleAddNominee = async (values, { setSubmitting, resetForm }) => {
    try {
      const { data } = await addNominee(values);
      setNominees([...nominees, data]); // Add new nominee to the list
      toast.success('Nominee added successfully!');
      resetForm();
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to add nominee.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center' }}>
          <PeopleIcon sx={{ mr: 1 }} />
          Manage Nominees
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          onClick={() => setIsModalOpen(true)}
        >
          Add Nominee
        </Button>
      </Box>

      <Paper sx={{ p: 2, borderRadius: 2 }}>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : nominees.length === 0 ? (
          <Typography sx={{ p: 2 }}>You have not added any nominees yet.</Typography>
        ) : (
          <List>
            {nominees.map((nominee, index) => (
              <React.Fragment key={nominee.id}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <PeopleIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={nominee.name}
                    secondary={`${nominee.relationship} - ${nominee.phone}`}
                  />
                </ListItem>
                {index < nominees.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>

      {/* --- Add Nominee Modal --- */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add a New Nominee"
      >
        <Formik
          initialValues={{ name: '', relationship: '', phone: '' }}
          validationSchema={AddNomineeSchema}
          onSubmit={handleAddNominee}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form>
              <Box sx={{ mb: 2, mt: 1 }}>
                <Field as={InputField} name="name" label="Full Name" error={touched.name && !!errors.name} helperText={touched.name && errors.name} />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Field as={InputField} name="relationship" label="Relationship (e.g., Spouse, Son)" error={touched.relationship && !!errors.relationship} helperText={touched.relationship && errors.relationship} />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Field as={InputField} name="phone" label="Phone Number" error={touched.phone && !!errors.phone} helperText={touched.phone && errors.phone} />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 3 }}>
                <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" variant="contained" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Nominee'}
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Modal>
    </Box>
  );
};

export default NomineePage;