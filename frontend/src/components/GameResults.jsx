import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Alert,
  Divider,
  Grid,
  IconButton,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  EmojiEvents as TrophyIcon,
  PersonOutline as PersonIcon,
  CheckCircle as CorrectIcon,
  Cancel as IncorrectIcon,
  Timer as TimerIcon,
} from '@mui/icons-material';
import ApiCall from './apiCall';
import { useTheme } from '@mui/material/styles';

const GameResults = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const data = await ApiCall(`/admin/session/${sessionId}/results`, {}, 'GET');
        if (data.error) {
          throw new Error(data.error);
        }
        setResults(data.results);
      } catch (err) {
        console.error('Failed to fetch results:', err);
        setError(err.message || 'Failed to fetch results');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [sessionId]);

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  // Function to calculate average score
  const getAverageScore = () => {
    if (!results || !results.players || !results.players.length) return 0;
    const totalScore = results.players.reduce((acc, player) => acc + player.score, 0);
    return totalScore / results.players.length;
  };

  // Function to find the player with the highest score
  const getTopPlayer = () => {
    if (!results || !results.players || !results.players.length) return null;
    return results.players.reduce((top, player) => 
      player.score > top.score ? player : top, results.players[0]);
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
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
        <CircularProgress color="secondary" size={60} />
        <Typography variant="h6" color="white" sx={{ mt: 2 }}>
          Loading results...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
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
        <Alert severity="error" sx={{ maxWidth: 500, mb: 3 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleBackToDashboard}
          startIcon={<ArrowBackIcon />}
        >
          Back to Dashboard
        </Button>
      </Box>
    );
  }

  const topPlayer = getTopPlayer();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
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
      <Container maxWidth="lg" sx={{ py: 4, flexGrow: 1 }}>
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
          <IconButton 
            onClick={handleBackToDashboard}
            sx={{ 
              mr: 2, 
              color: 'white',
              bgcolor: 'rgba(255,255,255,0.1)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography 
            variant="h4" 
            component="h1"
            sx={{ 
              color: 'white',
              fontWeight: 700,
              textShadow: '0 2px 10px rgba(0,0,0,0.3)',
            }}
          >
            Game Session Results
          </Typography>
        </Box>

        {results && (
          <Grid container spacing={3}>
            {/* Summary Card */}
            <Grid item xs={12}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  bgcolor: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                