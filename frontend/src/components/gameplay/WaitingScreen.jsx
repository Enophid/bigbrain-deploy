import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  CircularProgress,
  Button,
  ThemeProvider,
  CssBaseline,
  Zoom,
} from '@mui/material';
import { QuestionAnswer as QuestionIcon } from '@mui/icons-material';
import bigBrainTheme from '../../theme/bigBrainTheme';
import GlobalStyles from '../../theme/globalStyles';

function WaitingScreen({ handleViewResults }) {
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
          backgroundImage:
            'linear-gradient(135deg, #2D3047 0%, #00B4D8 50%, #06D6A0 100%)',
          backgroundSize: '400% 400%',
          animation: 'gradient 15s ease infinite',
          '@keyframes gradient': {
            '0%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' },
            '100%': { backgroundPosition: '0% 50%' },
          },
        }}
      >
        <Container maxWidth="sm">
          <Zoom in={true} timeout={500}>
            <Card
              sx={{
                p: 4,
                borderRadius: 3,
                boxShadow: '0 16px 48px rgba(0,0,0,0.25)',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <QuestionIcon sx={{ fontSize: 60, color: '#00B4D8', mb: 2 }} />
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Get Ready!
                </Typography>
                <Typography variant="body1" sx={{ mb: 4, fontSize: '1.1rem' }}>
                  Waiting for the host to start the game or advance to the next
                  question.
                </Typography>
                <CircularProgress
                  sx={{
                    color: '#00B4D8',
                    '& .MuiCircularProgress-circle': {
                      strokeLinecap: 'round',
                    },
                    mb: 3
                  }}
                />

                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleViewResults}
                  sx={{ mt: 2 }}
                >
                  View Current Results
                </Button>
              </CardContent>
            </Card>
          </Zoom>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

WaitingScreen.propTypes = {
  handleViewResults: PropTypes.func.isRequired,
};

export default WaitingScreen; 