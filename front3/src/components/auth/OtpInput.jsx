import React from 'react';
import OtpInput from 'react-otp-input';
import { useTheme } from '@mui/material/styles';

/**
 * A reusable, styled 6-digit OTP input component.
 * @param {object} props
 * @param {string} props.value - The current OTP value.
 * @param {Function} props.onChange - Function to call when the OTP value changes.
 */
const OtpInputComponent = ({ value, onChange }) => {
  const theme = useTheme();

  const inputStyle = {
    width: '3rem',
    height: '3rem',
    margin: '0 0.5rem',
    fontSize: '1.5rem',
    borderRadius: '8px',
    border: `1px solid ${theme.palette.grey[400]}`,
    textAlign: 'center',
    outline: 'none',
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
  };

  const focusStyle = {
    border: `2px solid ${theme.palette.primary.main}`,
  };

  return (
    <OtpInput
      value={value}
      onChange={onChange}
      numInputs={6}
      renderInput={(props) => <input {...props} />}
      inputStyle={inputStyle}
      focusStyle={focusStyle}
      containerStyle={{
        justifyContent: 'center',
        padding: '20px 0',
      }}
    />
  );
};

export default OtpInputComponent;