import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Paper,
  ThemeProvider,
  CssBaseline,
  CircularProgress,
  LinearProgress,
  Alert,
  Button,
} from '@mui/material';
import ApiCall from './apiCall';
import bigBrainTheme from '../theme/bigBrainTheme';
import GlobalStyles from '../theme/globalStyles';

/**
 * GamePlay component where players interact with the active game
 * This is a placeholder and would need to be implemented with the actual game logic
 */
function GamePlay() {
  const { playerId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [timeLeft, setTimeLeft] = useState(-1);
  const [submitAnswer, setSubmitAnswer] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    const fetchQuestionData = async () => {
      try {
        const response = await ApiCall(`/play/${playerId}/question`, {}, 'GET');

        if (response.error) {
          throw new Error(response.error);
        }

        setCurrentQuestion(response.question);
        setTimeLeft(response.question.timeLimit);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch question data.');
        setLoading(false);
      }
    };

    fetchQuestionData();
  }, [playerId]);

  useEffect(() => {
    const getActualResult = async () => {
      try {
        const data = await ApiCall(`/play/${playerId}/answer`, {}, 'GET');

        if (data.error) {
          throw new Error(data.error);
        }

        console.log(data);
      } catch (err) {
        console.error(err);
      }
    };

    if (timeLeft === 0) getActualResult();
  }, [timeLeft]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [currentQuestion]);

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
            background: bigBrainTheme.palette.background.default,
          }}
        >
          <CircularProgress size={60} />
        </Box>
      </ThemeProvider>
    );
  }

  if (error) {
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
            background: bigBrainTheme.palette.background.default,
          }}
        >
          <Container maxWidth='sm'>
            <Alert severity='error' sx={{ borderRadius: 2 }}>
              {error}
            </Alert>
          </Container>
        </Box>
      </ThemeProvider>
    );
  }

  const handleSubmitAnswer = async (index) => {
    setSubmitAnswer(true);
    setSelectedIndex(index);

    const answers = ['A Shark wearing Nike'];

    try {
      const data = await ApiCall(
        `/play/${playerId}/answer`,
        { answers },
        'PUT',
      );
      console.log(data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <ThemeProvider theme={bigBrainTheme}>
      <CssBaseline />
      <GlobalStyles />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          background: bigBrainTheme.palette.background.default,
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
        <Paper
          elevation={10}
          sx={{
            width: '80%',
            margin: 'auto',
            marginTop: 15,
            p: 4,
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            backgroundImage: 'linear-gradient(to right, #ffffff, #f8f9fa)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Box
              sx={{
                flex: '1 1 50%',
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
              }}
            >
              <Typography variant='h5' sx={{ fontWeight: 'bold', mb: 2 }}>
                {currentQuestion.text || 'Default Question Text'}
              </Typography>

              {currentQuestion.imageUrl && (
                <img
                  src={currentQuestion.imageUrl}
                  alt='Question-related content'
                  style={{
                    width: '100%', // Stretches to fit the box width
                    height: '400px', // Keeps the aspect ratio intact
                    borderRadius: '8px', // Optional: Adds rounded corners
                  }}
                />
              )}
              {currentQuestion.videoUrl && (
                <iframe
                  style={{
                    width: '100%',
                    height: '400px',
                  }}
                  src={currentQuestion.videoUrl}
                  title='YouTube video player'
                  frameBorder='0'
                  allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                  referrerPolicy='strict-origin-when-cross-origin'
                  allowFullScreen
                ></iframe>
              )}
            </Box>

            <Box
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                width: '300px',
                height: '40px',
                backgroundColor: '#333', // Container background (for any gaps)
                borderRadius: '8px',
                boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {/* Base black layer representing time already passed */}
              <Box
                sx={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'black',
                  zIndex: 1,
                }}
              />

              {/* LinearProgress for remaining time, rendered as plain purple */}
              <LinearProgress
                variant='determinate'
                value={(timeLeft / currentQuestion?.timeLimit) * 100}
                sx={{
                  flex: 1,
                  height: '100%',
                  position: 'relative',
                  zIndex: 2,
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#bf77f6',
                  },
                }}
              />

              {/* Remaining time text displayed on top */}
              <Typography
                variant='body1'
                sx={{
                  position: 'absolute',
                  width: '100%',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  color: 'white',
                  zIndex: 3,
                }}
              >
                {timeLeft}s
              </Typography>
            </Box>

            <Box
              sx={{
                flex: '1 1 50%',
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 2,
              }}
            >
              {currentQuestion.answers.map((answer, index) => (
                <Button
                  key={index}
                  variant='contained'
                  color='primary'
                  sx={{
                    flex: '1 1 calc(50% - 8px)',
                    height: 64,
                    fontWeight: 'bold',
                    border: selectedIndex === index ? '3px solid #000' : 'none',
                  }}
                  onClick={() => handleSubmitAnswer(index)}
                  disabled={submitAnswer}
                >
                  {answer.text}
                </Button>
              ))}
            </Box>
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}

export default GamePlay;
