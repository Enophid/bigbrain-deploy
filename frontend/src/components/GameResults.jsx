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
import ResultBarChart from './GameEditor/ResultBarChat';
import ResultLineChart from './GameEditor/ResultLineChart';

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

 
  );
};

export default GameResult;
