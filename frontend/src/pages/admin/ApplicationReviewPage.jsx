import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, Divider, CircularProgress } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { getApplicationDetails, approveRequest } from '../../services/adminService';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';

/**
 * A detailed view for an admin to review a single user application.
 * It displays all submitted details and the user's photo.
 */
const ApplicationReviewPage = () => {
  const { userId } = useParams(); // Get the user ID from the URL (e.g., /admin/review/123)
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      if (!userId) return;
      try {
        setLoading(true);
        const { data } = await getApplicationDetails(userId);
        setApplication(data);
      } catch (err) {
        setError('Could not fetch application details. The application may have already been processed.');
        toast.error('Failed to load details.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [userId]);

  const handleApprove = async () => {
    try {
      const response = await approveRequest(userId);
      toast.success(response.data.message || 'User approved successfully!');
      navigate('/admin/dashboard'); // Redirect back to the dashboard
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to approve application.');
    }
  };
  
  const handleReject = () => {
      // Logic for rejecting would go here
      toast.error('Reject functionality not yet implemented.');
  }

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!application) return <Typography>No application data found.</Typography>;

  // Construct the secure image URL
  const imageUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'}/admin/requests/${userId}/image`;

  return (
    <Paper sx={{ p: 4, borderRadius: 2 }}>
      <Typography variant="h4" gutterBottom>
        Review Application: {application.full_name}
      </Typography>
      <Divider sx={{ mb: 3 }} />
      <Grid container spacing={4}>
        <Grid item xs={12} md={5} sx={{ textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>Applicant Photo</Typography>
          <Box
            component="img"
            src={imageUrl}
            alt={`Photo of ${application.full_name}`}
            sx={{
              width: '100%',
              maxWidth: '300px',
              borderRadius: '50%',
              border: '4px solid',
              borderColor: 'primary.main',
              aspectRatio: '1 / 1',
              objectFit: 'cover',
              bgcolor: 'grey.200'
            }}
          />
        </Grid>
        <Grid item xs={12} md={7}>
            <Typography variant="h6" gutterBottom>Applicant Details</Typography>
            <Box>
                <Typography variant="body1" sx={{ mb: 1 }}><strong>Full Name:</strong> {application.full_name}</Typography>
                <Typography variant="body1" sx={{ mb: 1 }}><strong>Email:</strong> {application.email}</Typography>
                <Typography variant="body1" sx={{ mb: 1 }}><strong>Phone:</strong> {application.phone_number}</Typography>
                <Typography variant="body1" sx={{ mb: 1 }}><strong>Account Number:</strong> {application.account_number}</Typography>
                <Typography variant="body1" sx={{ mb: 3 }}><strong>IFSC Code:</strong> {application.ifsc_code}</Typography>
            </Box>
             <Divider sx={{ my: 3 }} />
             <Typography variant="h6" gutterBottom>Actions</Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button variant="contained" color="secondary" onClick={handleApprove}>
                    Approve Application
                </Button>
                <Button variant="outlined" color="error" onClick={handleReject}>
                    Reject Application
                </Button>
            </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ApplicationReviewPage;