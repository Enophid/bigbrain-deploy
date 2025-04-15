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
  const [newQuestion, setNewQuestion] = useState({
    text: '',
    type: 'single',
    timeLimit: 30,
    points: 10,
    answers: [{ id: 1, text: '', isCorrect: true }],
  });
  const { alertMessage, showAlert, displayAlert } = useAlert();
  const { game, question, updateQuestionData } = useQuestionData(
    gameId,
    questionId
  );
  const currentQuestion = question;

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
          : [{ id: Date.now(), text: '', isCorrect: true }],
      });
    } else {
      // Reset form for new question
      const now = Date.now();
      setNewQuestion({
        text: '',
        type: 'single',
        timeLimit: 30,
        points: 10,
        answers: [{ id: now, text: '', isCorrect: true }],
      });
    }
  }, [currentQuestion]);

  const handleSaveQuestion = async () => {
    try {
      const currentGame = await findGame(gameId);

      // Create a copy of the current game's questions
      let updatedQuestions = [...(currentGame.questions || [])];

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
              backgroundImage:
                'linear-gradient(135deg, #2D3047 0%, #00B4D8 50%, #06D6A0 100%)',
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
                color="inherit"
                onClick={handleBackToGameEditor}
                sx={{ mr: 2, color: 'white' }}
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography
                variant="h4"
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

          <Box sx={{ p: 3, overflow: 'auto' }}>
            <TextField
              label="Question Text"
              multiline
              rows={2}
              value={newQuestion.text}
              onChange={(e) => handleQuestionChange('text', e.target.value)}
              fullWidth
              sx={{ mb: 3 }}
            />
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid sx={{ width: { xs: '100%', sm: '50%' } }}>
                <TextField
                  label="Time Limit (seconds)"
                  type="number"
                  value={newQuestion.timeLimit || ''}
                  onChange={(e) =>
                    handleQuestionChange(
                      'timeLimit',
                      parseInt(e.target.value) || 0
                    )
                  }
                  fullWidth
                  slotProps={{ input: { min: 5, max: 300 } }}
                />
              </Grid>
              <Grid sx={{ width: { xs: '100%', sm: '50%' } }}>
                <TextField
                  label="Points"
                  type="number"
                  value={newQuestion.points || ''}
                  onChange={(e) =>
                    handleQuestionChange(
                      'points',
                      parseInt(e.target.value) || 0
                    )
                  }
                  fullWidth
                  slotProps={{ input: { min: 1, max: 100 } }}
                />
              </Grid>
            </Grid>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Answer Options
            </Typography>
            {newQuestion.answers.map((answer, index) => (
              <Box
                key={answer.id}
                sx={{
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <TextField
                  label={`Option ${index + 1}`}
                  value={answer.text}
                  onChange={(e) => {
                    const updatedAnswers = [...newQuestion.answers];
                    updatedAnswers[index].text = e.target.value;
                    handleQuestionChange('answers', updatedAnswers);
                  }}
                  fullWidth
                />
                <Button
                  variant={answer.isCorrect ? 'contained' : 'outlined'}
                  color={answer.isCorrect ? 'success' : 'primary'}
                  onClick={() => {
                    const updatedAnswers = [...newQuestion.answers];
                    updatedAnswers[index].isCorrect =
                      !updatedAnswers[index].isCorrect;
                    handleQuestionChange('answers', updatedAnswers);
                  }}
                  sx={{ minWidth: '80px', textTransform: 'none' }}
                >
                  {answer.isCorrect ? 'Correct' : 'Wrong'}
                </Button>
                {newQuestion.answers.length > 1 && (
                  <IconButton
                    color="error"
                    onClick={() => {
                      const updatedAnswers = newQuestion.answers.filter(
                        (_, i) => i !== index
                      );
                      handleQuestionChange('answers', updatedAnswers);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </Box>
            ))}
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => {
                if (newQuestion.answers.length > 5) {
                  displayAlert('Each question have a maximum of 6 answers.');
                } else {
                  // Use timestamp-based ID for new answers
                  const newId = Date.now();
                  handleQuestionChange('answers', [
                    ...newQuestion.answers,
                    { id: newId, text: '', isCorrect: false },
                  ]);
                }
              }}
              sx={{ mb: 3, textTransform: 'none' }}
            >
              Add Option
            </Button>
            <Typography variant="h6" sx={{ mb: 2 }}>
              URL Youtube Video/ Upload Photo (Optional)
            </Typography>
            <InputSwitcher
              onChange={(data) => {
                if (data.url) {
                  handleQuestionChange('videoUrl', data.url);
                  handleQuestionChange('imageUrl', '');
                } else {
                  handleQuestionChange('imageUrl', data.photo);
                  handleQuestionChange('videoUrl', '');
                }
              }}
            />
          </Box>

          <Divider />
          <Box
            sx={{ p: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}
          >
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={handleSaveQuestion}
              sx={{
                borderRadius: 2,
                px: 3,
                textTransform: 'none',
                fontWeight: 600,
              }}
              disabled={
                !newQuestion.text ||
                newQuestion.answers.some((a) => !a.text) ||
                !newQuestion.answers.some((a) => a.isCorrect)
              }
            >
              Save Question
            </Button>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default QuestionEditor;
