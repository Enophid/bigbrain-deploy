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
  Avatar,
  Zoom,
  Fade,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Lightbulb as LightbulbIcon,
  EmojiObjects as EmojiObjectsIcon,
  SportsEsports as GameIcon,
  Psychology as PsychologyIcon,
  Forum as ForumIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
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
  const [waitingTime, setWaitingTime] = useState(0);
  const [lobbyTip, setLobbyTip] = useState(0);
  const [playerInfo, setPlayerInfo] = useState({ name: '', avatar: '' });

  // Tips to show in the lobby
  const lobbyTips = [
    "Answer questions quickly for a higher score!",
    "Read each question carefully before answering.",
    "Some questions may have multiple correct answers.",
    "Don't stress if you get one wrong - just keep going!",
    "You can see your score at the end of the game.",
    "The faster you answer correctly, the more points you earn!",
  ];

  // Generate player avatar
  useEffect(() => {
    if (playerName) {
      // Create initials from player name
      const initials = playerName
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase();
      
      // Generate a random color based on player name
      const colors = [
        '#1976d2', '#e91e63', '#ff9800', '#4caf50', 
        '#9c27b0', '#f44336', '#2196f3', '#ffeb3b'
      ];
      const colorIndex = playerName.length % colors.length;
      
      setPlayerInfo({
        name: playerName,
        initials,
        color: colors[colorIndex],
      });
    }
  }, [playerName]);

  // Rotate lobby tips every 8 seconds
  useEffect(() => {
    if (joined && !gameStarted) {
      const tipInterval = setInterval(() => {
        setLobbyTip(prev => (prev + 1) % lobbyTips.length);
      }, 8000);
      
      return () => clearInterval(tipInterval);
    }
  }, [joined, gameStarted, lobbyTips.length]);

  // Track waiting time
  useEffect(() => {
    if (joined && !gameStarted) {
      const timer = setInterval(() => {
        setWaitingTime(prev => prev + 1);
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [joined, gameStarted]);

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

  // Format waiting time to mm:ss
  const formatWaitingTime = () => {
    const minutes = Math.floor(waitingTime / 60);
    const seconds = waitingTime % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
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
              {joined ? 'Game Lobby' : 'Join Game Session'}
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

            )}
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
export default Play;
