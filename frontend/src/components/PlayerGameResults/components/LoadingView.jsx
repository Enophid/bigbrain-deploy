import { Box, CircularProgress } from '@mui/material';

/**
 * Component to display loading state
 */
const LoadingView = () => (
  <Box
    sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundImage:
        'linear-gradient(135deg, #2D3047 0%, #00B4D8 50%, #06D6A0 100%)',
    }}
  >
    <CircularProgress size={60} color="primary" />
  </Box>
);

export default LoadingView; 