import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

/**
 * A reusable, centered loading spinner component.
 */
const Spinner = () => {
  return (
    // We use an MUI Box component with flex properties to easily center the spinner.
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: 4 // Adds some spacing around the spinner
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default Spinner;