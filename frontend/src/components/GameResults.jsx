import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ThemeProvider,
  CssBaseline,
  Box,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  CircularProgress,
  Tabs,
  Tab,
  Avatar,
  Fade,
  Divider,
  Chip,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  BarChart as BarChartIcon,
  People as PeopleIcon,
  EmojiEvents as TrophyIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import bigBrainTheme from '../theme/bigBrainTheme';
import GlobalStyles from '../theme/globalStyles';
import ApiCall from './apiCall';
import ResultBarChart from './Result/ResultBarChat';
import ResultLineChart from './Result/ResultLineChart';

const GameResult = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const hasFetched = useRef(false);
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showStats, setShowStats] = useState(false);

  const handleBackToGameEditor = () => {
    navigate(`/dashboard`);
  };

  const toggleView = (event, newValue) => {
    setShowStats(newValue === 1);
  };

  useEffect(() => {
    const getResult = async () => {
      setLoading(true);
      try {
        const data = await ApiCall(
          `/admin/session/${sessionId}/results`,
          {},
          'GET'
        );
        if (data && data.results) {
          setResult(data.results);
        } else {
          console.error('Invalid results data:', data);
          setResult([]); // Set an empty array if results are invalid
        }
      } catch (error) {
        console.error('Error fetching results:', error);
        setResult([]); // Handle error gracefully by resetting state
      } finally {
        setLoading(false); // Stop loading after API call
      }
    };

    if (!hasFetched.current) {
      getResult();
      hasFetched.current = true;
    }
  }, [sessionId]);

  return (
    <ThemeProvider theme={bigBrainTheme}>
      <CssBaseline />
      <GlobalStyles />
      <Box
        sx={{
          minHeight: '100vh',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: bigBrainTheme.palette.background.default,
          backgroundImage:
            'linear-gradient(135deg, #2D3047 0%, #00B4D8 50%, #06D6A0 100%)',
          backgroundSize: '400% 400%',
          backgroundAttachment: 'fixed',
          animation: 'gradient 15s ease infinite',
          overflow: 'hidden',
          position: 'fixed',
          width: '100%',
          left: 0,
          top: 0,
          '@keyframes gradient': {
            '0%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' },
            '100%': { backgroundPosition: '0% 50%' },
          },
        }}
      >
        <Box
          sx={{
            position: 'relative',
            minHeight: '100vh',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'auto',
            pb: 6,
          }}
        >
          {/* Header Section */}
          <Box
            sx={{
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(10px)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              py: 2,
              px: { xs: 2, sm: 4 },
              mb: 4,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                color="inherit"
                onClick={handleBackToGameEditor}
                sx={{
                  mr: 2,
                  color: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography
                variant="h4"
                sx={{
                  color: '#fff',
                  fontWeight: 700,
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.25rem' },
                  letterSpacing: '0.5px',
                }}
              >
                Game Results
              </Typography>
            </Box>
            <Chip
              icon={<AssessmentIcon />}
              label="Results"
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                color: 'white',
                fontWeight: 'bold',
                backdropFilter: 'blur(5px)',
                '& .MuiChip-icon': {
                  color: 'white',
                },
              }}
            />
          </Box>

          {/* Navigation Tabs */}
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              mb: 4,
            }}
          >
            <Paper
              elevation={3}
              sx={{
                borderRadius: '50px',
                overflow: 'hidden',
                width: { xs: '90%', sm: '70%', md: '50%' },
                maxWidth: '500px',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
              }}
            >
              <Tabs
                value={showStats ? 1 : 0}
                onChange={toggleView}
                variant="fullWidth"
                sx={{
                  '& .MuiTabs-indicator': {
                    backgroundColor: bigBrainTheme.palette.primary.main,
                    height: 3,
                  },
                }}
              >
                <Tab
                  icon={<PeopleIcon />}
                  iconPosition="start"
                  label="Leaderboard"
                  sx={{
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '1rem',
                    py: 1.5,
                  }}
                />
                <Tab
                  icon={<BarChartIcon />}
                  iconPosition="start"
                  label="Statistics"
                  sx={{
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '1rem',
                    py: 1.5,
                  }}
                />
              </Tabs>
            </Paper>
          </Box>

          {loading ? (
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <CircularProgress size={60} sx={{ color: 'white' }} />
              <Typography
                variant="h6"
                sx={{
                  color: 'white',
                  textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  fontWeight: 500,
                }}
              >
                Loading results...
              </Typography>
            </Box>
          ) : (
            <Fade in={true} timeout={800}>
              <Box sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
                {!showStats && (
                  <Box
                    sx={{
                      width: '100%',
                      maxWidth: 700,
                      mx: 'auto',
                      borderRadius: 4,
                      bgcolor: 'rgba(255, 255, 255, 0.95)',
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        p: 3,
                        textAlign: 'center',
                        backgroundColor: bigBrainTheme.palette.primary.main,
                        position: 'relative',
                      }}
                    >
                      <TrophyIcon
                        sx={{
                          fontSize: 40,
                          color: '#FFD700',
                          position: 'absolute',
                          left: '15%',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          display: { xs: 'none', sm: 'block' },
                        }}
                      />
                      <Typography
                        variant="h4"
                        fontWeight={700}
                        sx={{
                          color: 'white',
                          textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        }}
                      >
                        Leaderboard
                      </Typography>
                      <TrophyIcon
                        sx={{
                          fontSize: 40,
                          color: '#FFD700',
                          position: 'absolute',
                          right: '15%',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          display: { xs: 'none', sm: 'block' },
                        }}
                      />
                    </Box>

                    <Divider />

                    {result.slice(0, 5).length !== 0 ? (
                      <>
                        {/* Top 3 Winners */}
                        {result.slice(0, 3).length > 0 && (
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'center',
                              flexWrap: 'wrap',
                              gap: { xs: 2, md: 4 },
                              p: 3,
                              pb: 4,
                              backgroundColor: 'rgba(245, 248, 255, 0.8)',
                            }}
                          >
                            {/* Second Place */}
                            {result.length > 1 && (
                              <Box
                                sx={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  mt: { xs: 3, md: 6 },
                                  order: { xs: 2, md: 1 },
                                }}
                              >
                                <Avatar
                                  sx={{
                                    width: { xs: 80, md: 100 },
                                    height: { xs: 80, md: 100 },
                                    bgcolor: '#C0C0C0',
                                    border: '4px solid white',
                                    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                                    fontSize: '2rem',
                                    mb: 1,
                                  }}
                                >
                                  🥈
                                </Avatar>
                                <Typography
                                  variant="h6"
                                  fontWeight={600}
                                  sx={{ mb: 0.5 }}
                                >
                                  {result[1]?.name || 'Player 2'}
                                </Typography>
                                <Chip
                                  label={`${result[1]?.score || 0} pts`}
                                  sx={{
                                    backgroundColor: '#C0C0C0',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    fontSize: '0.9rem',
                                  }}
                                />
                              </Box>
                            )}

                            {/* First Place */}
                            {result.length > 0 && (
                              <Box
                                sx={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  order: { xs: 1, md: 2 },
                                }}
                              >
                                <Avatar
                                  sx={{
                                    width: { xs: 100, md: 130 },
                                    height: { xs: 100, md: 130 },
                                    bgcolor: '#FFD700',
                                    border: '4px solid white',
                                    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                                    fontSize: '2.5rem',
                                    mb: 1,
                                  }}
                                >
                                  🥇
                                </Avatar>
                                <Typography
                                  variant="h5"
                                  fontWeight={700}
                                  sx={{ mb: 0.5 }}
                                >
                                  {result[0]?.name || 'Player 1'}
                                </Typography>
                                <Chip
                                  label={`${result[0]?.score || 0} pts`}
                                  sx={{
                                    backgroundColor: '#FFD700',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    fontSize: '1rem',
                                    px: 1,
                                  }}
                                />
                              </Box>
                            )}

                            {/* Third Place */}
                            {result.length > 2 && (
                              <Box
                                sx={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  mt: { xs: 3, md: 7 },
                                  order: { xs: 3, md: 3 },
                                }}
                              >
                                <Avatar
                                  sx={{
                                    width: { xs: 70, md: 90 },
                                    height: { xs: 70, md: 90 },
                                    bgcolor: '#CD7F32',
                                    border: '4px solid white',
                                    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                                    fontSize: '1.8rem',
                                    mb: 1,
                                  }}
                                >
                                  🥉
                                </Avatar>
                                <Typography
                                  variant="h6"
                                  fontWeight={600}
                                  sx={{ mb: 0.5 }}
                                >
                                  {result[2]?.name || 'Player 3'}
                                </Typography>
                                <Chip
                                  label={`${result[2]?.score || 0} pts`}
                                  sx={{
                                    backgroundColor: '#CD7F32',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    fontSize: '0.9rem',
                                  }}
                                />
                              </Box>
                            )}
                          </Box>
                        )}

                        {/* Other Players */}
                        {result.slice(3, 10).length > 0 && (
                          <TableContainer sx={{ p: 3 }}>
                            <Typography
                              variant="h6"
                              fontWeight={600}
                              sx={{ mb: 2, color: 'rgba(0, 0, 0, 0.7)' }}
                            >
                              Other Top Players
                            </Typography>
                            <Table>
                              <TableBody>
                                {result.slice(3, 10).map((player, index) => (
                                  <TableRow
                                    key={player.id || index}
                                    sx={{
                                      '&:hover': {
                                        backgroundColor: 'rgba(0, 0, 0, 0.03)',
                                      },
                                      transition: 'background-color 0.2s',
                                    }}
                                  >
                                    <TableCell
                                      align="center"
                                      sx={{
                                        fontSize: 18,
                                        fontWeight: 600,
                                        color: 'rgba(0, 0, 0, 0.6)',
                                        width: '15%',
                                      }}
                                    >
                                      {index + 4}
                                    </TableCell>
                                    <TableCell
                                      align="left"
                                      sx={{
                                        fontSize: 16,
                                        fontWeight: 500,
                                        width: '60%',
                                      }}
                                    >
                                      {player.name || `Player ${index + 4}`}
                                    </TableCell>
                                    <TableCell
                                      align="right"
                                      sx={{
                                        fontSize: 16,
                                        fontWeight: 700,
                                        color:
                                          bigBrainTheme.palette.primary.main,
                                        width: '25%',
                                      }}
                                    >
                                      {player.score || 0} pts
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        )}
                      </>
                    ) : (
                      <Box sx={{ p: 5, textAlign: 'center' }}>
                        <Typography variant="h6" color="text.secondary">
                          No players to display! 🛑
                        </Typography>
                        <Typography sx={{ mt: 1, color: 'text.secondary' }}>
                          Results will appear once players have completed the
                          game.
                        </Typography>
                      </Box>
                    )}
                  </Box>
                )}

                {showStats && (
                  <Box
                    sx={{
                      width: '100%',
                      maxWidth: 900,
                      mx: 'auto',
                      borderRadius: 4,
                      bgcolor: 'rgba(255, 255, 255, 0.95)',
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        p: 3,
                        textAlign: 'center',
                        backgroundColor: bigBrainTheme.palette.primary.main,
                      }}
                    >
                      <Typography
                        variant="h4"
                        fontWeight={700}
                        sx={{
                          color: 'white',
                          textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        }}
                      >
                        Game Statistics
                      </Typography>
                    </Box>

                    <Box sx={{ p: 4 }}>
                      <Box sx={{ mb: 6 }}>
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          sx={{ mb: 3, color: 'rgba(0, 0, 0, 0.7)' }}
                        >
                          Performance by Question
                        </Typography>
                        <Paper
                          elevation={2}
                          sx={{
                            p: 3,
                            borderRadius: 2,
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          }}
                        >
                          <ResultBarChart />
                        </Paper>
                      </Box>

                      <Box>
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          sx={{ mb: 3, color: 'rgba(0, 0, 0, 0.7)' }}
                        >
                          Score Distribution
                        </Typography>
                        <Paper
                          elevation={2}
                          sx={{
                            p: 3,
                            borderRadius: 2,
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          }}
                        >
                          <ResultLineChart />
                        </Paper>
                      </Box>
                    </Box>
                  </Box>
                )}
              </Box>
            </Fade>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default GameResult;
