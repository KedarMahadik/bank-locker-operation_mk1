import React from 'react';
import { TextField } from '@mui/material';
import { styled } from '@mui/material/styles';

// We use the `styled` utility to create a custom TextField component.
// This approach allows us to define our specific styles once.
const StyledTextField = styled(TextField)(({ theme }) => ({
  // Targeting the root of the outlined input
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.shape.borderRadius, // Use the border radius from our theme
    
    // Style for the border when the input is NOT focused
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.grey[300],
    },
    
    // Style for the border on hover
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.light,
    },
    
    // Style for the border when the input IS focused
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.main,
      borderWidth: '2px',
    },
  },
  
  // Targeting the input's label
  '& .MuiInputLabel-root': {
    color: theme.palette.text.secondary,
    
    // Style for the label when the input IS focused
    '&.Mui-focused': {
      color: theme.palette.primary.main,
      fontWeight: 500,
    },
  },
}));

// This is the final component we'll export.
// We set `variant="outlined"` and `fullWidth` as standard defaults for our app.
// It accepts all other props (`...props`) so we can still set labels, types, etc.
const InputField = (props) => {
  return <StyledTextField variant="outlined" fullWidth {...props} />;
};

export default InputField;