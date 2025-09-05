import React from 'react';
import { Alert as MuiAlert, AlertTitle } from '@mui/material';
import { styled } from '@mui/material/styles';

// We can apply some consistent styling to the base MUI Alert component.
const StyledAlert = styled(MuiAlert)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  // A subtle border to make it stand out slightly
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: 'none',
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

/**
 * A reusable component for displaying styled alerts.
 * @param {object} props - The component props.
 * @param {'success' | 'error' | 'warning' | 'info'} props.severity - The type of alert.
 * @param {string} [props.title] - An optional bolded title for the alert.
 * @param {React.ReactNode} props.children - The main content/message of the alert.
 */
const Alert = ({ severity, title, children }) => {
  return (
    <StyledAlert severity={severity}>
      {title && <AlertTitle>{title}</AlertTitle>}
      {children}
    </StyledAlert>
  );
};

export default Alert;