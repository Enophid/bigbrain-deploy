import { Typography, Box } from '@mui/material';

export default function RegisterHeader() {
  return (
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
        Join BigBrain!
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{
          fontSize: { xs: '0.875rem', sm: '1rem' },
        }}
      >
        Create an account to start making amazing quizzes
      </Typography>
    </Box>
  );
}
