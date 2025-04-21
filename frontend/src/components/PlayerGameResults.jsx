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
          pt: { xs: 3, sm: 5 },
          pb: 5,
        }}
      >
        <Container maxWidth="md">
          <Fade in={true} timeout={600}>
            <Paper
              elevation={10}
              sx={{
                width: '100%',
                margin: 'auto',
                p: { xs: 3, sm: 4 },
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
                  <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 'bold', color: '#1a237e', mb: 2 }}
                    >
                      Results So Far
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ color: 'text.secondary', mb: 3 }}
                    >
                      Here&apos;s how you&apos;re performing
                    </Typography>

                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 3,
                        mb: 4,
                      }}
                    >
                      <Card
                        sx={{
                          minWidth: 140,
                          p: 2,
                          bgcolor: 'primary.main',
                          color: 'white',
                          borderRadius: 3,
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            mb: 1,
                          }}
                        >
                          <TrophyIcon fontSize="large" />
                        </Box>
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                          {totalScore}
                        </Typography>
                        <Typography variant="body2">Total Points</Typography>
                      </Card>

                      <Card
                        sx={{
                          minWidth: 140,
                          p: 2,
                          bgcolor: 'secondary.main',
                          color: 'white',
                          borderRadius: 3,
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            mb: 1,
                          }}
                        >
                          <TimerIcon fontSize="large" />
                        </Box>
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                          {avgTime}s
                        </Typography>
                        <Typography variant="body2">
                          Avg Response Time
                        </Typography>
                      </Card>
                    </Box>
                  </Box>

                  <Divider sx={{ mb: 4 }} />

                  {/* Points System Explanation */}
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      mb: 4,
                      bgcolor: 'rgba(25, 118, 210, 0.08)',
                      borderRadius: 2,
                      border: '1px solid rgba(25, 118, 210, 0.2)',
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 'bold',
                        mb: 1.5,
                        color: 'primary.main',
                      }}
                    >
                      Advanced Points System
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1.5 }}>
                      Your points are calculated using a speed-based multiplier:
                    </Typography>
                    <Typography variant="body2" component="div" sx={{ mb: 1 }}>
                      <strong>
                        Final Points = Base Question Points × Speed Multiplier
                      </strong>
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      • Faster answers earn higher multipliers (up to 2x for
                      instant answers)
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      • Even the slowest answers receive at least 0.5x
                      multiplier
                    </Typography>
                    <Typography variant="body2">
                      • The multiplier decreases linearly as more time is used
                    </Typography>
                  </Paper>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                    Question Performance
                  </Typography>

                  {results.length > 0 ? (
                    <TableContainer
                      component={Paper}
                      elevation={0}
                      sx={{ mb: 3 }}
                    >
                      <Table>
                        <TableHead>
                          <TableRow sx={{ bgcolor: 'rgba(0,0,0,0.04)' }}>
                            <TableCell sx={{ fontWeight: 'bold' }}>
                              Question
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ fontWeight: 'bold' }}
                            >
                              Result
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ fontWeight: 'bold' }}
                            >
                              Points
                            </TableCell>
                            <TableCell
                              align="right"
                              sx={{ fontWeight: 'bold' }}
                            >
                              Response Time
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {results.map((answer, index) => {
                            // Determine if correct based on points
                            const isCorrect = answer.points > 0;

                            return (
                              <TableRow
                                key={index}
                                sx={{
                                  '&:nth-of-type(odd)': {
                                    bgcolor: 'rgba(0,0,0,0.02)',
                                  },
                                  transition: 'background-color 0.2s',
                                  '&:hover': { bgcolor: 'rgba(0,0,0,0.05)' },
                                }}
                              >
                                <TableCell>
                                  <Typography
                                    variant="body1"
                                    sx={{ fontWeight: 'medium' }}
                                  >
                                    Question {answer.position || index + 1}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    noWrap
                                    sx={{ maxWidth: 200 }}
                                  >
                                    {answer.question}
                                  </Typography>
                                </TableCell>
                                <TableCell align="center">
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
                                </TableCell>
                                <TableCell align="center">
                                  {isCorrect ? (
                                    <Box>
                                      <Typography
                                        variant="body1"
                                        fontWeight="medium"
                                        color="success.main"
                                      >
                                        {answer.points}
                                      </Typography>
                                      {answer.speedMultiplier && (
                                        <Typography
                                          variant="caption"
                                          color="text.secondary"
                                        >
                                          {answer.questionPoints} ×{' '}
                                          {answer.speedMultiplier} speed
                                        </Typography>
                                      )}
                                    </Box>
                                  ) : (
                                    <Typography
                                      variant="body1"
                                      fontWeight="medium"
                                      color="text.secondary"
                                    >
                                      0
                                    </Typography>
                                  )}
                                </TableCell>
                                <TableCell align="right">
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
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                    >
                                      N/A
                                    </Typography>
                                  )}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        No results found. Try playing a game first!
                      </Typography>
                    </Box>
                  )}
                </>
              )}

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  mt: 4,
                  gap: 2,
                }}
              >
                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  startIcon={<ArrowBackIcon />}
                  onClick={handleReturnToGame}
                  sx={{
                    borderRadius: 2,
                    px: 3,
                    py: 1.5,
                    textTransform: 'none',
                    fontWeight: 'medium',
                    fontSize: '1rem',
                  }}
                >
                  Return to Game
                </Button>

                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<QuestionIcon />}
                  onClick={handlePlayAgain}
                  sx={{
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                    textTransform: 'none',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                  }}
                >
                  Play New Game
                </Button>
              </Box>
            </Paper>
          </Fade>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default PlayerGameResults;
