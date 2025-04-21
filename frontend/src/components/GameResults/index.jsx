import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box, Fade } from '@mui/material';
import bigBrainTheme from '../../theme/bigBrainTheme';
import GlobalStyles from '../../theme/globalStyles';
import ApiCall from '../apiCall';

// Import all components
import ResultsHeader from './components/ResultsHeader';
import ResultsTabs from './components/ResultsTabs';
import LoadingIndicator from './components/LoadingIndicator';
import Leaderboard from './components/Leaderboard';
import Statistics from './components/Statistics';
import Background from './components/Background';

// Main GameResult component
const GameResult = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const hasFetched = useRef(false);
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showStats, setShowStats] = useState(false);
  const [error, setError] = useState(null);

  const handleBackToGameEditor = () => {
    navigate(`/dashboard`);
  };

  const toggleView = (event, newValue) => {
    setShowStats(newValue === 1);
  };

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await ApiCall(
          `/admin/session/${sessionId}/results`,
          {},
          'GET'
        );
        if (data && data.results) {
          console.log("Fetched game results:", data.results);
          setResult(data.results);
        } else {
          console.error('Invalid results data:', data);
          setError('No results data available');
          setResult([]); // Set an empty array if results are invalid
        }
      } catch (error) {
        console.error('Error fetching results:', error);
        setError(error.message || 'Failed to fetch results');
        setResult([]); // Handle error gracefully by resetting state
      } finally {
        setLoading(false); // Stop loading after API call
      }
    };

    if (!hasFetched.current) {
      fetchResults();
      hasFetched.current = true;
    }
  }, [sessionId]);

  return (
    <ThemeProvider theme={bigBrainTheme}>
      <CssBaseline />
      <GlobalStyles />
      <Background>
        <ResultsHeader 
          onBack={handleBackToGameEditor} 
          title={`Session #${sessionId} Results`}
          error={error} 
        />
        <ResultsTabs value={showStats ? 1 : 0} onChange={toggleView} />

        {loading ? (
          <LoadingIndicator />
        ) : (
          <Fade in={true} timeout={800}>
            <Box sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
              {!showStats ? <Leaderboard results={result} /> : <Statistics results={result} />}
            </Box>
          </Fade>
        )}
      </Background>
    </ThemeProvider>
  );
};

export default GameResult;
