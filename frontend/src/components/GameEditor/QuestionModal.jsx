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
  displayAlert,
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
      if (error && error.includes('not found')) {
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

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      aria-labelledby="question-modal-title"
      aria-describedby="question-modal-description"
      disableRestoreFocus
    >
      <Fade in={open}>
        <Paper
          elevation={24}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '95%', sm: '90%', md: '600px' },
            maxWidth: '95vw',
            maxHeight: '90vh',
            overflow: 'auto',
            borderRadius: 3,
            boxShadow: '0 24px 48px rgba(0, 0, 0, 0.2)',
            p: 0,
            outline: 'none',
          }}
          tabIndex={-1}
        >
          <Box
            sx={{
              background: `linear-gradient(135deg, ${bigBrainTheme.palette.primary.main} 0%, ${bigBrainTheme.palette.secondary.dark} 100%)`,
              p: 3,
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
            }}
          >
            <Typography
              id="question-modal-title"
              variant="h5"
              sx={{
                color: 'white',
                fontWeight: 700,
                textAlign: 'center',
                textShadow: '0 2px 4px rgba(0,0,0,0.2)',
              }}
            >
              {currentQuestion ? 'Edit Question' : 'Add Question'}
            </Typography>
          </Box>

          <Box sx={{ p: 3 }}>
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
                {newQuestion.answers.length > 2 && (
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
                // Use timestamp-based ID for new answers
                const newId = Date.now();
                handleQuestionChange('answers', [
                  ...newQuestion.answers,
                  { id: newId, text: '', isCorrect: false },
                ]);
              }}
              sx={{ mb: 3, textTransform: 'none' }}
            >
              Add Option
            </Button>
          </Box>

          <Divider />

          <Box
            sx={{ p: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}
          >
            <Button
              variant="outlined"
              onClick={onClose}
              sx={{
                borderRadius: 2,
                px: 3,
                textTransform: 'none',
              }}
            >
              Cancel
            </Button>
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
        </Paper>
      </Fade>
    </Modal>
  );
};

export default QuestionModal;

QuestionModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  currentQuestion: PropTypes.object,
  game: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  error: PropTypes.string,
  displayAlert: PropTypes.func,
};
