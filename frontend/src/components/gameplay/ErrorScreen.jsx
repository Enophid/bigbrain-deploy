import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Container,
  Alert,
  ThemeProvider,
  CssBaseline,
  Fade,
} from '@mui/material';
import bigBrainTheme from '../../theme/bigBrainTheme';
import GlobalStyles from '../../theme/globalStyles';

function ErrorScreen({ error }) {
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
        <Container maxWidth="sm">
          <Fade in={true} timeout={800}>
            <Alert
              severity="error"
              variant="filled"
              sx={{
                borderRadius: 2,
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
              }}
            >
              <Typography variant="h6">Oops!</Typography>
              {error || 'An unknown error occurred.'}
            </Alert>
          </Fade>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

ErrorScreen.propTypes = {
  error: PropTypes.string.isRequired,
};

export default ErrorScreen; 