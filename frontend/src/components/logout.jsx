import { useState, forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tooltip,
  Slide,
  Box,
} from '@mui/material';
import { ApiCall } from './apiCall';
import LogoutIcon from '@mui/icons-material/Logout';

// Transition effect for the dialog
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Logout() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const data = await ApiCall(
        '/admin/auth/logout',
        { token: localStorage.getItem('token') },
        'POST'
      );
      if (data.error) {
        throw new Error(data.error || 'Logout failed');
      } else {
        localStorage.removeItem('token');
        navigate('/login');
        setIsLoggingOut(false);
        setOpen(false);
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const buttonLabel = isMobile ? '' : 'Logout';
  const tooltipTitle = isMobile ? 'Logout' : 'Click to log out of your account';

  return (
    <>
      <Tooltip title={tooltipTitle} arrow placement="bottom">
        <Button
          variant={isMobile ? 'text' : 'outlined'}
          color="secondary"
          onClick={handleOpenDialog}
          startIcon={
            <LogoutIcon
              sx={{
                fontSize: { xs: 18, sm: 20, md: 24 },
              }}
            />
          }
          size={isMobile ? 'small' : 'medium'}
          aria-label="Logout from BigBrain"
          sx={{
            borderRadius: 2,
            fontWeight: 500,
            p: { xs: '4px 8px', sm: '6px 16px' },
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            whiteSpace: 'nowrap',
            minWidth: { xs: '32px', sm: '100px' },
            transition: 'all 0.2s',
            '&:hover': {
              backgroundColor: theme.palette.secondary.light,
              transform: 'translateY(-2px)',
              boxShadow: 2,
            },
            '&:focus-visible': {
              outline: `2px solid ${theme.palette.secondary.main}`,
              outlineOffset: '2px',
            },
          }}
        >
          {buttonLabel}
        </Button>
      </Tooltip>

      <Dialog
        open={open}
        slots={{
          transition: Transition,
          paper: 'div',
          backdrop: 'div',
        }}
        slotProps={{
          transition: { direction: 'up' },
          paper: {
            sx: {
              borderRadius: 3,
              width: { xs: '85%', sm: 'auto' },
              p: { xs: 1, sm: 1 },
              boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.25)',
              transform: 'translateY(0)',
              maxWidth: '400px',
              mx: 'auto',
              position: 'relative',
              zIndex: 1300,
              border: '2px solid',
              borderColor: (theme) => theme.palette.secondary.main,
              backgroundColor: 'white',
            },
          },
          backdrop: {
            sx: {
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(6px)',
            },
          },
        }}
        keepMounted
        onClose={handleCloseDialog}
        aria-describedby="logout-confirmation-dialog"
        sx={{
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
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

          <DialogActions sx={{ px: 2, pb: 2 }}>
            <Button
              onClick={handleCloseDialog}
              variant="outlined"
              sx={{ borderRadius: 2 }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleLogout}
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
      </Dialog>
    </>
  );
}
