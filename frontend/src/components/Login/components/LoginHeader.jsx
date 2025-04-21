import { Box, Typography } from '@mui/material';

/**
 * Header component for the login page with title and subtitle
 */
const LoginHeader = () => (
  <Box sx={{ mb: { xs: 2, sm: 4 } }}>
    <Typography
      variant="h3"
      color="primary"
      gutterBottom
      sx={{
        fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2.5rem' },
        mb: { xs: 0.5, sm: 1 },
        fontWeight: 700,
      }}
    >
      Welcome to BigBrain!
    </Typography>
    <Typography
      variant="body1"
      color="text.secondary"
      sx={{
        fontSize: { xs: '0.875rem', sm: '1rem' },
      }}
    >
      Login to start creating awesome quizzes!
    </Typography>
  </Box>
);

export default LoginHeader; 