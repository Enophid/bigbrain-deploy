import { Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';
const AlertMessage = ({ message, show }) => {
  if (!show) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        width: { xs: '90%', sm: '60%', md: '50%' },
        maxWidth: 600,
        backgroundColor: 'error.main',
        color: 'white',
        padding: 2,
        borderRadius: 2,
        boxShadow: 3,
        textAlign: 'center',
      }}
    >
      <Typography variant="body1">{message}</Typography>
    </Box>
  );
};

export default AlertMessage; 

AlertMessage.propTypes = {
  message: PropTypes.string,
  show: PropTypes.bool.isRequired
}; 