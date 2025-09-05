import React from 'react';
import { Button as MuiButton } from '@mui/material';
import { styled } from '@mui/material/styles';

// We use MUI's `styled` utility to create a new, custom button component.
// This `StyledButton` will have our professional branding baked into it.
const StyledButton = styled(MuiButton)(({ theme, variant }) => ({
  // Common styles for all button variants
  borderRadius: theme.shape.borderRadius, // Using the borderRadius from our theme.js
  textTransform: 'none', // As defined in our theme
  fontWeight: 600,
  padding: '10px 24px',
  boxShadow: 'none', // A flatter, more modern look
  transition: 'background-color 0.3s, border-color 0.3s',

  // Specific styles for the "contained" (solid) variant
  ...(variant === 'contained' && {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark, // A slightly darker blue on hover
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    },
  }),

  // Specific styles for the "outlined" variant
  ...(variant === 'outlined' && {
    borderColor: theme.palette.primary.main,
    color: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: 'rgba(13, 71, 161, 0.04)', // A very light blue tint on hover
      borderColor: theme.palette.primary.dark,
    },
  }),
}));

// This is the final component we'll export and use throughout the app.
// It passes all props down to our StyledButton, so we can use it just like a normal MUI Button.
const Button = (props) => {
  return <StyledButton {...props} />;
};

export default Button;