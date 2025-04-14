import PropTypes from 'prop-types';
import { Paper, Typography, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

const EmptyState = ({ onCreateGame }) => {
  return (
    <Paper
      sx={{
        py: 4,
        textAlign: 'center',
        borderRadius: 4,
        boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
      }}
    >
      <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>
        No games found
      </Typography>
      <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
        Create your first game to get started!
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={onCreateGame}
        sx={{ mt: 3, textTransform: 'none', borderRadius: 2 }}
      >
        Create Game
      </Button>
    </Paper>
  );
};

EmptyState.propTypes = {
  onCreateGame: PropTypes.func.isRequired,
};

export default EmptyState;
