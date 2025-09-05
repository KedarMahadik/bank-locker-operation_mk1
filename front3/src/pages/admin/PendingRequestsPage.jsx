import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert as MuiAlert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { getPendingRequests, approveRequest } from '../../services/adminService';
import Button from '../../components/common/Button';
import PendingActionsIcon from '@mui/icons-material/PendingActions';

/**
 * Displays a list of pending user applications for admin review and action.
 */
const PendingRequestsPage = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch pending requests when the component mounts
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const { data } = await getPendingRequests();
        setRequests(data);
      } catch (err) {
        setError('Failed to fetch pending applications. The server might be down or you may not be authorized.');
        toast.error('Could not load data.');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []); // The empty dependency array ensures this runs only once on mount

  const handleApprove = async (userId) => {
    // We can add a confirmation modal here in a real app
    try {
      const response = await approveRequest(userId);
      toast.success(response.data.message || 'User approved, activation process initiated.');
      
      // Optimistically update the UI by removing the approved user from the list
      setRequests((prevRequests) => prevRequests.filter((req) => req.id !== userId));
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to approve the user.');
    }
  };

  const handleReview = (userId) => {
    // Navigate to a detailed review page (which you can build next)
    navigate(`/admin/review/${userId}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <MuiAlert severity="error">{error}</MuiAlert>;
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <PendingActionsIcon sx={{ mr: 1 }} />
        Pending User Applications
      </Typography>

      {requests.length === 0 ? (
        <Typography>No pending applications at this time.</Typography>
      ) : (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer>
            <Table stickyHeader aria-label="pending requests table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Request ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Applicant Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {requests.map((request) => (
                  <TableRow hover key={request.id}>
                    <TableCell>{request.id}</TableCell>
                    <TableCell>{request.full_name}</TableCell>
                    <TableCell>{request.email}</TableCell>
                    <TableCell align="right">
                      <Button 
                        variant="outlined" 
                        size="small" 
                        onClick={() => handleReview(request.id)}
                        sx={{ mr: 1 }}
                      >
                        Review
                      </Button>
                      <Button 
                        variant="contained" 
                        color="secondary" 
                        size="small"
                        onClick={() => handleApprove(request.id)}
                      >
                        Approve
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );
};

export default PendingRequestsPage;