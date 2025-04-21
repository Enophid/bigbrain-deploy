import { useState, useEffect, useCallback } from 'react';
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
  Card,
  CardContent,
  Chip,
  Zoom,
  Fade,
  Avatar,
  Stack,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  QuestionAnswer as QuestionIcon,
} from '@mui/icons-material';
import ApiCall from './apiCall';
import bigBrainTheme from '../theme/bigBrainTheme';
import GlobalStyles from '../theme/globalStyles';

/**
 * GamePlay component where players interact with the active game
 */
function GamePlay() {
  const { playerId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [timeLeft, setTimeLeft] = useState(-1);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [waitingForNextQuestion, setWaitingForNextQuestion] = useState(false);
  const [answerError, setAnswerError] = useState('');
  const [answerPeriodEnded, setAnswerPeriodEnded] = useState(false);
  const [lastSubmittedAnswer, setLastSubmittedAnswer] = useState([]);
  const [shouldCheckAnswers, setShouldCheckAnswers] = useState(false);
  const [lastPollTime, setLastPollTime] = useState(Date.now());

  /**
   * Calculate remaining time based on server's start time and time limit
   */
  const calculateRemainingTime = (question) => {
    if (!question || !question.isoTimeLastQuestionStarted) return 30;
    
    // Get timestamps
    const startTime = new Date(question.isoTimeLastQuestionStarted).getTime();
    const currentTime = new Date().getTime();
    const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
    
    // Use the question's duration property with proper fallback
    const timeLimit = parseInt(question.duration || 30, 10);
    
    console.log(`Question duration: ${timeLimit}s, elapsed: ${elapsedSeconds}s`);
    
    // Calculate remaining time WITHOUT any buffer so users see the full time
    const remainingTime = Math.max(0, timeLimit - elapsedSeconds);
    
    return remainingTime;
  };

  /**
   * Checks if the question from the API is different from our current question
   */
  const checkForQuestionUpdate = (newQuestion) => {
    if (!newQuestion || !currentQuestion) return true;
    
    // Compare key properties to determine if it's a different question
    if (
      newQuestion.position !== currentQuestion.position ||
      newQuestion.text !== currentQuestion.text ||
      newQuestion.isoTimeLastQuestionStarted !== currentQuestion.isoTimeLastQuestionStarted
    ) {
      console.log('New question detected', { 
        current: currentQuestion.position, 
        new: newQuestion.position 
      });
      return true;
    }
    
    return false;
  };

  /**
   * Fetch the current question data
   */
  const fetchQuestionData = useCallback(async () => {
    try {
      const response = await ApiCall(`/play/${playerId}/question`, {}, 'GET');

      if (response.error) {
        throw new Error(response.error);
      }

      // If we got a different question than before
      if (checkForQuestionUpdate(response.question)) {
        // Reset states for new question
        setSelectedAnswers([]);
        setLastSubmittedAnswer([]);
        setAnswerSubmitted(false);
        setShowResults(false);
        setCorrectAnswers([]);
        setWaitingForNextQuestion(false);
        setAnswerPeriodEnded(false);
        setAnswerError('');
        setShouldCheckAnswers(false);

        // Set the new question and its timer
        setCurrentQuestion(response.question);
        
        // Calculate remaining time with buffer
        const remainingTime = calculateRemainingTime(response.question);
        console.log(`Question started, ${remainingTime}s remaining (with buffer)`);
        
        // If time has expired or nearly expired, mark answer period as ended
        if (remainingTime <= 0) {
          setAnswerPeriodEnded(true);
          setTimeLeft(0);
          setShouldCheckAnswers(true);
        } else {
          setTimeLeft(remainingTime);
        }
      }

      setLoading(false);
      setLastPollTime(Date.now());
    } catch (err) {
      if (err.message === 'Session has not started yet') {
        // Handle the case where we're waiting for the game to start
        setWaitingForNextQuestion(true);
      } else {
        setError(err.message || 'Failed to fetch question data.');
      }
      setLoading(false);
      setLastPollTime(Date.now());
    }
  }, [playerId, currentQuestion]);

  /**
   * Initial data load
   */
  useEffect(() => {
    fetchQuestionData();
  }, [fetchQuestionData]);

  /**
   * Effect to trigger answer checking when the flag is set
   */
  useEffect(() => {
    if (shouldCheckAnswers) {
      getAnswerResults();
      setShouldCheckAnswers(false);
    }
  }, [shouldCheckAnswers]);

  /**
   * Poll for question updates (every 3 seconds)
   */
  useEffect(() => {
    if (waitingForNextQuestion) {
      const intervalId = setInterval(() => {
        fetchQuestionData();
      }, 3000);
      
      return () => clearInterval(intervalId);
    }
  }, [fetchQuestionData, waitingForNextQuestion]);

  /**
   * Poll for question updates to check for a new question
   */
  useEffect(() => {
    // Set up polling for new questions - checks every 2 seconds
    const pollInterval = setInterval(() => {
      // Only poll if we haven't polled recently (minimum 1.5 seconds between polls)
      if (Date.now() - lastPollTime > 1500) {
        fetchQuestionData();
      }
    }, 2000);

    // Clean up interval on unmount
    return () => clearInterval(pollInterval);
  }, [fetchQuestionData, lastPollTime]);

  /**
   * Timer countdown
   */
  useEffect(() => {
    if (timeLeft > 0 && !showResults) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime > 0 ? prevTime - 1 : 0;
          
          // When timer hits 0, get results and mark answer period as ended
          if (newTime === 0 && !showResults) {
            console.log('Timer reached zero, ending answer period...');
            setAnswerPeriodEnded(true);
            // Set flag to check answers rather than calling directly
            setShouldCheckAnswers(true);
          }
          return newTime;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, showResults]);

  /**
   * Get correct answers and results when time expires
   */
  const getAnswerResults = async () => {
    try {
      // Only get answer results if:
      // 1. We haven't already shown results
      // 2. And timer has actually expired (timeLeft is 0) or answer period has ended
      if (!showResults && (timeLeft === 0 || answerPeriodEnded)) {
        console.log('Attempting to get answer results...');
        
        const data = await ApiCall(`/play/${playerId}/answer`, {}, 'GET');

        if (data.error) {
          if (data.error.includes("Answers are not available yet")) {
            // If answers aren't available yet, try again after a short delay
            console.log("Answers not yet available, retrying in 2 seconds...");
            setTimeout(() => getAnswerResults(), 2000);
            return;
          }
          throw new Error(data.error);
        }

        console.log('Successfully retrieved answers:', data.answers);
        setCorrectAnswers(data.answers || []);
        setShowResults(true);

        // After showing results, we're waiting for next question
        setWaitingForNextQuestion(true);
      } else if (!showResults) {
        console.log('Not checking answers yet - timer still running or results already shown');
      }
    } catch (err) {
      console.error('Failed to get answer results:', err);
      // If there's an error, try again after a short delay, but only if timer has expired
      if (!showResults && (timeLeft === 0 || answerPeriodEnded)) {
        console.log('Retrying to get answer results in 2 seconds...');
        setTimeout(() => getAnswerResults(), 2000);
      }
    }
  };

  /**
   * Submit answers to the server - direct fetch implementation
   */
  const submitAnswer = async (answerArray) => {
    // Remove the submission buffer check to allow submitting until timer hits 0
    
    // Additional checks
    if (answerPeriodEnded || showResults) {
      console.log('Not submitting - answer period ended or showing results');
      return false;
    }
    
    if (!answerArray || answerArray.length === 0) {
      console.log('Not submitting - empty answers array');
      return false;
    }
    
    if (JSON.stringify(answerArray) === JSON.stringify(lastSubmittedAnswer)) {
      console.log('Not submitting - same as previous submission');
      return false;
    }

    try {
      console.log('Submitting answer:', answerArray);
      
      // Update UI state immediately
      setSelectedAnswers(answerArray);
      setLastSubmittedAnswer(answerArray);
      setAnswerSubmitted(true);
      
      // Use ApiCall instead of fetch directly
      console.log('Submitting answer:', answerArray);
      const data = await ApiCall(`/play/${playerId}/answer`, { answers: answerArray }, 'PUT');
      
      if (data.error) {
        if (data.error.includes("Can't answer question once answer is available")) {
          console.log('Answer period has ended on the server');
          setAnswerPeriodEnded(true);
          return false;
        }
        
        console.error('Error submitting answer:', data.error);
        setAnswerError(data.error);
        return false;
      }
      
      console.log('Answer submitted successfully!');
      setAnswerError('');
      return true;
    } catch (error) {
      console.error('Network error in submitAnswer:', error);
      setAnswerError(`Network error: ${error.message || 'Unknown error'}`);
      return false;
    }
  };

  /**
   * Handle answer selection
   */
  const handleAnswerSelect = (answerText) => {
    console.log('Attempting to select answer:', answerText);
    console.log('Current state:', { timeLeft, showResults, answerPeriodEnded });
    
    // Check if the user can select an answer (only when timer > 0 and not showing results)
    const shouldNotSelect = timeLeft <= 0 || showResults || answerPeriodEnded;
    
    if (shouldNotSelect) {
      console.log('Cannot select answer - timer expired or results shown');
      return;
    }

    // Set the new selected answers
    let newSelectedAnswers = [...selectedAnswers];

    // For single choice and judgement questions, only allow one selection
    if (
      currentQuestion.type === 'single' ||
      currentQuestion.type === 'judgement'
    ) {
      newSelectedAnswers = [answerText];
    } else {
      // For multiple choice questions, toggle the selection
      if (newSelectedAnswers.includes(answerText)) {
        newSelectedAnswers = newSelectedAnswers.filter(
          (ans) => ans !== answerText
        );
      } else {
        newSelectedAnswers.push(answerText);
      }
    }

    console.log('New selected answers:', newSelectedAnswers);
    
    // Update UI immediately
    setSelectedAnswers(newSelectedAnswers);
    
    // Submit immediately if we have answers
    if (newSelectedAnswers.length > 0) {
      submitAnswer(newSelectedAnswers);
    }
  };

  const getButtonColor = (answer) => {
    if (showResults && correctAnswers.includes(answer.text)) return 'success';
    if (showResults && selectedAnswers.includes(answer.text)) return 'error';
    return 'primary';
  };

  const getResultIcon = (answer) => {
    if (!showResults) return null;
    if (correctAnswers.includes(answer.text)) 
      return <CheckCircleIcon color="success" />;
    if (selectedAnswers.includes(answer.text) && !correctAnswers.includes(answer.text)) 
      return <CancelIcon color="error" />;
    return null;
  };

  /**
   * Get the appropriate result message based on answer status
   */
  const getResultMessage = () => {
    if (selectedAnswers.length === 0) {
      return "Time's up! You didn't select an answer.";
    }
    
    return correctAnswers.some((ans) => selectedAnswers.includes(ans))
      ? 'Good job! Your answer is correct.'
      : "Sorry, that's not correct.";
  };

  /**
   * Get the appropriate avatar background color based on selection state
   */
  const getAvatarBgColor = (isSelected, showResults, isCorrect) => {
    if (!isSelected) return 'rgba(0,0,0,0.08)';
    
    if (showResults) {
      return isCorrect ? '#4caf50' : '#f44336';
    }
    
    return '#1976d2';
  };

  /**
   * Get background color for the answer option box
   */
  const getAnswerBoxBgColor = (showResults, isCorrect) => {
    if (showResults && isCorrect) {
      return 'rgba(76, 175, 80, 0.1)';
    }
    return 'transparent';
  };

  /**
   * Calculate remaining time as a percentage for the progress bar
   */
  const calculateRemainingTimePercent = () => {
    if (!currentQuestion) return 0;
    const totalDuration = parseInt(currentQuestion.duration || 30, 10);
    return (timeLeft / totalDuration) * 100;
  };

  /**
   * Get color for the timer based on time remaining
   */
  const getTimerColor = () => {
    const percent = calculateRemainingTimePercent();
    if (percent < 30) return 'error';
    if (percent < 60) return 'warning';
    return 'success';
  };

  /**
   * Format time left in MM:SS format
   */
  const formatTimeLeft = (seconds) => {
    if (seconds < 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  /**
   * Render loading state
   */
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
            background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" sx={{ color: 'white', mb: 3, fontWeight: 'bold' }}>
              BigBrain
            </Typography>
            <CircularProgress size={60} sx={{ color: '#fff' }} />
            <Typography variant="body1" sx={{ color: 'white', mt: 2 }}>
              Loading your game...
            </Typography>
          </Box>
        </Box>
      </ThemeProvider>
    );
  }

  /**
   * Render error state
   */
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
            background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
          }}
        >
          <Container maxWidth="sm">
            <Fade in={true} timeout={800}>
              <Alert 
                severity="error" 
                variant="filled"
                sx={{ 
                  borderRadius: 2,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                }}
              >
                <Typography variant="h6">Oops!</Typography>
                {error}
              </Alert>
            </Fade>
          </Container>
        </Box>
      </ThemeProvider>
    );
  }

  /**
   * Render waiting for game to start or next question
   */
  if (waitingForNextQuestion && !currentQuestion) {
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
            backgroundSize: '400% 400%',
            animation: 'gradient 15s ease infinite',
            '@keyframes gradient': {
              '0%': { backgroundPosition: '0% 50%' },
              '50%': { backgroundPosition: '100% 50%' },
              '100%': { backgroundPosition: '0% 50%' },
            },
          }}
        >
          <Container maxWidth="sm">
            <Zoom in={true} timeout={500}>
              <Card
                sx={{
                  p: 4,
                  borderRadius: 3,
                  boxShadow: '0 16px 48px rgba(0,0,0,0.25)',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <QuestionIcon sx={{ fontSize: 60, color: '#00B4D8', mb: 2 }} />
                  <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Get Ready!
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 4, fontSize: '1.1rem' }}>
                    Waiting for the host to start the game or advance to the next
                    question.
                  </Typography>
                  <CircularProgress 
                    sx={{ 
                      color: '#00B4D8',
                      '& .MuiCircularProgress-circle': {
                        strokeLinecap: 'round',
                      }
                    }} 
                  />
                </CardContent>
              </Card>
            </Zoom>
          </Container>
        </Box>
      </ThemeProvider>
    );
  }

  /**
   * Main game content
   */
  return (
    <ThemeProvider theme={bigBrainTheme}>
      <CssBaseline />
      <GlobalStyles />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundImage: 'linear-gradient(135deg, #2D3047 0%, #00B4D8 50%, #06D6A0 100%)',
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
              {/* Timer display and question badge */}
              <Box 
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: '100%',
                  mb: 2,
                }}
              >
                <Box sx={{ width: '100%', mb: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={calculateRemainingTimePercent()}
                    color={showResults ? 'secondary' : getTimerColor()}
                    sx={{ 
                      height: 10, 
                      borderRadius: 5,
                      '& .MuiLinearProgress-bar': {
                        transition: 'transform 1s linear',
                      }
                    }}
                  />
                </Box>
                
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {/* Timer display */}
                  <Typography 
                    variant="h6" 
                    component="div"
                    color={showResults ? 'secondary.main' : getTimerColor()}
                    sx={{ 
                      fontWeight: 'bold',
                      fontSize: { xs: '0.9rem', sm: '1.1rem' },
                      transition: 'color 0.3s ease'
                    }}
                  >
                    {showResults ? "Results" : formatTimeLeft(timeLeft)}
                  </Typography>
                  

                </Box>
              </Box>

              {/* Question content */}
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 'bold',
                    mb: 3,
                    color: '#1a237e',
                    lineHeight: 1.3,
                  }}
                >
                  {currentQuestion?.text || 'Question'}
                </Typography>

                {/* Media content (image or video) */}
                {currentQuestion?.imageUrl && (
                  <Box
                    sx={{ 
                      position: 'relative',
                      mb: 4,
                      borderRadius: 3,
                      overflow: 'hidden',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    }}
                  >
                    <Box
                      component="img"
                      src={currentQuestion.imageUrl}
                      alt="Question media"
                      sx={{
                        width: '100%',
                        maxHeight: '400px',
                        objectFit: 'contain',
                        display: 'block',
                      }}
                    />
                  </Box>
                )}

                {currentQuestion?.videoUrl && (
                  <Box
                    sx={{ 
                      position: 'relative',
                      mb: 4,
                      borderRadius: 3,
                      overflow: 'hidden',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    }}
                  >
                    <Box
                      component="iframe"
                      src={currentQuestion.videoUrl}
                      title="Question video"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      sx={{
                        width: '100%',
                        height: '400px',
                        display: 'block',
                      }}
                    />
                  </Box>
                )}
              </Box>

              {/* Results message (if showing results) */}
              {showResults && (
                <Fade in={true} timeout={800}>
                  <Box
                    sx={{
                      mb: 4,
                      p: 3,
                      borderRadius: 3,
                      backgroundColor: correctAnswers.some(ans => selectedAnswers.includes(ans)) 
                        ? 'rgba(76, 175, 80, 0.1)' 
                        : 'rgba(244, 67, 54, 0.1)',
                      border: `1px solid ${correctAnswers.some(ans => selectedAnswers.includes(ans)) 
                        ? 'rgba(76, 175, 80, 0.3)' 
                        : 'rgba(244, 67, 54, 0.3)'}`,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      {selectedAnswers.length > 0 && correctAnswers.some(ans => selectedAnswers.includes(ans)) ? (
                        <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 28, mr: 1.5 }} />
                      ) : (
                        <CancelIcon sx={{ color: '#f44336', fontSize: 28, mr: 1.5 }} />
                      )}
                      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                        {getResultMessage()}
                      </Typography>
                    </Box>

                    <Typography variant="body1" sx={{ mb: 1.5, fontWeight: 'medium' }}>
                      Correct answer{correctAnswers.length > 1 ? 's' : ''}:
                    </Typography>

                    <Stack direction="row" flexWrap="wrap" gap={1}>
                      {correctAnswers.map((answer, idx) => (
                        <Chip
                          key={idx}
                          label={answer}
                          color="success"
                          sx={{ fontWeight: 'bold', px: 1 }}
                        />
                      ))}
                    </Stack>
                  </Box>
                </Fade>
              )}

              {/* Answer options */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                  gap: 2.5,
                }}
              >
                {currentQuestion?.answers?.map((answer, index) => {
                  const isSelected = selectedAnswers.includes(answer.text);
                  const isCorrect = correctAnswers.includes(answer.text);
                  const letterOptions = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
                  
                  return (
                    <Zoom in={true} timeout={300 + index * 100} key={`answer-${answer.text}-${index}`}>
                      <Button
                        variant={isSelected ? 'contained' : 'outlined'}
                        color={getButtonColor(answer)}
                        onClick={() => handleAnswerSelect(answer.text)}
                        disabled={showResults || answerPeriodEnded}
                        sx={{
                          height: 'auto',
                          minHeight: 72,
                          padding: 0,
                          position: 'relative',
                          textTransform: 'none',
                          borderRadius: 3,
                          overflow: 'hidden',
                          transition: 'all 0.2s',
                          boxShadow: isSelected ? 4 : 0,
                          '&:hover': {
                            transform: showResults ? 'none' : 'translateY(-3px)',
                            boxShadow: showResults ? 0 : 6,
                          },
                        }}
                      >
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          width: '100%', 
                          p: 0,
                          position: 'relative',
                          backgroundColor: getAnswerBoxBgColor(showResults, isCorrect),
                        }}>
                          <Avatar 
                            sx={{ 
                              bgcolor: getAvatarBgColor(isSelected, showResults, isCorrect),
                              color: isSelected ? '#fff' : '#1976d2',
                              m: 1.5,
                              transition: 'all 0.2s',
                              fontWeight: 'bold',
                            }}
                          >
                            {letterOptions[index]}
                          </Avatar>
                          
                          <Typography
                            sx={{
                              flex: 1,
                              textAlign: 'left',
                              p: 2,
                              pr: 3,
                              fontWeight: 'medium',
                              fontSize: '1rem',
                            }}
                          >
                            {answer.text}
                          </Typography>
                          
                          {getResultIcon(answer) && (
                            <Box sx={{ position: 'absolute', right: 12 }}>
                              {getResultIcon(answer)}
                            </Box>
                          )}
                        </Box>
                      </Button>
                    </Zoom>
                  );
                })}
              </Box>

              {/* Status message */}
              {answerSubmitted && !showResults && (
                <Fade in={true} timeout={500}>
                  <Typography
                    variant="body2"
                    color="primary"
                    sx={{ mt: 3, textAlign: 'center', fontWeight: 'medium' }}
                  >
                    Your answer has been submitted. You can change it until the timer
                    expires.
                  </Typography>
                </Fade>
              )}

              {answerError && (
                <Fade in={true} timeout={500}>
                  <Typography
                    variant="body2"
                    color="error"
                    sx={{ mt: 3, textAlign: 'center', fontWeight: 'medium' }}
                  >
                    Error: {answerError}
                  </Typography>
                </Fade>
              )}

              {showResults && (
                <Fade in={true} timeout={800}>
                  <Box sx={{ 
                    mt: 4, 
                    p: 2, 
                    borderRadius: 2, 
                    backgroundColor: 'rgba(0,0,0,0.04)',
                    textAlign: 'center'
                  }}>
                    <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
                      <CircularProgress size={18} sx={{ mr: 1.5 }} />
                      <Typography color="text.secondary" sx={{ fontWeight: 'medium' }}>
                        Waiting for the host to advance to the next question...
                      </Typography>
                    </Box>
                  </Box>
                </Fade>
              )}
            </Paper>
          </Fade>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default GamePlay;
