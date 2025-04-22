import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Button,
  ThemeProvider,
  CssBaseline,
} from '@mui/material';
import bigBrainTheme from '../../theme/bigBrainTheme';
import GlobalStyles from '../../theme/globalStyles';

function GameEndScreen({ handleViewResults }) {
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
            Game Complete!
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleViewResults}
            sx={{
              borderRadius: 2,
              px: 4,
              py: 1.5,
              textTransform: 'none',
              fontWeight: 'bold',
              mb: 2,
            }}
          >
            View Results
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

GameEndScreen.propTypes = {
  handleViewResults: PropTypes.func.isRequired,
};

export default GameEndScreen;
