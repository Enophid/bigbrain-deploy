import PropTypes from 'prop-types';
import { Box, Typography, Button } from '@mui/material';

/**
 * Component for managing True/False answers for Judgement type questions.
 */
function JudgementAnswerOptions({ answers, onChange }) {
  const isTrueCorrect = answers.some((a) => a.text === 'True' && a.isCorrect);
  const isFalseCorrect = answers.some((a) => a.text === 'False' && a.isCorrect);

  const handleSelectCorrect = (correctValue) => {
    const updatedAnswers = [
      { id: 1, text: 'True', isCorrect: correctValue === 'True' },
      { id: 2, text: 'False', isCorrect: correctValue === 'False' },
    ];
    onChange('answers', updatedAnswers);
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="body2" sx={{ mb: 2 }}>
        This is a true/false question. Select which option is the correct
        answer:
      </Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant={isTrueCorrect ? 'contained' : 'outlined'}
          color={isTrueCorrect ? 'success' : 'primary'}
          onClick={() => handleSelectCorrect('True')}
          sx={{ minWidth: '100px', textTransform: 'none' }}
        >
          True
        </Button>
        <Button
          variant={isFalseCorrect ? 'contained' : 'outlined'}
          color={isFalseCorrect ? 'success' : 'primary'}
          onClick={() => handleSelectCorrect('False')}
          sx={{ minWidth: '100px', textTransform: 'none' }}
        >
          False
        </Button>
      </Box>
    </Box>
  );
}

JudgementAnswerOptions.propTypes = {
  answers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      text: PropTypes.string.isRequired,
      isCorrect: PropTypes.bool.isRequired,
    })
  ).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default JudgementAnswerOptions; 