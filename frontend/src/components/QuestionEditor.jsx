import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ThemeProvider,
  CssBaseline,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Divider,
  Grid,
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

import { findGame } from '../helper/helpers';

import AlertMessage from './GameEditor/AlertMessage';

import InputSwitcher from './GameEditor/InputSwitcher';

// Hooks
import useAlert from '../hooks/useAlert';
import useQuestionData from '../hooks/useQuestionData';

function QuestionEditor() {
  const { gameId, questionId } = useParams();
  const navigate = useNavigate();
  const [answerLength, setAnswerLength] = useState(1);
  const [newQuestion, setNewQuestion] = useState({
    text: '',
    type: 'single',
    timeLimit: 30,
    points: 10,
    answers: [{ id: 1, text: '', isCorrect: true }],
  });
  const { alertMessage, showAlert, displayAlert } = useAlert();
  const { game, question, error, updateQuestionData, getQuestionData } =
    useQuestionData(gameId, questionId);
  const currentQuestion = question;

  // Update form when current question changes

  const handleSaveQuestion = async () => {
    try {
      const currentGame = await findGame(gameId);

      // Create a copy of the current game's questions
      let updatedQuestions = [...(currentGame.questions || [])];

      if (currentQuestion) {
        // Update existing question
        const questionIndex = updatedQuestions.findIndex(
          (q) => q.id === currentQuestion.id,
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

      console.log(updatedQuestions);
      // Call the onSave handler from parent
      await updateQuestionData({ ...game, questions: updatedQuestions });
      handleBackToGameEditor();
    } catch (err) {
      console.error('Failed to save question:', err.message);
      displayAlert(`Error saving question: ${err.message}`);
    }
  };

  // Handle form field changes
  const handleQuestionChange = (field, value) => {
    setNewQuestion((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleBackToGameEditor = () => {
    navigate(`/game/${gameId}`);
  };
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
          }}
        >
          {/* Alert Message */}
          <AlertMessage message={alertMessage} show={showAlert} />

          {/* Header */}
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
                Question Editor
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default QuestionEditor;
