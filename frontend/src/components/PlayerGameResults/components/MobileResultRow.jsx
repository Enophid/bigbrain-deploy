import { Box, Card, Typography, Chip, Grid } from '@mui/material';
import { 
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Timer as TimerIcon
} from '@mui/icons-material';
import PropTypes from 'prop-types';

/**
 * Component to display a question result in a card format for mobile views
 */
const MobileResultRow = ({ answer, index }) => {
  const isCorrect = answer.points > 0;
  
  return (
    <Card 
      sx={{
        p: 2,
        mb: 2,
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        border: isCorrect
          ? '1px solid rgba(76, 175, 80, 0.3)'
          : '1px solid rgba(244, 67, 54, 0.1)',
        bgcolor: isCorrect
          ? 'rgba(76, 175, 80, 0.05)'
          : 'rgba(244, 67, 54, 0.05)',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
          Question {answer.position || index + 1}
        </Typography>
        {isCorrect ? (
          <Chip
            icon={<CheckCircleIcon />}
            label="Correct"
            color="success"
            size="small"
            sx={{ fontWeight: 'medium' }}
          />
        ) : (
          <Chip
            icon={<CancelIcon />}
            label="Incorrect"
            color="error"
            size="small"
            sx={{ fontWeight: 'medium' }}
          />
        )}
      </Box>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {answer.question}
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography variant="caption" color="text.secondary">
            Points
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
            <Typography
              variant="body1"
              fontWeight="medium"
              color={isCorrect ? 'success.main' : 'text.secondary'}
            >
              {isCorrect ? answer.points : 0}
            </Typography>
            {isCorrect && answer.speedMultiplier && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ ml: 0.5 }}
              >
                ({answer.questionPoints} × {answer.speedMultiplier})
              </Typography>
            )}
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="caption" color="text.secondary">
            Response Time
          </Typography>
          <Box sx={{ mt: 0.5 }}>
            {answer.responseTime ? (
              <Chip
                icon={<TimerIcon fontSize="small" />}
                label={`${answer.responseTime}s`}
                size="small"
                color="secondary"
                variant="outlined"
                sx={{ fontWeight: 'medium' }}
              />
            ) : (
              <Typography variant="body2" color="text.secondary">
                N/A
              </Typography>
            )}
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
};

MobileResultRow.propTypes = {
  answer: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
};

export default MobileResultRow; 