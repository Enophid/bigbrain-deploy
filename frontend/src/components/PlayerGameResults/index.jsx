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
import ResultsTable from './components/ResultsTable';
import MobileResultsList from './components/MobileResultsList';
import ActionButtons from './components/ActionButtons';
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
                <ErrorView errorMessage={error} onPlayAgain={handlePlayAgain} />
              ) : (
                <>
                  <PlayerStats 
                    totalScore={totalScore} 
                    avgTime={avgTime} 
                    isMobile={isMobile} 
                  />
                  <Divider sx={{ mb: { xs: 3, sm: 4 } }} />

                  <PointsSystemExplanation />

                  <Typography 
                    variant="h6" 
                    sx={{ 
                      mb: { xs: 2, sm: 3 }, 
                      fontWeight: 'bold',
                      fontSize: { xs: '1.1rem', sm: '1.25rem' },
                    }}
                  >
                    Question Performance
                  </Typography>

                  {results.length > 0 ? (
                    <>
                      {/* Desktop/Tablet View - Table */}
                      <ResultsTable results={results} isTablet={isTablet} />

                      {/* Mobile View - Card list */}
                      <MobileResultsList results={results} />
                    </>
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