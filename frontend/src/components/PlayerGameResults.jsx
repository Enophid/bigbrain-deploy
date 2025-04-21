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
  useMediaQuery,
  useTheme,
  Grid,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import TimerIcon from '@mui/icons-material/Timer';
import TrophyIcon from '@mui/icons-material/EmojiEvents';
import QuestionIcon from '@mui/icons-material/QuizOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import bigBrainTheme from '../theme/bigBrainTheme';
import GlobalStyles from '../theme/globalStyles';
import PropTypes from 'prop-types';
/**
 * Component to display a question result in a card format for mobile views
 */
const MobileResultRow = ({ answer, index }) => {
  const isCorrect = answer.points > 0;

  return (
    <Card
      sx={{
        p: 2,
        mb: 2,
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        border: isCorrect
          ? '1px solid rgba(76, 175, 80, 0.3)'
          : '1px solid rgba(244, 67, 54, 0.1)',
        bgcolor: isCorrect
          ? 'rgba(76, 175, 80, 0.05)'
          : 'rgba(244, 67, 54, 0.05)',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
          Question {answer.position || index + 1}
        </Typography>
        {isCorrect ? (
          <Chip
            icon={<CheckCircleIcon />}
            label="Correct"
            color="success"
            size="small"
            sx={{ fontWeight: 'medium' }}
          />
        ) : (
          <Chip
            icon={<CancelIcon />}
            label="Incorrect"
            color="error"
            size="small"
            sx={{ fontWeight: 'medium' }}
          />
        )}
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {answer.question}
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography variant="caption" color="text.secondary">
            Points
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
            <Typography
              variant="body1"
              fontWeight="medium"
              color={isCorrect ? 'success.main' : 'text.secondary'}
            >
              {isCorrect ? answer.points : 0}
            </Typography>
            {isCorrect && answer.speedMultiplier && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ ml: 0.5 }}
              >
                ({answer.questionPoints} × {answer.speedMultiplier})
              </Typography>
            )}
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="caption" color="text.secondary">
            Response Time
          </Typography>
          <Box sx={{ mt: 0.5 }}>
            {answer.responseTime ? (
              <Chip
                icon={<TimerIcon fontSize="small" />}
                label={`${answer.responseTime}s`}
                size="small"
                color="secondary"
                variant="outlined"
                sx={{ fontWeight: 'medium' }}
              />
            ) : (
              <Typography variant="body2" color="text.secondary">
                N/A
              </Typography>
            )}
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
};

const PlayerGameResults = () => {
  const { playerId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [totalScore, setTotalScore] = useState(0);
  const [avgTime, setAvgTime] = useState(0);
  const [error, setError] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

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

  return (
    <ThemeProvider theme={bigBrainTheme}>
      <CssBaseline />
      <GlobalStyles />
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
          pt: { xs: 2, sm: 3, md: 5 },
          pb: { xs: 2, sm: 3, md: 5 },
        }}
      >
        <Container maxWidth="md">
          <Fade in={true} timeout={600}>
            <Paper
              elevation={10}
              sx={{
                width: '100%',
                margin: 'auto',
                p: { xs: 2, sm: 3, md: 4 },
                borderRadius: 4,
                boxShadow: '0 16px 48px rgba(0,0,0,0.2)',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {error ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h5" color="error" gutterBottom>
                    {error}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handlePlayAgain}
                    sx={{ mt: 2 }}
                  >
                    Back to Home
                  </Button>
                </Box>
              ) : (
                <>
                  <Box sx={{ textAlign: 'center', mb: { xs: 3, sm: 4 } }}>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 'bold',
                        color: '#1a237e',
                        mb: 1.5,
                        fontSize: {
                          xs: '1.75rem',
                          sm: '2.125rem',
                          md: '2.5rem',
                        },
                      }}
                    >
                      Results So Far
                    </Typography>

      </Box>
    </ThemeProvider>
  );
};

export default PlayerGameResults;

MobileResultRow.propTypes = {
  answer: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
};
