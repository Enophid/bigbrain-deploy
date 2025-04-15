import { Box, Typography, CircularProgress } from '@mui/material';

// Loading component
const LoadingIndicator = () => (
  <Box
    sx={{
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: 2,
    }}
  >
    <CircularProgress size={60} sx={{ color: 'white' }} />
    <Typography
      variant="h6"
      sx={{
        color: 'white',
        textShadow: '0 2px 4px rgba(0,0,0,0.2)',
        fontWeight: 500,
      }}
    >
      Loading results...
    </Typography>
  </Box>
);

export default LoadingIndicator;
