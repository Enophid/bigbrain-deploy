import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Divider,
  Modal,
  Paper,
  Grid,
  Fade,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import bigBrainTheme from '../../theme/bigBrainTheme';

const QuestionModal = ({ 
  open, 
  onClose, 
  currentQuestion, 
  game, 
  onSave, 
  error, 
  displayAlert 
}) => {
  // State for the question form
  const [newQuestion, setNewQuestion] = useState({
    text: '',
    type: 'single',
    timeLimit: 30,
    points: 10,
    answers: [
      { id: 1, text: '', isCorrect: true },
      { id: 2, text: '', isCorrect: false },
    ],
  });

  // Update form when current question changes
  useEffect(() => {
    if (currentQuestion) {
      setNewQuestion({
        ...currentQuestion,
        answers: currentQuestion.answers
          ? currentQuestion.answers.map((ans, idx) => ({
            // Generate unique IDs to avoid collisions
            id: Date.now() + idx,
            text: ans.text || '',
            isCorrect: ans.isCorrect || false,
          }))
          : [
            { id: Date.now(), text: '', isCorrect: true },
            { id: Date.now() + 1, text: '', isCorrect: false },
          ],
      });
    } else {
      // Reset form for new question
      const now = Date.now();
      setNewQuestion({
        text: '',
        type: 'single',
        timeLimit: 30,
        points: 10,
        answers: [
          { id: now, text: '', isCorrect: true },
          { id: now + 1, text: '', isCorrect: false },
        ],
      });
    }
  }, [currentQuestion, open]);

  // Handle form field changes
  const handleQuestionChange = (field, value) => {
    setNewQuestion((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle save
  const handleSaveQuestion = async () => {
    try {
      // If we already have an error state set, the game likely doesn't exist
      if (error.includes('not found')) {
        console.error('Cannot save question: Game not found');
        displayAlert(
          'Cannot save question because the game does not exist. Please return to dashboard and try again.'
        );
        onClose();
        return;
      }

      // Create a copy of the current game's questions
      let updatedQuestions = [...(game.questions || [])];

      if (currentQuestion) {
        // Update existing question
        const questionIndex = updatedQuestions.findIndex(
          (q) => q.id === currentQuestion.id
        );
        if (questionIndex !== -1) {
          updatedQuestions[questionIndex] = {
            ...newQuestion,
            id: currentQuestion.id,
          };
        }
      } else {
        // Add new question with a unique timestamp-based ID
        const newId = Date.now();
        updatedQuestions.push({ ...newQuestion, id: newId });
      }

      // Call the onSave handler from parent
      await onSave(updatedQuestions);
    } catch (err) {
      console.error('Failed to save question:', err.message);
      displayAlert(`Error saving question: ${err.message}`);
    }
  };

  
};

export default QuestionModal;

QuestionModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  currentQuestion: PropTypes.object,
  game: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  error: PropTypes.string,
  displayAlert: PropTypes.func
}; 