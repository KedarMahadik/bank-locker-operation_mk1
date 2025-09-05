import { createTheme } from '@mui/material/styles';

// This is the central theme that will be applied to the entire application.
// It uses Material-UI's theme creation utility to define our custom design system.

const theme = createTheme({
  // 1. COLOR PALETTE
  // We define our primary, secondary, and system colors here.
  palette: {
    primary: {
      main: '#0D47A1', // Deep, trustworthy blue
    },
    secondary: {
      main: '#2E7D32', // Secure, positive green
    },
    error: {
      main: '#D32F2F', // Standard error red
    },
    warning: {
      main: '#FFA000', // Standard warning amber
    },
    success: {
      main: '#2E7D32', // Same as our accent green
    },
    background: {
      default: '#F5F5F5', // Light gray for page backgrounds
      paper: '#FFFFFF',   // White for cards, modals, etc.
    },
    text: {
      primary: '#212121',   // Dark charcoal for main text
      secondary: '#757575', // Medium gray for subtext
    },
  },

  // 2. TYPOGRAPHY
  // We define the font and its hierarchy (headings, body text, etc.).
  typography: {
    fontFamily: [
      'Inter',
      'Roboto',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Arial',
      'sans-serif',
    ].join(','),
    h3: {
      fontWeight: 700, // Bold
      fontSize: '2.2rem',
    },
    h4: {
      fontWeight: 700,
      fontSize: '1.8rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none', // Prevents buttons from being ALL CAPS
      fontWeight: 600,
    },
  },

  // 3. COMPONENT OVERRIDES
  // We can define default styles for MUI components to ensure consistency.
  components: {
    // Style override for all buttons
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Slightly rounded corners for a modern look
          padding: '10px 20px',
        },
      },
    },
    // Style override for all text input fields
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    // Style override for all cards
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)', // A subtle shadow
        },
      },
    },
  },
});

export default theme;