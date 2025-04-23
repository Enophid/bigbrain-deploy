import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Divider,
  Fade,
  ThemeProvider,
  CssBaseline,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import bigBrainTheme from '../../theme/bigBrainTheme';
import GlobalStyles from '../../theme/globalStyles';

// Import components
import LoadingView from './components/LoadingView';
import ErrorView from './components/ErrorView';
import PlayerStats from './components/PlayerStats';
import PointsSystemExplanation from './components/PointsSystemExplanation';
import DetailedPerformance from './components/DetailedPerformance';
import ActionButtons from './components/ActionButtons';
import ApiCall from '../apiCall';
/**
 * Main component to display player game results
 */
const PlayerGameResults = () => {
  const { playerId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [totalScore, setTotalScore] = useState(0);
  const [error, setError] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Helper function to calculate totals
  const calculateTotals = (resultsData) => {
    let totalPoints = 0;

    resultsData.forEach((result) => {
      // Add points to total
      totalPoints += result.points || 0;
    });

    return {
      totalScore: totalPoints,
    };
  };

  // Load results from API on mount
  useEffect(() => {
    const fetchPlayerResults = async () => {
      try {
        if (!playerId) {
          setError('No player ID provided');
          setLoading(false);
          return;
        }

        // Fetch results from API
        const response = await ApiCall(`/play/${playerId}/results`, {}, 'GET');

        if (response.error) {
          throw new Error(response.error || 'Failed to load game results');
        }

        // The API response structure might be different - adapt based on actual response
        let resultsData = [];

        // Check if we have a valid response structure
        if (response) {
          // If response is an array directly
          if (Array.isArray(response)) {
            resultsData = response;
          }
          // If response has a results property that's an array
          else if (response.results && Array.isArray(response.results)) {
            resultsData = response.results;
          }
          // If response has questions property that's an array
          else if (response.questions && Array.isArray(response.questions)) {
            resultsData = response.questions;
          }
          // If response has a different structure
          else {
            // Try to extract useful data anyway if possible
            resultsData = Object.values(response).filter(
              (item) =>
                item &&
                typeof item === 'object' &&
                (Object.prototype.hasOwnProperty.call(item, 'question') ||
                  Object.prototype.hasOwnProperty.call(item, 'points') ||
                  Object.prototype.hasOwnProperty.call(item, 'correct'))
            );
          }
        }

        if (resultsData.length > 0) {
          // Ensure each result has the required fields for display
          const formattedResults = resultsData.map((result, index) => {
            // Process response time with proper fallbacks
            let responseTime = null;

            // Calculate from questionStartedAt and answeredAt if available (database format)
            if (result.questionStartedAt && result.answeredAt) {
              const startTime = new Date(result.questionStartedAt).getTime();
              const endTime = new Date(result.answeredAt).getTime();
              responseTime = (endTime - startTime) / 1000; // Convert to seconds
            }
            // Fall back to direct responseTime fields if timestamps not available
            else if (result.responseTime !== undefined) {
              responseTime = parseFloat(result.responseTime);
            } else if (result.timeTaken !== undefined) {
              responseTime = parseFloat(result.timeTaken);
            } else if (result.answerTime !== undefined) {
              responseTime = parseFloat(result.answerTime);
            } else if (result.timeSpent !== undefined) {
              responseTime = parseFloat(result.timeSpent);
            } else if (result.time !== undefined) {
              responseTime = parseFloat(result.time);
            } else if (result.duration !== undefined) {
              responseTime = parseFloat(result.duration);
            }

            // Check special case - if response is an object with a 'time' property
            if (
              responseTime === null &&
              result.response &&
              typeof result.response === 'object' &&
              result.response.time !== undefined
            ) {
              responseTime = parseFloat(result.response.time);
            }

            // Ensure response time is a valid number
            if (isNaN(responseTime)) {
              responseTime = null;
            } else {
              // Round to 1 decimal place for display
              responseTime = Math.round(responseTime * 10) / 10;
            }

            // Calculate speed multiplier and points if not provided but we have response time
            let speedMultiplier = result.speedMultiplier;
            let points = result.points;
            const isCorrect = result.correct || false;
            const basePoints = result.questionPoints || result.basePoints || 10;

            // If no speedMultiplier but we have responseTime and it's a correct answer, calculate it
            if (!speedMultiplier && responseTime !== null && isCorrect) {
              // Default question duration (adjust as needed)
              const questionDuration = 30;
              // Calculate speed ratio (how quickly they answered)
              const speedRatio = Math.min(responseTime / questionDuration, 1);
              // Calculate multiplier from 0.5 to 2.0
              speedMultiplier = Math.round((2 - 1.5 * speedRatio) * 100) / 100;
            }

            // If no points but we have speedMultiplier and it's a correct answer, calculate points
            if (!points && speedMultiplier && isCorrect) {
              points = Math.round(basePoints * speedMultiplier);
            }

            return {
              question:
                result.question || result.text || `Question ${index + 1}`,
              position: result.position || result.questionNumber || index + 1,
              points: points || (isCorrect ? basePoints : 0),
              responseTime: responseTime,
              correct: isCorrect,
              questionPoints: basePoints,
              speedMultiplier:
                speedMultiplier ||
                (isCorrect && points ? points / basePoints : 1),
            };
          });

          setResults(formattedResults);

          // Calculate totals
          const { totalScore } = calculateTotals(formattedResults);
          setTotalScore(totalScore);
        } else {
          setError('No results found for this player');
        }
      } catch (err) {
        console.error('Error loading player results:', err);
        setError(
          'Failed to load game results: ' + (err.message || 'Unknown error')
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerResults();
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
        <LoadingView />
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
          height: '100%',
          width: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
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
          overflow: 'auto',
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
                <ErrorView errorMessage={error} onPlayAgain={handlePlayAgain} />
              ) : (
                <>
                  <PlayerStats
                    totalScore={totalScore}
                    results={results}
                    isMobile={isMobile}
                  />

                  <Divider sx={{ mb: { xs: 3, sm: 4 } }} />

                  <PointsSystemExplanation />

                  {results.length > 0 ? (
                    <DetailedPerformance results={results} />
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        No results found. Try playing a game first!
                      </Typography>
                    </Box>
                  )}

                  <ActionButtons
                    onReturnToGame={handleReturnToGame}
                    onPlayAgain={handlePlayAgain}
                    isMobile={isMobile}
                  />
                </>
              )}
            </Paper>
          </Fade>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default PlayerGameResults;
