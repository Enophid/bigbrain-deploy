import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';

/**
 * Get the button color based on the answer state.
 * Note: Removed dependency on props like answer.text, selectedAnswers, correctAnswers.
 * These need to be passed as arguments now.
 */
export const getButtonColor = (isSelected, isCorrect, showResults) => {
  if (showResults && isCorrect) return 'success';
  if (showResults && isSelected && !isCorrect) return 'error'; // Show error only if selected AND incorrect
  // 'primary' is default for contained (selected) or outlined (not selected) before results
  return 'primary';
};

/**
 * Get the result icon based on the answer state.
 * Note: Removed dependency on props. Passed as arguments.
 */
export const getResultIcon = (isSelected, isCorrect, showResults) => {
  if (!showResults) return null;
  if (isCorrect) return <CheckCircleIcon color="success" />;
  // Show cancel icon only if this specific answer was selected and it's incorrect
  if (isSelected && !isCorrect) return <CancelIcon color="error" />;
  return null;
};

/**
 * Get the appropriate result message based on answer status.
 * Note: Removed dependency on props. Passed as arguments.
 */
export const getResultMessage = (selectedAnswers, correctAnswers) => {
  // Check if any selected answer is among the correct answers
  const isAnyAnswerCorrect = correctAnswers.some((ans) =>
    selectedAnswers.includes(ans)
  );

  if (selectedAnswers.length === 0 && correctAnswers.length > 0) {
    return "Time's up! You didn't select an answer.";
  }

  if (selectedAnswers.length === 0 && correctAnswers.length === 0) {
    // Handle case where there might be no correct answer (e.g., survey question)
    return "Time's up!";
  }

  return isAnyAnswerCorrect
    ? 'Good job! Your answer is correct.'
    : "Sorry, that's not correct.";
};

/**
 * Get the appropriate avatar background color based on selection state.
 * Note: Removed dependency on props. Passed as arguments.
 */
export const getAvatarBgColor = (isSelected, showResults, isCorrect) => {
  if (!isSelected && !showResults) return 'rgba(0,0,0,0.08)'; // Default unselected
  if (!isSelected && showResults && isCorrect) return 'rgba(76, 175, 80, 0.1)'; // Unselected but correct answer shown
  if (!isSelected && showResults && !isCorrect) return 'rgba(0,0,0,0.08)'; // Unselected and incorrect answer shown

  // If selected:
  if (showResults) {
    return isCorrect ? '#4caf50' : '#f44336'; // Green if correct, Red if incorrect
  }

  // If selected and results not shown yet:
  return '#1976d2'; // Blue (primary theme color)
};

/**
 * Get background color for the answer option box.
 * Note: Removed dependency on props. Passed as arguments.
 */
export const getAnswerBoxBgColor = (showResults, isCorrect) => {
  if (showResults && isCorrect) {
    // Highlight correct answers when results are shown
    return 'rgba(76, 175, 80, 0.1)';
  }
  // Keep background transparent otherwise
  return 'transparent';
};

/**
 * Calculate remaining time as a percentage for the progress bar.
 */
export const calculateRemainingTimePercent = (timeLeft, currentQuestion) => {
  if (!currentQuestion || timeLeft < 0) return 0;
  const totalDuration = parseInt(currentQuestion.duration || 30, 10);
  if (totalDuration <= 0) return 0; // Avoid division by zero
  return Math.max(0, Math.min(100, (timeLeft / totalDuration) * 100)); // Clamp between 0 and 100
};

/**
 * Get color for the timer based on time remaining.
 */
export const getTimerColor = (timeLeft, currentQuestion) => {
  const percent = calculateRemainingTimePercent(timeLeft, currentQuestion);
  if (percent < 30) return 'error';
  if (percent < 60) return 'warning';
  return 'success';
};

/**
 * Format time left in MM:SS format.
 */
export const formatTimeLeft = (seconds) => {
  if (seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60); // Ensure whole seconds
  return `${mins.toString().padStart(2, '0')}:${secs
    .toString()
    .padStart(2, '0')}`;
};

/**
 * Calculate points based on speed (time taken) and question value.
 * Formula: Points = Base Question Points × Speed Multiplier
 * - Speed Multiplier decreases as time increases
 * - Faster answers get higher multipliers
 */
export const calculateSpeedPoints = (
  responseTime,
  questionDuration,
  basePoints
) => {
  // Default values
  basePoints = parseInt(basePoints || 10, 10);
  questionDuration = parseInt(questionDuration || 30, 10);

  // Ensure valid numbers and duration > 0
  if (
    isNaN(basePoints) ||
    isNaN(questionDuration) ||
    questionDuration <= 0 ||
    responseTime < 0
  ) {
    console.warn('Invalid input for calculateSpeedPoints:', {
      responseTime,
      questionDuration,
      basePoints,
    });
    return {
      basePoints,
      speedMultiplier: 0.5,
      finalPoints: Math.round(basePoints * 0.5),
      responseTime: responseTime ?? 0,
    };
  }

  // Calculate speed ratio (how quickly they answered)
  // A value of 1 means they used all the time, 0 means they answered instantly
  const speedRatio = Math.min(responseTime / questionDuration, 1);

  // Calculate speed multiplier from 0.5 to 2.0
  // Faster answers get higher multipliers (up to 2x for instant answers)
  // Even the slowest answer gets at least 0.5x
  const speedMultiplier = Math.max(0.5, 2 - 1.5 * speedRatio); // Ensure multiplier doesn't go below 0.5

  // Calculate final points
  const finalPoints = Math.round(basePoints * speedMultiplier);

  return {
    basePoints,
    speedMultiplier: Math.round(speedMultiplier * 100) / 100, // Round multiplier to 2 decimal places
    finalPoints,
    responseTime: Math.round(responseTime * 10) / 10, // Round response time to 1 decimal place
  };
};
