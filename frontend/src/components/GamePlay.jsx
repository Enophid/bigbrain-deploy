import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Paper,
  ThemeProvider,
  CssBaseline,
  CircularProgress,
  Alert,
} from '@mui/material';
import ApiCall from './apiCall';
import bigBrainTheme from '../theme/bigBrainTheme';
import GlobalStyles from '../theme/globalStyles';

/**
 * GamePlay component where players interact with the active game
 * This is a placeholder and would need to be implemented with the actual game logic
 */
function GamePlay() {
  const { playerId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(null);

  useEffect(() => {
    const fetchQuestionData = async () => {
      try {
        const response = await ApiCall(`/play/${playerId}/question`, {}, 'GET');
        
        if (response.error) {
          throw new Error(response.error);
        }
        
        setCurrentQuestion(response.question);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch question data.');
        setLoading(false);
      }
    };

    fetchQuestionData();
  }, [playerId]);

  if (loading) {
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
            background: bigBrainTheme.palette.background.default,
          }}
        >
          <CircularProgress size={60} />
        </Box>
      </ThemeProvider>
    );
  }

  if (error) {
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
            background: bigBrainTheme.palette.background.default,
          }}
        >
          <Container maxWidth="sm">
            <Alert severity="error" sx={{ borderRadius: 2 }}>
              {error}
            </Alert>
          </Container>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={bigBrainTheme}>
      <CssBaseline />
      <GlobalStyles />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          background: bigBrainTheme.palette.background.default,
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
        <Container maxWidth="md" sx={{ py: 5 }}>
          <Paper
            elevation={10}
            sx={{
              p: 4,
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
              backgroundImage: 'linear-gradient(to right, #ffffff, #f8f9fa)',
            }}
          >
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom 
              align="center"
              sx={{ fontWeight: 700, color: bigBrainTheme.palette.primary.main }}
            >
              Game In Progress
            </Typography>
            
            {currentQuestion ? (
              <Box sx={{ mt: 4 }}>
                <Typography variant="h5" gutterBottom>
                  {currentQuestion.text || 'Question text would appear here'}
                </Typography>
                
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                  This is a placeholder for the actual gameplay interface.
                  The complete implementation would include questions, answer options,
                  timers, and score tracking.
                </Typography>
              </Box>
            ) : (
              <Typography variant="body1" align="center" color="text.secondary">
                Waiting for the game to progress...
              </Typography>
            )}
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default GamePlay; 