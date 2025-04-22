import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Paper,
  ThemeProvider,
  CssBaseline,
} from '@mui/material';
import ApiCall from '../apiCall'; // Adjusted path
import bigBrainTheme from '../../theme/bigBrainTheme'; // Adjusted path
import GlobalStyles from '../../theme/globalStyles'; // Adjusted path
import JoinForm from './components/JoinForm';
import LobbyView from './components/LobbyView';

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
  const [lobbyTipIndex, setLobbyTipIndex] = useState(0);
  const [playerInfo, setPlayerInfo] = useState({ name: '', initials: '', color: '' });

  // Tips to show in the lobby
  const lobbyTips = [
    'Answer questions quickly for a higher score!',
    'Read each question carefully before answering.',
    'Some questions may have multiple correct answers.',
    "Don't stress if you get one wrong - just keep going!",
    'You can see your score at the end of the game.',
    'The faster you answer correctly, the more points you earn!',
  ];

  // Generate player avatar info
  useEffect(() => {
    if (playerName) {
      const initials = playerName
        .split(' ')
        .map((word) => word.charAt(0))
        .join('')
        .toUpperCase();
      const colors = [
        '#1976d2',
        '#e91e63',
        '#ff9800',
        '#4caf50',
        '#9c27b0',
        '#f44336',
        '#2196f3',
        '#ffeb3b',
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
    let tipInterval;
    if (joined && !gameStarted) {
      tipInterval = setInterval(() => {
        setLobbyTipIndex((prev) => (prev + 1) % lobbyTips.length);
      }, 8000);
    }
    return () => clearInterval(tipInterval);
  }, [joined, gameStarted, lobbyTips.length]);

  // Track waiting time
  useEffect(() => {
    let timer;
    if (joined && !gameStarted) {
      timer = setInterval(() => {
        setWaitingTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [joined, gameStarted]);

  // Check for session ID on mount
  useEffect(() => {
    if (!sessionId) {
      setError('No game session ID found. Please use a valid game invitation link.');
    }
  }, [sessionId]);

  // Poll for game status after joining
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
          // Potentially handle errors like session ending unexpectedly
          setError('Error checking game status. Please try refreshing.');
          clearInterval(intervalId);
        }
      }, 2000);
    }
    return () => clearInterval(intervalId);
  }, [joined, playerId, gameStarted, navigate]);

  // Handle joining the game
  const handleJoinGame = async (e) => {
    e.preventDefault();
    setError('');

    if (!sessionId) {
      setError('No game session ID found. Please use a valid game invitation link.');
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
        'POST'
      );
      if (response.error) throw new Error(response.error);
      setPlayerId(response.playerId);
      setJoined(true);
    } catch (err) {
      setError(err.message || 'Failed to join game. Please check the session ID.');
    } finally {
      setLoading(false);
    }
  };

  // Format waiting time to mm:ss
  const formatWaitingTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
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
 
}
export default Play; 