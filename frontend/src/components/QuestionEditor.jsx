import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ThemeProvider,
  CssBaseline,
  Box,
  Typography,
  TextField,
} from '@mui/material';
import bigBrainTheme from '../theme/bigBrainTheme';
import GlobalStyles from '../theme/globalStyles';

import { findGame } from '../helper/helpers';

import AlertMessage from './GameEditor/AlertMessage';

// New component imports
import QuestionEditorHeader from './QuestionEditor/components/QuestionEditorHeader';
import QuestionMetadataForm from './QuestionEditor/components/QuestionMetadataForm';
import JudgementAnswerOptions from './QuestionEditor/components/JudgementAnswerOptions';
import MultipleChoiceAnswerOptions from './QuestionEditor/components/MultipleChoiceAnswerOptions';
import MediaInputSection from './QuestionEditor/components/MediaInputSection';
import QuestionEditorActions from './QuestionEditor/components/QuestionEditorActions';

// Hooks
import useAlert from '../hooks/useAlert';
import useQuestionData from '../hooks/useQuestionData';

function QuestionEditor() {
  const { gameId, questionId } = useParams();
  const navigate = useNavigate();
  const [newQuestion, setNewQuestion] = useState({
    text: '',
    type: 'single',
    duration: 30,
    points: 10,
    correctAnswers: [],
    answers: [{ id: 1, text: '', isCorrect: true }],
    videoUrl: '',
    imageUrl: '',
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
        videoUrl: currentQuestion.videoUrl || '',
        imageUrl: currentQuestion.imageUrl || '',
      });
    } else {
      // Reset form for new question
      const now = Date.now();
      setNewQuestion({
        text: '',
        type: 'single',
        duration: 30,
        points: 10,
        correctAnswers: [],
        answers: [{ id: now, text: '', isCorrect: true }],
        videoUrl: '',
        imageUrl: '',
      });
    }
  }, [currentQuestion]);

  // Effect to handle question type changes
  useEffect(() => {
    if (newQuestion.type === 'judgement') {
      // Set up True/False options for judgement questions
      handleQuestionChange('answers', [
        { id: 1, text: 'True', isCorrect: true },
        { id: 2, text: 'False', isCorrect: false },
      ]);
    } else if (
      newQuestion.type === 'single' &&
      newQuestion.answers.length === 2
    ) {
      // If switching from judgement to single, and only has True/False options,
      // reset to default single choice format with some initial text
      if (
        newQuestion.answers[0].text === 'True' &&
        newQuestion.answers[1].text === 'False'
      ) {
        handleQuestionChange('answers', [
          { id: Date.now(), text: '', isCorrect: true },
          { id: Date.now() + 1, text: '', isCorrect: false },
        ]);
      }
    }
  }, [newQuestion.type]);

  const handleSaveQuestion = async () => {
    newQuestion.correctAnswers = [
      ...newQuestion.answers
        .filter((ans) => ans.isCorrect === true)
        .map((ans) => ans.text),
    ];
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

  const handleMediaChange = (mediaData) => {
    setNewQuestion((prev) => ({
      ...prev,
      videoUrl: mediaData.videoUrl || '',
      imageUrl: mediaData.imageUrl || '',
    }));
  };

  const handleBackToGameEditor = () => {
    navigate(`/game/${gameId}`);
  };

  // Determine if save should be disabled
  const isSaveDisabled = () => {
    if (!newQuestion.text) return true;
    if (newQuestion.answers.some((a) => !a.text)) return true;
    if (!newQuestion.answers.some((a) => a.isCorrect)) return true;
    return false;
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

          {/* Header - Use new component */}
          <QuestionEditorHeader
            title="Question Editor"
            onBack={handleBackToGameEditor}
          />

          <Box sx={{ p: 3, overflowY: 'auto', flexGrow: 1 }}>
            <TextField
              label="Question Text"
              multiline
              rows={2}
              value={newQuestion.text}
              onChange={(e) => handleQuestionChange('text', e.target.value)}
              fullWidth
              sx={{ mb: 3 }}
            />

            {/* Metadata Form - Use new component */}
            <QuestionMetadataForm
              questionData={newQuestion}
              onChange={handleQuestionChange}
            />

            <Typography variant="h6" sx={{ mb: 2 }}>
              Answer Options
            </Typography>

            {/* Conditional Rendering for Answer Options - Use new components */}
            {newQuestion.type === 'judgement' ? (
              <JudgementAnswerOptions
                answers={newQuestion.answers}
                onChange={handleQuestionChange}
              />
            ) : (
              <MultipleChoiceAnswerOptions
                answers={newQuestion.answers}
                onChange={handleQuestionChange}
                onMaxAnswersReached={displayAlert} // Pass displayAlert for feedback
              />
            )}

            {/* Media Input - Use new component */}
            <MediaInputSection onMediaChange={handleMediaChange} />
          </Box>

          {/* Actions - Use new component */}
          <QuestionEditorActions
            onSave={handleSaveQuestion}
            isSaveDisabled={isSaveDisabled()}
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default QuestionEditor;
