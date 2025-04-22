import {
  Box,
  Typography,
  CircularProgress,
  ThemeProvider,
  CssBaseline,
} from '@mui/material';
import bigBrainTheme from '../../theme/bigBrainTheme';
import GlobalStyles from '../../theme/globalStyles';

function LoadingScreen() {
  return (
    <ThemeProvider theme={bigBrainTheme}>
      <CssBaseline />
      <GlobalStyles />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            variant="h4"
            sx={{ color: 'white', mb: 3, fontWeight: 'bold' }}
          >
            BigBrain
          </Typography>
          <CircularProgress size={60} sx={{ color: '#fff' }} />
          <Typography variant="body1" sx={{ color: 'white', mt: 2 }}>
            Loading your game...
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default LoadingScreen;
