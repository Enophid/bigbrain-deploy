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
} from '@mui/material';
import {
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import bigBrainTheme from '../theme/bigBrainTheme';
import GlobalStyles from '../theme/globalStyles';
import ApiCall from './apiCall';
import ResultBarChart from './GameEditor/ResultBarChat';
import ResultLineChart from './GameEditor/ResultLineChart';

const GameResult = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const hasFetched = useRef(false);
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleBackToGameEditor = () => {
    navigate(`/dashboard`);
  };

  useEffect(() => {
    const getResult = async () => {
      setLoading(true);
      try {
        const data = await ApiCall(
          `/admin/session/${sessionId}/results`,
          {},
          'GET',
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
          }}
        >
          <Box
            sx={{
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(8px)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              py: 2,
              px: { xs: 2, sm: 4 },
              mb: 4,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                color='inherit'
                onClick={handleBackToGameEditor}
                sx={{ mr: 2, color: 'white' }}
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography
                variant='h4'
                sx={{
                  color: '#fff',
                  fontWeight: 700,
                  textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.25rem' },
                }}
              >
                Game Result
              </Typography>
            </Box>
          </Box>

          {console.log(result)}
          {loading ? (
            <Box
              sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CircularProgress size={60} sx={{ marginRight: 2 }} />
              <Typography variant='h6'>Loading results...</Typography>
            </Box>
          ) : (
            <Box
              sx={{
                width: '100%',
                maxWidth: 600,
                mx: 'auto',
                mt: 4,
                textAlign: 'center',
                borderRadius: 3,
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                boxShadow: 3,
                p: 3,
              }}
            >
              <Typography variant='h4' fontWeight={600} sx={{ mb: 2 }}>
                🎉 Top Players 🎉
              </Typography>

              <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
                <Table>
                  <TableBody>
                    {result.slice(0, 5).length !== 0 ? (
                      result.slice(0, 5).map((player, index) => (
                        <TableRow key={player.id || index}>
                          <TableCell
                            align='center'
                            sx={{
                              fontSize: 18,
                              fontWeight: 600,
                              color:
                                index === 0
                                  ? 'gold'
                                  : index === 1
                                  ? 'silver'
                                  : index === 2
                                  ? 'brown'
                                  : 'text.primary',
                            }}
                          >
                            {index + 1}️⃣
                          </TableCell>
                          <TableCell
                            align='left'
                            sx={{ fontSize: 18, fontWeight: 500 }}
                          >
                            {player.name || `Player ${index + 1}`}
                          </TableCell>
                          <TableCell
                            align='right'
                            sx={{ fontSize: 18, fontWeight: 500 }}
                          >
                            {player.score || 0} 🏆
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} align='center'>
                          No players to display! 🛑
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
          <ResultBarChart />
          <ResultLineChart />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default GameResult;
