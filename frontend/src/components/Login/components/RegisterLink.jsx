import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * Component for the registration link at the bottom of the login form
 */
const RegisterLink = ({ theme }) => (
  <Box sx={{ mt: { xs: 2, sm: 4 }, textAlign: 'center' }}>
    <Typography
      variant="body2"
      color="text.secondary"
      sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
    >
      Don&apos;t have an account?{' '}
      <Link
        to="/register"
        style={{
          color: theme.palette.primary.main,
          textDecoration: 'none',
          fontWeight: 600,
        }}
      >
        Register here
      </Link>
    </Typography>
  </Box>
);

RegisterLink.propTypes = {
  theme: PropTypes.object.isRequired,
};

export default RegisterLink;
