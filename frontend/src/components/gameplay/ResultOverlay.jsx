import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Chip,
  Stack,
  Fade,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';

function ResultOverlay({ 
  selectedAnswers, 
  correctAnswers, 
  currentQuestion, 
  getResultMessage 
}) {
  const isCorrect = correctAnswers.some(ans => selectedAnswers.includes(ans));

  return (
    <Fade in={true} timeout={800}>
      <Box
        sx={{
          mb: 4,
          p: 3,
          borderRadius: 3,
          backgroundColor: isCorrect 
            ? 'rgba(76, 175, 80, 0.1)' 
            : 'rgba(244, 67, 54, 0.1)',
          border: `1px solid ${isCorrect 
            ? 'rgba(76, 175, 80, 0.3)' 
            : 'rgba(244, 67, 54, 0.3)'}`, 
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {isCorrect ? (
            <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 28, mr: 1.5 }} />
          ) : (
            <CancelIcon sx={{ color: '#f44336', fontSize: 28, mr: 1.5 }} />
          )}
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            {getResultMessage()}
          </Typography>
        </Box>

        {/* Show points calculation if correct */}        
        {isCorrect && currentQuestion && currentQuestion.speedMultiplier && (
          <Box sx={{ mb: 2, p: 1.5, bgcolor: 'rgba(76, 175, 80, 0.05)', borderRadius: 2 }}>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 'medium' }}>
              Points Calculation:
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography variant="body2">
                Base Points: {currentQuestion.basePoints ?? 'N/A'}
              </Typography>
              <Typography variant="body2">
                Speed Multiplier: {currentQuestion.speedMultiplier}x (responded in {currentQuestion.responseTime?.toFixed(1) ?? 'N/A'}s)
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 0.5 }}>
                Final Points: {currentQuestion.finalPoints ?? 'N/A'}
              </Typography>
            </Box>
          </Box>
        )}

        <Typography variant="body1" sx={{ mb: 1.5, fontWeight: 'medium' }}>
          Correct answer{correctAnswers.length > 1 ? 's' : ''}:
        </Typography>

        <Stack direction="row" flexWrap="wrap" gap={1}>
          {correctAnswers.map((answer, idx) => (
            <Chip
              key={idx}
              label={answer}
              color="success"
              sx={{ fontWeight: 'bold', px: 1 }}
            />
          ))}
        </Stack>
      </Box>
    </Fade>
  );
}

ResultOverlay.propTypes = {
  selectedAnswers: PropTypes.arrayOf(PropTypes.string).isRequired,
  correctAnswers: PropTypes.arrayOf(PropTypes.string).isRequired,
  currentQuestion: PropTypes.shape({
    basePoints: PropTypes.number,
    speedMultiplier: PropTypes.number,
    responseTime: PropTypes.number,
    finalPoints: PropTypes.number,
  }),
  getResultMessage: PropTypes.func.isRequired,
};

export default ResultOverlay; 