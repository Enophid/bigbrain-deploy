import { Box, Typography, Button } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * Component to display error state
 */
const ErrorView = ({ errorMessage, onPlayAgain }) => (
  <Box sx={{ textAlign: 'center', py: 4 }}>
    <Typography variant="h5" color="error" gutterBottom>
      {errorMessage}
    </Typography>
    <Button
      variant="contained"
      color="primary"
      onClick={onPlayAgain}
      sx={{ mt: 2 }}
    >
      Back to Home
    </Button>
  </Box>
);

ErrorView.propTypes = {
  errorMessage: PropTypes.string.isRequired,
  onPlayAgain: PropTypes.func.isRequired,
};

export default ErrorView;
