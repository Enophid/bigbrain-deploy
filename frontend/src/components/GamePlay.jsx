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
