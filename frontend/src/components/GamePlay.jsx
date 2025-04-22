import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Paper,
  ThemeProvider,
  CssBaseline,
  CircularProgress,
  Fade,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import ApiCall from './apiCall';
import bigBrainTheme from '../theme/bigBrainTheme';
import GlobalStyles from '../theme/globalStyles';

// Import the new screen components
import LoadingScreen from './gameplay/LoadingScreen';
import ErrorScreen from './gameplay/ErrorScreen';
import WaitingScreen from './gameplay/WaitingScreen';
import GameEndScreen from './gameplay/GameEndScreen';

// Gameplay content components
import QuestionDisplay from './gameplay/QuestionDisplay';
import AnswerList from './gameplay/AnswerList';
import ResultOverlay from './gameplay/ResultOverlay';

/**
 * GamePlay component where players interact with the active game
 */
function GamePlay() {
  const { playerId } = useParams();
  const navigate = useNavigate();
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
  const [gameEnded, setGameEnded] = useState(false);
  const [playerResults, setPlayerResults] = useState(null);

  /**
   * Handles the specific error case where the game session has ended.
   * Attempts to fetch the final results.
   */
  const handleGameEndedError = async () => {
    console.log('Game session has ended, fetching final results...');
    try {
      const resultsData = await ApiCall(`/play/${playerId}/results`, {}, 'GET');
      if (resultsData) {
        console.log('Successfully retrieved final results:', resultsData);
        setPlayerResults(resultsData);
        setGameEnded(true);
        setWaitingForNextQuestion(false); // Ensure waiting state is cleared
        // Loading might already be false, but set it just in case
        setLoading(false);
      }
      // If resultsData is null/undefined but no error, maybe the game just ended without results?
      // Consider how to handle this case if necessary.
    } catch (resultsErr) {
      console.error('Error fetching final results:', resultsErr.message);
      setError(
        'Game has ended, but we could not retrieve your results. Please try again later.'
      );
      setLoading(false);
    }
  };

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
    const duration = parseInt(question.duration || 30, 10);

    console.log(`Question duration: ${duration}s, elapsed: ${elapsedSeconds}s`);

    // Calculate remaining time WITHOUT any buffer so users see the full time
    const remainingTime = Math.max(0, duration - elapsedSeconds);

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
      newQuestion.isoTimeLastQuestionStarted !==
        currentQuestion.isoTimeLastQuestionStarted
    ) {
      console.log('New question detected', {
        current: currentQuestion.position,
        new: newQuestion.position,
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
        console.log(
          `Question started, ${remainingTime}s remaining (with buffer)`
        );

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
        setWaitingForNextQuestion(true);
      } else if (
        err.message.includes('not an active session') ||
        err.message.includes('No active session') ||
        err.message.includes('Session is not active')
      ) {
        // Call the extracted handler
        handleGameEndedError();
      } else {
        setError(err.message || 'Failed to fetch question data.');
        setLoading(false);
      }
      // Ensure lastPollTime is updated even if there was an error
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
   * Calculates response time, speed points, and logs the result for the current question.
   */
  const calculateAndRecordQuestionResult = (
    question,
    answersFromApi,
    selected,
    submitted,
    lastSubmission
  ) => {
    // Added parameters for clarity
    const currentQ = question;
    if (!currentQ) return; // Guard clause

    try {
      const isCorrect = answersFromApi.some((answer) =>
        selected.includes(answer)
      );
      let responseTime = null;

      if (currentQ.isoTimeLastQuestionStarted) {
        const startTime = new Date(
          currentQ.isoTimeLastQuestionStarted
        ).getTime();
        let endTime;
        if (submitted && lastSubmission && lastSubmission.timestamp) {
          endTime = new Date(lastSubmission.timestamp || Date.now()).getTime();
        } else {
          endTime = new Date().getTime();
        }
        responseTime = (endTime - startTime) / 1000;
        currentQ.responseTime = responseTime; // Mutating prop, consider returning new object if preferred
      }

      let finalPoints = 0;
      if (isCorrect && responseTime !== null) {
        // Check responseTime is calculated
        const basePoints = parseInt(currentQ.points || 10, 10);
        const questionDuration = parseInt(currentQ.duration || 30, 10);

        // Use the imported helper function
        const pointsData = calculateSpeedPoints(
          responseTime,
          questionDuration,
          basePoints
        );

        currentQ.basePoints = basePoints;
        currentQ.speedMultiplier = pointsData.speedMultiplier;
        currentQ.finalPoints = pointsData.finalPoints;
        finalPoints = pointsData.finalPoints;

        console.log('Points calculation:', {
          basePoints,
          responseTime,
          questionDuration,
          speedMultiplier: pointsData.speedMultiplier,
          finalPoints: pointsData.finalPoints,
        });
      } else {
        currentQ.finalPoints = 0;
      }

      console.log('Question result:', {
        question: currentQ.text,
        position: currentQ.position,
        points: finalPoints,
        responseTime: responseTime ? Math.round(responseTime * 10) / 10 : null,
        correct: isCorrect,
        questionPoints: parseInt(currentQ.points || 10, 10),
        speedMultiplier: isCorrect ? currentQ.speedMultiplier : 0,
      });
    } catch (err) {
      console.error('Error calculating points:', err);
      // Set default values in case of error
      currentQ.basePoints = parseInt(currentQ.points || 10, 10);
      currentQ.finalPoints = 0;
      // Optionally re-throw or handle differently
    }
  };

  /**
   * Get correct answers and results when time expires
   */
  const getAnswerResults = async () => {
    try {
      if (!showResults && (timeLeft === 0 || answerPeriodEnded)) {
        console.log('Attempting to get answer results...');

        const data = await ApiCall(`/play/${playerId}/answer`, {}, 'GET');

        if (data.error) {
          if (data.error.includes('Answers are not available yet')) {
            console.log('Answers not yet available, retrying in 2 seconds...');
            setTimeout(getAnswerResults, 2000); // Pass function reference
            return;
          }
          setAnswerError(data.error);
          // Consider if throwing here is needed, or just setting error and returning
          // throw new Error(data.error);
          return; // Exit if there was an API error getting answers
        }

        console.log('Successfully retrieved answers:', data.answers);

        const answersFromApi = data.answers;
        if (!answersFromApi || !Array.isArray(answersFromApi)) {
          console.error('No valid answers data received from server');
          setCorrectAnswers([]);
          // Still show results page, but with no correct answers marked
        } else {
          setCorrectAnswers(answersFromApi || []);
          // Calculate points only if we received valid answers
          calculateAndRecordQuestionResult(
            currentQuestion,
            answersFromApi,
            selectedAnswers,
            answerSubmitted,
            lastSubmittedAnswer
          );
        }

        // Always show results and move to waiting state after attempting to get answers
        setShowResults(true);
        setWaitingForNextQuestion(true);
      } else if (!showResults) {
        console.log(
          'Not checking answers yet - timer still running or results already shown'
        );
      }
    } catch (err) {
      console.error('Failed to get answer results:', err);
      // If the API call itself fails (network error, etc.)
      if (!showResults && (timeLeft === 0 || answerPeriodEnded)) {
        console.log(
          'Retrying to get answer results in 2 seconds due to fetch error...'
        );
        setTimeout(getAnswerResults, 2000); // Pass function reference
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

    if (
      lastSubmittedAnswer &&
      lastSubmittedAnswer.answers &&
      JSON.stringify(answerArray) ===
        JSON.stringify(lastSubmittedAnswer.answers)
    ) {
      console.log('Not submitting - same as previous submission');
      return false;
    }

    try {
      console.log('Submitting answer:', answerArray);

      // Update UI state immediately
      setSelectedAnswers(answerArray);
      setLastSubmittedAnswer({
        answers: answerArray,
        timestamp: new Date().toISOString(),
      });
      setAnswerSubmitted(true);

      // Use ApiCall instead of fetch directly
      const payload = {
        answers: answerArray,
      };

      console.log('Submitting answer:', payload);
      console.log('Player ID:', playerId);
      const data = await ApiCall(`/play/${playerId}/answer`, payload, 'PUT');

      if (data.error) {
        if (
          data.error.includes("Can't answer question once answer is available")
        ) {
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
    if (
      selectedAnswers.includes(answer.text) &&
      !correctAnswers.includes(answer.text)
    )
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
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  /**
   * Calculate points based on speed (time taken) and question value
   * Formula: Points = Base Question Points × Speed Multiplier
   * - Speed Multiplier decreases as time increases
   * - Faster answers get higher multipliers
   */
  const calculateSpeedPoints = (responseTime, questionDuration, basePoints) => {
    // Default values
    basePoints = basePoints || 10;
    questionDuration = questionDuration || 30;

    // Calculate speed ratio (how quickly they answered)
    // A value of 1 means they used all the time, 0 means they answered instantly
    const speedRatio = Math.min(responseTime / questionDuration, 1);

    // Calculate speed multiplier from 0.5 to 2.0
    // Faster answers get higher multipliers (up to 2x for instant answers)
    // Even the slowest answer gets at least 0.5x
    const speedMultiplier = 2 - 1.5 * speedRatio;

    // Calculate final points
    const finalPoints = Math.round(basePoints * speedMultiplier);

    return {
      basePoints,
      speedMultiplier: Math.round(speedMultiplier * 100) / 100,
      finalPoints,
      responseTime: Math.round(responseTime * 10) / 10,
    };
  };

  // Function to view results without ending the game
  const handleViewResults = () => {
    navigate(`/player-results/${playerId}`);
  };

  /**
   * Render loading state
   */
  if (loading) {
    return <LoadingScreen />;
  }

  /**
   * Render error state
   */
  if (error) {
    return <ErrorScreen error={error} />;
  }

  /**
   * Render waiting for game to start or next question
   */
  if (waitingForNextQuestion && !currentQuestion) {
    return <WaitingScreen handleViewResults={handleViewResults} />;
  }

  /**
   * Render player performance results after game end
   */
  if (gameEnded && playerResults) {
    return <GameEndScreen handleViewResults={handleViewResults} />;
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
          backgroundImage:
            'linear-gradient(135deg, #2D3047 0%, #00B4D8 50%, #06D6A0 100%)',
          backgroundSize: '400% 400%',
          backgroundAttachment: 'fixed',
          animation: 'gradient 15s ease infinite',
          '@keyframes gradient': {
            '0%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' },
            '100%': { backgroundPosition: '0% 50%' },
          },
          pt: { xs: 3, sm: 5 },
          pb: 5,
          overflowX: 'hidden',
          flex: 1,
          justifyContent:
            currentQuestion?.imageUrl || currentQuestion?.videoUrl
              ? 'flex-start'
              : 'center',
        }}
      >
        <Container
          maxWidth="md"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            py: { xs: 2, sm: 3 },
          }}
        >
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
                display: 'flex',
                flexDirection: 'column',
                height: 'fit-content',
              }}
            >
              {/* Use QuestionDisplay component */}
              <QuestionDisplay
                currentQuestion={currentQuestion}
                timeLeft={timeLeft}
                showResults={showResults}
                calculateRemainingTimePercent={calculateRemainingTimePercent}
                getTimerColor={getTimerColor}
                formatTimeLeft={formatTimeLeft}
              />

              {/* Use ResultOverlay component */}
              {showResults && (
                <ResultOverlay
                  selectedAnswers={selectedAnswers}
                  correctAnswers={correctAnswers}
                  currentQuestion={currentQuestion} // Pass relevant parts if needed for points display
                  getResultMessage={getResultMessage}
                />
              )}

              {/* Use AnswerList component */}
              <AnswerList
                answers={currentQuestion?.answers}
                selectedAnswers={selectedAnswers}
                correctAnswers={correctAnswers}
                handleAnswerSelect={handleAnswerSelect}
                showResults={showResults}
                answerPeriodEnded={answerPeriodEnded}
                // Pass helper functions as props
                getButtonColor={getButtonColor}
                getResultIcon={getResultIcon}
                getAvatarBgColor={getAvatarBgColor}
                getAnswerBoxBgColor={getAnswerBoxBgColor}
              />

              {/* Status message */}
              {answerSubmitted && !showResults && (
                <Fade in={true} timeout={500}>
                  <Typography
                    variant="body2"
                    color="primary"
                    sx={{ mt: 3, textAlign: 'center', fontWeight: 'medium' }}
                  >
                    Your answer has been submitted. You can change it until the
                    timer expires.
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
                  <Box
                    sx={{
                      mt: 4,
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: 'rgba(0,0,0,0.04)',
                      textAlign: 'center',
                    }}
                  >
                    <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
                      <CircularProgress size={18} sx={{ mr: 1.5 }} />
                      <Typography
                        color="text.secondary"
                        sx={{ fontWeight: 'medium' }}
                      >
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
