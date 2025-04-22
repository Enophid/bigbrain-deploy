import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Avatar,
  Typography,
  Zoom,
} from '@mui/material';


function AnswerList({ 
  answers, 
  selectedAnswers, 
  correctAnswers, 
  handleAnswerSelect, 
  showResults, 
  answerPeriodEnded,
  getButtonColor,
  getResultIcon,
  getAvatarBgColor,
  getAnswerBoxBgColor
}) {
  const letterOptions = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
        gap: 2.5,
      }}
    >
      {answers?.map((answer, index) => {
        const isSelected = selectedAnswers.includes(answer.text);
        const isCorrect = correctAnswers.includes(answer.text);
        
        return (
          <Zoom in={true} timeout={300 + index * 100} key={`answer-${answer.text}-${index}`}>
            <Button
              variant={isSelected ? 'contained' : 'outlined'}
              color={getButtonColor(answer, isSelected, isCorrect, showResults)}
              onClick={() => handleAnswerSelect(answer.text)}
              disabled={showResults || answerPeriodEnded}
              sx={{
                height: 'auto',
                minHeight: 72,
                padding: 0,
                position: 'relative',
                textTransform: 'none',
                borderRadius: 3,
                overflow: 'hidden',
                transition: 'all 0.2s',
                boxShadow: isSelected ? 4 : 0,
                '&:hover': {
                  transform: showResults || answerPeriodEnded ? 'none' : 'translateY(-3px)',
                  boxShadow: showResults || answerPeriodEnded ? 0 : 6,
                },
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                width: '100%', 
                p: 0,
                position: 'relative',
                backgroundColor: getAnswerBoxBgColor(showResults, isCorrect),
              }}>
                <Avatar 
                  sx={{ 
                    bgcolor: getAvatarBgColor(isSelected, showResults, isCorrect),
                    color: isSelected ? '#fff' : (showResults ? (isCorrect ? '#4caf50' : '#f44336') : '#1976d2'), // Adjust color based on state
                    m: 1.5,
                    transition: 'all 0.2s',
                    fontWeight: 'bold',
                  }}
                >
                  {letterOptions[index]}
                </Avatar>
                
                <Typography
                  sx={{
                    flex: 1,
                    textAlign: 'left',
                    p: 2,
                    pr: 3,
                    fontWeight: 'medium',
                    fontSize: '1rem',
                  }}
                >
                  {answer.text}
                </Typography>
                
                {getResultIcon(answer, isSelected, isCorrect, showResults) && (
                  <Box sx={{ position: 'absolute', right: 12 }}>
                    {getResultIcon(answer, isSelected, isCorrect, showResults)}
                  </Box>
                )}
              </Box>
            </Button>
          </Zoom>
        );
      })}
    </Box>
  );
}

AnswerList.propTypes = {
  answers: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
  })).isRequired,
  selectedAnswers: PropTypes.arrayOf(PropTypes.string).isRequired,
  correctAnswers: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleAnswerSelect: PropTypes.func.isRequired,
  showResults: PropTypes.bool.isRequired,
  answerPeriodEnded: PropTypes.bool.isRequired,
  getButtonColor: PropTypes.func.isRequired,
  getResultIcon: PropTypes.func.isRequired,
  getAvatarBgColor: PropTypes.func.isRequired,
  getAnswerBoxBgColor: PropTypes.func.isRequired,
};

export default AnswerList; 