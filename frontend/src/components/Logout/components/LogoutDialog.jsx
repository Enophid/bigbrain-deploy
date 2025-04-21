import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Box,
  Fade,
  useTheme,
} from '@mui/material';
import PropTypes from 'prop-types';

export default function LogoutDialog({ open, isLoggingOut, onClose, onConfirm }) {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-describedby="logout-confirmation-dialog"
      TransitionComponent={Fade}
      slotProps={{
        transition: {
          style: {
            timeout: 300,
          },
        },
        paper: {
          style: {
            borderRadius: '12px',
            width: '85%',
            maxWidth: '400px',
            margin: '0 auto',
            padding: '4px 8px',
            boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.25)',
            border: '2px solid',
            borderColor: theme.palette.secondary.main,
            backgroundColor: 'white',
          },
          backdrop: {
            style: {
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(6px)',
            },
          },
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          textAlign: 'center',
          pt: 1,
          backgroundColor: 'white',
          borderRadius: 2,
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 600,
            fontSize: { xs: '1.1rem', sm: '1.25rem' },
            pt: 2,
            color: (theme) => theme.palette.primary.main,
          }}
        >
          Log out of BigBrain?
        </DialogTitle>

        <DialogContent>
          <DialogContentText
            id="logout-confirmation-dialog"
            sx={{
              fontSize: { xs: '0.875rem', sm: '1rem' },
              color: 'text.primary',
            }}
          >
            You will need to login again to access your quizzes and data.
          </DialogContentText>
        </DialogContent>

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <DialogActions sx={{ px: 2, pb: 2 }}>
            <Button
              onClick={onClose}
              variant="outlined"
              sx={{ borderRadius: 2 }}
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              variant="contained"
              color="primary"
              disabled={isLoggingOut}
              sx={{
                borderRadius: 2,
                boxShadow: 1,
                ml: 1,
              }}
            >
              {isLoggingOut ? 'Logging out...' : 'Yes, Logout'}
            </Button>
          </DialogActions>
        </Box>
      </Box>
    </Dialog>
  );
}

LogoutDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  isLoggingOut: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

