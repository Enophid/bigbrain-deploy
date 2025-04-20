import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Paper,
  ThemeProvider,
  CssBaseline,
  CircularProgress,
  Alert,
  Card,
  CardContent,
} from '@mui/material';
import ApiCall from './apiCall';
import bigBrainTheme from '../theme/bigBrainTheme';
import GlobalStyles from '../theme/globalStyles';

function Play() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const params = useParams();

  // Get session ID from URL params or query params
  const sessionId = params.sessionId || searchParams.get('session') || '';
  const [playerName, setPlayerName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [joined, setJoined] = useState(false);
  const [playerId, setPlayerId] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    // If there's no session ID in the URL, show an error
    if (!sessionId) {
      setError(
        'No game session ID found. Please use a valid game invitation link.',
      );
    }
  }, [sessionId]);

  useEffect(() => {
    let intervalId;

    if (joined && playerId && !gameStarted) {
      intervalId = setInterval(async () => {
        try {
          const response = await ApiCall(`/play/${playerId}/status`, {}, 'GET');
          if (response.started) {
            setGameStarted(true);
            clearInterval(intervalId);
            navigate(`/gameplay/${playerId}`);
          }
        } catch (err) {
          console.error('Error checking game status:', err);
        }
      }, 2000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [joined, playerId, gameStarted, navigate]);

  const handleJoinGame = async (e) => {
    e.preventDefault();
    setError('');

    if (!sessionId) {
      setError(
        'No game session ID found. Please use a valid game invitation link.',
      );
      return;
    }

    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }

    setLoading(true);

    try {
      const response = await ApiCall(
        `/play/join/${sessionId}`,
        { name: playerName },
        'POST',
      );

      if (response.error) {
        throw new Error(response.error);
      }

      setPlayerId(response.playerId);
      setJoined(true);
      setLoading(false);
    } catch (err) {
      setError(
        err.message || 'Failed to join game. Please check the session ID.',
      );
      setLoading(false);
    }
  };

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
          overflow: 'hidden',
          '@keyframes gradient': {
            '0%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' },
            '100%': { backgroundPosition: '0% 50%' },
          },
        }}
      >
        <Container maxWidth='sm'>
          <Paper
            elevation={10}
            sx={{
              p: 4,
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
              backdropFilter: 'blur(8px)',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
            }}
          >
            <Typography
              variant='h4'
              component='h1'
              gutterBottom
              align='center'
              sx={{
                fontWeight: 700,
                color: bigBrainTheme.palette.primary.main,
              }}
            >
              Join Game Session
            </Typography>

            {sessionId && (
              <Typography
                variant='subtitle1'
                align='center'
                sx={{ mb: 3, fontWeight: 500 }}
              >
                Session ID:{' '}
                <Box component='span' sx={{ fontWeight: 700 }}>
                  {sessionId}
                </Box>
              </Typography>
            )}

            {!joined ? (
              <Box component='form' onSubmit={handleJoinGame} sx={{ mt: 3 }}>
                <TextField
                  label='Your Name'
                  variant='outlined'
                  fullWidth
                  margin='normal'
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  disabled={loading}
                  placeholder='Enter your name to join the game'
                  autoFocus
                  InputProps={{
                    sx: { borderRadius: 2 },
                  }}
                />

                {error && (
                  <Alert severity='error' sx={{ mt: 2, borderRadius: 2 }}>
                    {error}
                  </Alert>
                )}

                <Button
                  type='submit'
                  fullWidth
                  variant='contained'
                  color='primary'
                  size='large'
                  disabled={loading || !sessionId}
                  sx={{ mt: 3, mb: 2, borderRadius: 2, py: 1.2 }}
                >
                  {loading ? (
                    <CircularProgress size={24} color='inherit' />
                  ) : (
                    'Join Game'
                  )}
                </Button>
              </Box>
            ) : (
              <Card sx={{ mt: 3, borderRadius: 2, backgroundColor: '#f8f9fa' }}>
                <CardContent>
                  <Typography variant='h6' align='center' gutterBottom>
                    You&apos;ve joined the game!
                  </Typography>
                  <Typography variant='body1' align='center' component='p'>
                    Waiting for the host to start the game...
                  </Typography>
                  <Box
                    sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}
                  >
                    <CircularProgress />
                  </Box>
                </CardContent>
              </Card>
            )}
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
export default Play;
