import PropTypes from 'prop-types';
import { Box, TextField, Button, IconButton } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

const MAX_ANSWERS = 6;

/**
 * Component for managing multiple choice answer options.
 */
function MultipleChoiceAnswerOptions({
  answers,
  onChange,
  onMaxAnswersReached,
}) {
  const handleAnswerTextChange = (index, text) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index].text = text;
    onChange('answers', updatedAnswers);
  };

  const handleToggleCorrect = (index) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index].isCorrect = !updatedAnswers[index].isCorrect;
    onChange('answers', updatedAnswers);
  };

  const handleRemoveAnswer = (index) => {
    const updatedAnswers = answers.filter((_, i) => i !== index);
    onChange('answers', updatedAnswers);
  };

  const handleAddAnswer = () => {
    if (answers.length >= MAX_ANSWERS) {
      onMaxAnswersReached(`Maximum of ${MAX_ANSWERS} answers allowed.`);
      return;
    }
    const newId = Date.now(); // Simple unique ID generator
    onChange('answers', [
      ...answers,
      { id: newId, text: '', isCorrect: false },
    ]);
  };

  return (
    <>
      {answers.map((answer, index) => (
        <Box
          key={answer.id} // Use the unique ID as the key
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
            onChange={(e) => handleAnswerTextChange(index, e.target.value)}
            fullWidth
          />
          <Button
            variant={answer.isCorrect ? 'contained' : 'outlined'}
            color={answer.isCorrect ? 'success' : 'primary'}
            onClick={() => handleToggleCorrect(index)}
            sx={{ minWidth: '80px', textTransform: 'none' }}
          >
            {answer.isCorrect ? 'Correct' : 'Wrong'}
          </Button>
          {answers.length > 1 && (
            <IconButton
              color="error"
              onClick={() => handleRemoveAnswer(index)}
            >
              <DeleteIcon />
            </IconButton>
          )}
        </Box>
      ))}
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={handleAddAnswer}
        disabled={answers.length >= MAX_ANSWERS}
        sx={{ mb: 3, textTransform: 'none' }}
      >
        Add Option
      </Button>
    </>
  );
}

MultipleChoiceAnswerOptions.propTypes = {
  answers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      text: PropTypes.string.isRequired,
      isCorrect: PropTypes.bool.isRequired,
    })
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  onMaxAnswersReached: PropTypes.func.isRequired,
};

export default MultipleChoiceAnswerOptions; 