/**
 * Validates the JSON data for game imports
 * @param {Object} data - The parsed JSON data to validate
 * @returns {Object} - Object with valid flag and error message if invalid
 */

// Basic validation helpers
const validateBasicGameStructure = (data) => {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Invalid data format' };
  }

  if (!data.name || typeof data.name !== 'string') {
    return {
      valid: false,
      error: 'Game name is required and must be a string',
    };
  }

  if (data.thumbnail && typeof data.thumbnail !== 'string') {
    return { valid: false, error: 'Thumbnail must be a string URL' };
  }

  if (!Array.isArray(data.questions)) {
    return { valid: false, error: 'Questions must be an array' };
  }

  if (data.questions.length === 0) {
    return { valid: false, error: 'Game must have at least one question' };
  }

  return { valid: true };
};

// Validate a single answer
const validateAnswer = (answer, questionIndex, answerIndex) => {
  if (!answer.text || typeof answer.text !== 'string') {
    return {
      valid: false,
      error: `Question ${questionIndex + 1}, Answer ${
        answerIndex + 1
      }: Text is required and must be a string`,
    };
  }

  if (answer.isCorrect === undefined || typeof answer.isCorrect !== 'boolean') {
    return {
      valid: false,
      error: `Question ${questionIndex + 1}, Answer ${
        answerIndex + 1
      }: isCorrect is required and must be a boolean`,
    };
  }

  return { valid: true };
};

// Validate a single question
const validateQuestion = (question, index) => {
  if (!question.text || typeof question.text !== 'string') {
    return {
      valid: false,
      error: `Question ${index + 1}: Text is required and must be a string`,
    };
  }

  if (
    !question.type ||
    !['single', 'multiple', 'judgement'].includes(question.type)
  ) {
    return {
      valid: false,
      error: `Question ${
        index + 1
      }: Invalid type (must be single, multiple, or judgement)`,
    };
  }

  if (
    !question.duration ||
    typeof question.duration !== 'number' ||
    question.duration <= 0
  ) {
    return {
      valid: false,
      error: `Question ${index + 1}: Time duration must be a positive number`,
    };
  }

  if (
    !question.points ||
    typeof question.points !== 'number' ||
    question.points <= 0
  ) {
    return {
      valid: false,
      error: `Question ${index + 1}: Points must be a positive number`,
    };
  }

  if (!Array.isArray(question.answers) || question.answers.length === 0) {
    return {
      valid: false,
      error: `Question ${index + 1}: Answers must be a non-empty array`,
    };
  }

  // Check if there's at least one correct answer
  const hasCorrectAnswer = question.answers.some(
    (answer) => answer.isCorrect === true
  );
  if (!hasCorrectAnswer) {
    return {
      valid: false,
      error: `Question ${index + 1}: Must have at least one correct answer`,
    };
  }

  // Validate each answer
  for (let j = 0; j < question.answers.length; j++) {
    const answerResult = validateAnswer(question.answers[j], index, j);
    if (!answerResult.valid) {
      return answerResult;
    }
  }

  // Validate URLs if present
  if (question.imageUrl && typeof question.imageUrl !== 'string') {
    return {
      valid: false,
      error: `Question ${index + 1}: Image URL must be a string`,
    };
  }

  if (question.videoUrl && typeof question.videoUrl !== 'string') {
    return {
      valid: false,
      error: `Question ${index + 1}: Video URL must be a string`,
    };
  }

  return { valid: true };
};

// Main validation function
export const validateGameImport = (data) => {
  // Step 1: Validate basic game structure
  const basicValidation = validateBasicGameStructure(data);
  if (!basicValidation.valid) {
    return basicValidation;
  }

  // Step 2: Validate each question
  for (let i = 0; i < data.questions.length; i++) {
    const questionResult = validateQuestion(data.questions[i], i);
    if (!questionResult.valid) {
      return questionResult;
    }
  }

  // If all validations pass
  return { valid: true };
};
