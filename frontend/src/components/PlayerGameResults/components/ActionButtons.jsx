import { Box, Button } from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  QuizOutlined as QuestionIcon,
} from '@mui/icons-material';
import PropTypes from 'prop-types';

/**
 * Component to display the navigation buttons
 */
const ActionButtons = ({ onReturnToGame, onPlayAgain, isMobile }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: { xs: 'column', sm: 'row' },
      justifyContent: 'center',
      alignItems: 'center',
      mt: { xs: 3, sm: 4 },
      gap: { xs: 2, sm: 2 },
    }}
  >
    <Button
      variant="outlined"
      color="primary"
      fullWidth={isMobile}
      size={isMobile ? 'medium' : 'large'}
      startIcon={<ArrowBackIcon />}
      onClick={onReturnToGame}
      sx={{
        borderRadius: 2,
        px: { xs: 2, sm: 3 },
        py: { xs: 1, sm: 1.5 },
        textTransform: 'none',
        fontWeight: 'medium',
        fontSize: { xs: '0.9rem', sm: '1rem' },
        order: { xs: 2, sm: 1 },
      }}
    >
      Return to Game
    </Button>

    <Button
      variant="contained"
      color="primary"
      fullWidth={isMobile}
      size={isMobile ? 'medium' : 'large'}
      startIcon={<QuestionIcon />}
      onClick={onPlayAgain}
      sx={{
        borderRadius: 2,
        px: { xs: 2, sm: 4 },
        py: { xs: 1, sm: 1.5 },
        textTransform: 'none',
        fontWeight: 'bold',
        fontSize: { xs: '0.9rem', sm: '1.1rem' },
        order: { xs: 1, sm: 2 },
      }}
    >
      Play New Game
    </Button>
  </Box>
);

ActionButtons.propTypes = {
  onReturnToGame: PropTypes.func.isRequired,
  onPlayAgain: PropTypes.func.isRequired,
  isMobile: PropTypes.bool.isRequired,
};

export default ActionButtons;
