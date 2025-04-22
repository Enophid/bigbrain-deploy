import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  LinearProgress,
} from '@mui/material';

function QuestionDisplay({ 
  currentQuestion, 
  timeLeft, 
  showResults, 
  calculateRemainingTimePercent, 
  getTimerColor, 
  formatTimeLeft 
}) {
  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      {/* Timer display and question badge */}
      <Box 
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          mb: 2,
        }}
      >
        <Box sx={{ width: '100%', mb: 1 }}>
          <LinearProgress
            variant="determinate"
            value={calculateRemainingTimePercent()}
            color={showResults ? 'secondary' : getTimerColor()}
            sx={{ 
              height: 10, 
              borderRadius: 5,
              '& .MuiLinearProgress-bar': {
                transition: 'transform 1s linear',
              }
            }}
          />
        </Box>
        
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Timer display */}
          <Typography 
            variant="h6" 
            component="div"
            color={showResults ? 'secondary.main' : getTimerColor()} // Use color prop directly
            sx={{ 
              fontWeight: 'bold',
              fontSize: { xs: '0.9rem', sm: '1.1rem' },
              transition: 'color 0.3s ease'
            }}
          >
            {showResults ? "Results" : formatTimeLeft(timeLeft)}
          </Typography>
        </Box>
      </Box>

      {/* Question content */}
      <Box>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            mb: 3,
            color: '#1a237e',
            lineHeight: 1.3,
          }}
        >
          {currentQuestion?.text || 'Question'}
        </Typography>

        {/* Media content (image or video) */}
        {currentQuestion?.imageUrl && (
          <Box
            sx={{ 
              position: 'relative',
              mb: 4,
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              textAlign: 'center',
            }}
          >
            <Box
              component="img"
              src={currentQuestion.imageUrl}
              alt="Question media"
              sx={{
                width: '100%',
                maxHeight: '400px',
                objectFit: 'contain',
                display: 'block',
                margin: '0 auto',
              }}
            />
          </Box>
        )}

        {currentQuestion?.videoUrl && (
          <Box
            sx={{ 
              position: 'relative',
              mb: 4,
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              paddingTop: '56.25%', // 16:9 aspect ratio
              height: 0,
            }}
          >
            <Box
              component="iframe"
              src={currentQuestion.videoUrl}
              title="Question video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'block',
              }}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}

// Add PropTypes for validation
QuestionDisplay.propTypes = {
  currentQuestion: PropTypes.shape({
    text: PropTypes.string,
    imageUrl: PropTypes.string,
    videoUrl: PropTypes.string,
  }),
  timeLeft: PropTypes.number.isRequired,
  showResults: PropTypes.bool.isRequired,
  calculateRemainingTimePercent: PropTypes.func.isRequired,
  getTimerColor: PropTypes.func.isRequired,
  formatTimeLeft: PropTypes.func.isRequired,
};

export default QuestionDisplay; 