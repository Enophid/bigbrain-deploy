import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Card,
  Divider,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Chip,
  Fade,
  ThemeProvider,
  CssBaseline,
  CircularProgress,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import TimerIcon from '@mui/icons-material/Timer';
import TrophyIcon from '@mui/icons-material/EmojiEvents';
import QuestionIcon from '@mui/icons-material/QuizOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import bigBrainTheme from '../theme/bigBrainTheme';
import GlobalStyles from '../theme/globalStyles';

const PlayerGameResults = () => {
  const { playerId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [totalScore, setTotalScore] = useState(0);
  const [avgTime, setAvgTime] = useState(0);
  const [error, setError] = useState('');

  // Helper function to calculate totals
  const calculateTotals = (resultsData) => {
    let totalPoints = 0;
    let totalTime = 0;
    let answeredCount = 0;

    resultsData.forEach((result) => {
      totalPoints += result.points || 0;

      if (result.responseTime) {
        totalTime += result.responseTime;
        answeredCount++;
      }
    });

    return {
      totalScore: totalPoints,
      avgTime:
        answeredCount > 0
          ? Math.round((totalTime / answeredCount) * 10) / 10
          : 0,
    };
  };

  // Load results from localStorage on mount
  useEffect(() => {
    try {
      if (!playerId) {
        setError('No player ID provided');
        setLoading(false);
        return;
      }

      // Attempt to load from localStorage
      const storedResults = localStorage.getItem(
        `bigbrain_player_${playerId}_results`
      );

      if (storedResults) {
        const parsedResults = JSON.parse(storedResults);
        console.log('Loaded results from localStorage:', parsedResults);

        setResults(parsedResults);

        // Calculate totals
        const { totalScore, avgTime } = calculateTotals(parsedResults);
        setTotalScore(totalScore);
        setAvgTime(avgTime);
      } else {
        setError('No results found for this player');
      }
    } catch (err) {
      console.error('Error loading from localStorage:', err);
      setError('Failed to load game results');
    } finally {
      setLoading(false);
    }
  }, [playerId]);

  // Handle navigation back to home
  const handlePlayAgain = () => {
    navigate('/');
  };

  // Handle navigation back to the game
  const handleReturnToGame = () => {
    navigate(`/gameplay/${playerId}`);
  };

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
            backgroundImage:
              'linear-gradient(135deg, #2D3047 0%, #00B4D8 50%, #06D6A0 100%)',
          }}
        >
          <CircularProgress size={60} color="primary" />
        </Box>
      </ThemeProvider>
    );
  }

 
};

export default PlayerGameResults;
