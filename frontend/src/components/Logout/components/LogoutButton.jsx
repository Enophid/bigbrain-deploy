import { Button, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import PropTypes from 'prop-types';

export default function LogoutButton({ onLogout }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const buttonLabel = isMobile ? '' : 'Logout';
  const tooltipTitle = isMobile ? 'Logout' : 'Click to log out of your account';

  return (
    <Tooltip title={tooltipTitle} arrow placement="bottom">
      <Button
        variant={isMobile ? 'text' : 'contained'}
        color="error"
        onClick={onLogout}
        startIcon={
          <LogoutIcon
            sx={{
              fontSize: { xs: 20, sm: 22, md: 24 },
              color: 'inherit',
            }}
          />
        }
        size={isMobile ? 'small' : 'medium'}
        aria-label="Logout from BigBrain"
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
          background: 'linear-gradient(45deg, #d32f2f 30%, #f44336 90%)',
        }}
      >
        {buttonLabel}
      </Button>
    </Tooltip>
  );
}

LogoutButton.propTypes = {
  onLogout: PropTypes.func.isRequired,
};
