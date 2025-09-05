import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

/**
 * A reusable, styled modal dialog component.
 * @param {object} props
 * @param {boolean} props.open - Whether the modal is open.
 * @param {Function} props.onClose - Function to call when the modal should close.
 * @param {string} props.title - The title to display in the modal header.
 * @param {React.ReactNode} [props.actions] - Optional action buttons (e.g., Save, Cancel) to display in the footer.
 * @param {React.ReactNode} props.children - The main content to display in the modal body.
 */
const Modal = ({ open, onClose, title, actions, children }) => {
  return (
    <Dialog
      onClose={onClose}
      open={open}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 3, // Corresponds to 12px with a default 4px spacing unit
        },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, fontWeight: '600' }}>
        {title}
        {/* Adds a close button to the top right corner */}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers>
        {children}
      </DialogContent>
      
      {/* Renders the action buttons if they are provided */}
      {actions && <DialogActions sx={{ p: 2 }}>{actions}</DialogActions>}
    </Dialog>
  );
};

export default Modal;