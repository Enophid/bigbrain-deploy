import { useState } from 'react';
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
  Box,
} from '@mui/material';
import ApiCall from './apiCall';
import LogoutIcon from '@mui/icons-material/Logout';

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
        'POST',
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
      <Tooltip title={tooltipTitle} arrow placement='bottom'>
        <Button
          variant={isMobile ? 'text' : 'contained'}
          color='error'
          onClick={handleOpenDialog}
          startIcon={
            <LogoutIcon
              sx={{
                fontSize: { xs: 20, sm: 22, md: 24 },
                color: 'inherit',
              }}
            />
          }
          size={isMobile ? 'small' : 'medium'}
          aria-label='Logout from BigBrain'
          sx={{
            borderRadius: 8,
            fontWeight: 600,
            p: { xs: '6px 10px', sm: '8px 16px' },
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            whiteSpace: 'nowrap',
            minWidth: { xs: '32px', sm: '100px' },
            transition: 'all 0.3s',
            boxShadow: '0 4px 12px rgba(211, 47, 47, 0.3)',
            '&:hover': {
              backgroundColor: theme.palette.error.dark,
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 16px rgba(211, 47, 47, 0.4)',
            },
            '&:focus-visible': {
              outline: `2px solid ${theme.palette.error.main}`,
              outlineOffset: '2px',
            },
            background: isMobile ? 'transparent' : 'linear-gradient(45deg, #d32f2f 30%, #f44336 90%)',
          }}
        >
          {buttonLabel}
        </Button>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleCloseDialog}
        aria-describedby='logout-confirmation-dialog'
        slots={{
          paper: 'div',
          backdrop: 'div',
        }}
        slotProps={{
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
          },
          backdrop: {
            style: {
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(6px)',
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
              id='logout-confirmation-dialog'
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
                onClick={handleCloseDialog}
                variant='outlined'
                sx={{ borderRadius: 2 }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleLogout}
                variant='contained'
                color='primary'
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
    </>
  );
}
