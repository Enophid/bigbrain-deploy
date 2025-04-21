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
              <Fade in={true} timeout={800}>
                <Box sx={{ mt: 2 }}>
                  {/* Player info section */}
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                    <Zoom in={true} timeout={1000}>
                      <Avatar 
                        sx={{ 
                          width: 80, 
                          height: 80, 
                          bgcolor: playerInfo.color,
                          fontSize: '2rem',
                          fontWeight: 'bold',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                        }}
                      >
                        {playerInfo.initials}
                      </Avatar>
                    </Zoom>
                  </Box>
                  
                  <Zoom in={true} timeout={800}>
                    <Typography variant='h5' align='center' gutterBottom>
                      Welcome, {playerInfo.name}!
                    </Typography>
                  </Zoom>
                  
                  <Zoom in={true} timeout={1000}>
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center',
                        mb: 4,
                        mt: 1
                      }}
                    >
                      <Chip 
                        label="Ready" 
                        color="success" 
                        variant="outlined" 
                        sx={{ fontWeight: 'bold', mx: 1 }} 
                      />
                      <Chip 
                        label={`Waiting: ${formatWaitingTime()}`} 
                        icon={<ScheduleIcon />} 
                        color="primary" 
                        variant="outlined" 
                        sx={{ fontWeight: 'bold', mx: 1 }}  
                      />
                    </Box>
                  </Zoom>
                  
                  {/* Status card */}
                  <Zoom in={true} timeout={1200}>
                    <Card 
                      sx={{ 
                        mb: 4, 
                        borderRadius: 2, 
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        bgcolor: 'primary.light',
                        color: 'white'
                      }}
                    >
                      <CardContent sx={{ textAlign: 'center', py: 2 }}>
                        <Typography variant='h6' sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <GameIcon sx={{ mr: 1 }} /> Waiting for host to start the game...
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                          <CircularProgress sx={{ color: 'white' }} />
                        </Box>
                      </CardContent>
                    </Card>
                  </Zoom>
                  
                  {/* Tips section */}
                  <Divider sx={{ my: 3 }}>
                    <Chip label="Game Tips" color="primary" />
                  </Divider>
                  
                  <Box sx={{ mb: 3 }}>
                    <Fade key={lobbyTip} in={true} timeout={500}>
                      <Box sx={{ p: 2, bgcolor: 'rgba(25, 118, 210, 0.08)', borderRadius: 2 }}>
                        <Typography 
                          variant="body1" 
                          align="center" 
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            fontWeight: 'medium',
                            color: 'primary.dark'
                          }}
                        >
                          <LightbulbIcon sx={{ mr: 1, color: 'warning.main' }} />
                          {lobbyTips[lobbyTip]}
                        </Typography>
                      </Box>
                    </Fade>
                  </Box>
                  
                  {/* How to play section */}
                  <Zoom in={true} timeout={1500}>
                    <Card sx={{ borderRadius: 2, mt: 3 }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                          <EmojiObjectsIcon sx={{ mr: 1, color: 'warning.main' }} /> How to Play
                        </Typography>
                        
                        <List dense sx={{ bgcolor: 'background.paper' }}>
                          <ListItem>
                            <ListItemIcon>
                              <PsychologyIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText 
                              primary="Answer questions as quickly as possible" 
                              secondary="Faster answers earn more points"
                            />
                          </ListItem>
                          
                          <ListItem>
                            <ListItemIcon>
                              <ForumIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText 
                              primary="Some questions have multiple answers" 
                              secondary="Select all that apply in these cases"
                            />
                          </ListItem>
                        </List>
                      </CardContent>
                    </Card>
                  </Zoom>
                </Box>
              </Fade>
            )}
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
export default Play;
