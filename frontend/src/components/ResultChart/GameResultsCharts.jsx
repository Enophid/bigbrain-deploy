import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Container,
  Paper,
} from '@mui/material';
import PropTypes from 'prop-types';
import ResultBarChart from './ResultBarChart';
import ResultLineChart from './ResultLineChart';
import ApiCall from '../apiCall';

/**
 * Component to fetch and display game results charts
 */
const GameResultsCharts = ({ sessionId }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGameResults = async () => {
      if (!sessionId) {
        setError('No session ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const data = await ApiCall(
          `/admin/session/${sessionId}/results`,
          {},
          'GET'
        );

        if (data && data.results) {
          setResults(data.results);
        } else {
          setError('No results data available');
          setResults([]);
        }
      } catch (error) {
        setError(error.message || 'Failed to fetch results');
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGameResults();
  }, [sessionId]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '300px',
        }}
        aria-live="polite"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
      </Alert>
    );
  }

  if (!results || results.length === 0) {
    return (
      <Alert severity="info" sx={{ mb: 3 }}>
        No results available for this session.
      </Alert>
    );
  }

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ mb: 4 }}>
          Game Results - Session #{sessionId}
        </Typography>

        <ResultBarChart results={results} />
        <ResultLineChart results={results} />
      </Paper>
    </Container>
  );
};

GameResultsCharts.propTypes = {
  sessionId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
};

export default GameResultsCharts;
