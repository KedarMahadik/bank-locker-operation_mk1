import React from 'react';
import OtpInput from 'react-otp-input';
import { useTheme } from '@mui/material/styles';

/**
 * A reusable, styled 4-digit PIN input component that masks the input.
 * @param {object} props
 * @param {string} props.value - The current PIN value.
 * @param {Function} props.onChange - Function to call when the PIN value changes.
 */
const PinInput = ({ value, onChange }) => {
  const theme = useTheme();

  // Reusing the same styling as OtpInput for design consistency
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
      numInputs={4}
      isInputNum={true}
      // This renderInput prop is used to apply standard input attributes,
      // like `type="password"` to mask the characters.
      renderInput={(props) => <input {...props} type="password" />}
      inputStyle={inputStyle}
      focusStyle={focusStyle}
      containerStyle={{
        justifyContent: 'center',
        padding: '20px 0',
      }}
    />
  );
};

export default PinInput;