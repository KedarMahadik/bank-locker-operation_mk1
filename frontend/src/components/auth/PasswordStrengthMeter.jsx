import React, { useMemo } from 'react';
import { Box, LinearProgress, Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

// Define the password validation criteria
const passwordCriteria = [
  { test: (pwd) => pwd.length >= 8, label: 'At least 8 characters' },
  { test: (pwd) => /[a-z]/.test(pwd), label: 'At least one lowercase letter' },
  { test: (pwd) => /[A-Z]/.test(pwd), label: 'At least one uppercase letter' },
  { test: (pwd) => /[0-9]/.test(pwd), label: 'At least one number' },
  { test: (pwd) => /[^A-Za-z0-9]/.test(pwd), label: 'At least one special character' },
];

const PasswordStrengthMeter = ({ password }) => {
  // useMemo ensures that we only recalculate the strength when the password changes
  const strength = useMemo(() => {
    let score = 0;
    if (!password) return { score: 0, label: '', color: 'inherit' };

    passwordCriteria.forEach(criterion => {
      if (criterion.test(password)) {
        score++;
      }
    });

    switch (score) {
      case 1:
      case 2:
        return { score, label: 'Weak', color: 'error' }; // Error Red: #D32F2F
      case 3:
        return { score, label: 'Medium', color: 'warning' }; // Warning Amber: #FFA000
      case 4:
        return { score, label: 'Good', color: 'primary' }; // Primary Blue: #0D47A1
      case 5:
        return { score, label: 'Strong', color: 'success' }; // Accent Green: #2E7D32
      default:
        return { score: 0, label: '', color: 'inherit' };
    }
  }, [password]);
  
  const progressValue = strength.score * 20; // 5 criteria, 20% each

  return (
    <Box sx={{ width: '100%', mt: 1 }}>
      {password && (
        <>
          <LinearProgress
            variant="determinate"
            value={progressValue}
            color={strength.color}
            sx={{ height: 8, borderRadius: 5, mb: 1 }}
          />
          <Typography variant="caption" color={strength.color + '.main'} sx={{ fontWeight: 'medium' }}>
            Password Strength: {strength.label}
          </Typography>
        </>
      )}
      <List dense sx={{ mt: 1 }}>
        {passwordCriteria.map((criterion, index) => (
          <ListItem key={index} disableGutters sx={{ py: 0 }}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              {criterion.test(password) ? (
                <CheckCircleIcon color="success" sx={{ fontSize: '1rem' }} />
              ) : (
                <CancelIcon color="error" sx={{ fontSize: '1rem' }} />
              )}
            </ListItemIcon>
            <ListItemText 
              primary={criterion.label} 
              primaryTypographyProps={{ 
                fontSize: '0.8rem',
                color: criterion.test(password) ? 'text.primary' : 'text.secondary' 
              }} 
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default PasswordStrengthMeter;