import PropTypes from 'prop-types';
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';

/**
 * Form for players to enter their name and join a game session
 */
const JoinForm = ({
  sessionId,
  playerName,
  onPlayerNameChange,
  onSubmit,
  loading,
  error,
}) => {
  return (
    <Box component="form" onSubmit={onSubmit} sx={{ mt: 3 }}>
      <TextField
        label="Your Name"
        variant="outlined"
        fullWidth
        margin="normal"
        value={playerName}
        onChange={onPlayerNameChange}
        disabled={loading}
        placeholder="Enter your name to join the game"
        autoFocus
        InputProps={{
          sx: { borderRadius: 2 },
        }}
      />

      {error && (
        <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        size="large"
        disabled={loading || !sessionId}
        sx={{ mt: 3, mb: 2, borderRadius: 2, py: 1.2 }}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          'Join Game'
        )}
      </Button>
    </Box>
  );
};

JoinForm.propTypes = {
  sessionId: PropTypes.string,
  playerName: PropTypes.string.isRequired,
  onPlayerNameChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
};

export default JoinForm; 