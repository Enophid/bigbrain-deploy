import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Search as SearchIcon,
  ArrowForward as ArrowForwardIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import PropTypes from 'prop-types';

// Common styles
const styles = {
  searchButton: {
    color: 'white',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    mr: 1,
    width: 40,
    height: 40,
  },
  dialogPaper: {
    borderRadius: 2,
    mx: 2,
    my: 2,
    px: { xs: 2, sm: 3 },
    py: { xs: 2, sm: 3 },
    maxWidth: { xs: '95%', sm: '450px' },
    margin: 'auto',
  },
  inputField: {
    borderRadius: 2,
  },
  buttonsContainer: {
    mt: 2,
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },
};

/**
 * Search field component for session ID input
 */
const SearchField = ({
  sessionId,
  handleInputChange,
  handleKeyPress,
  showTooltip,
  setSessionId,
  handleJoinSession,
}) => (
  <TextField
    fullWidth
    variant="outlined"
    placeholder="Enter Session ID"
    value={sessionId}
    onChange={handleInputChange}
    onKeyPress={handleKeyPress}
    autoFocus
    error={showTooltip}
    helperText={showTooltip ? 'Please enter a session ID' : ''}
    InputProps={{
      sx: styles.inputField,
      endAdornment: (
        <InputAdornment position="end">
          {sessionId && (
            <IconButton
              size="small"
              onClick={() => setSessionId('')}
              edge="end"
              sx={{ mr: 0.5 }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
          <IconButton
            onClick={handleJoinSession}
            color="primary"
            sx={{ ml: sessionId ? 0 : 0.5 }}
          >
            <ArrowForwardIcon />
          </IconButton>
        </InputAdornment>
      ),
    }}
  />
);

/**
 * Action buttons component for session search
 */
const ActionButtons = ({ handleClose, handleJoinSession }) => (
  <Box sx={styles.buttonsContainer}>
    <Button variant="text" onClick={handleClose} size="small">
      Cancel
    </Button>
    <Button
      variant="contained"
      onClick={handleJoinSession}
      disableElevation
      size="small"
    >
      Join Game
    </Button>
  </Box>
);

/**
 * A search bar component for finding and joining game sessions by ID
 */
const SessionSearchBar = () => {
  const navigate = useNavigate();
  const [sessionId, setSessionId] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  /**
   * Opens the session search dialog
   */
  const handleSearchClick = () => {
    setOpenDialog(true);
  };

  /**
   * Closes the session search dialog and resets state
   */
  const handleClose = () => {
    setOpenDialog(false);
    // Optional: reset sessionId when dialog closes
    // setSessionId('');
    setShowTooltip(false);
  };

  /**
   * Updates the sessionId state when input changes
   */
  const handleInputChange = (e) => {
    setSessionId(e.target.value);
    // Clear error state when user types
    if (showTooltip) setShowTooltip(false);
  };

  /**
   * Validates input and navigates to the game session
   */
  const handleJoinSession = () => {
    const trimmedId = sessionId.trim();
    if (trimmedId) {
      navigate(`/play?session=${trimmedId}`);
      handleClose();
    } else {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2000);
    }
  };

  /**
   * Handles Enter key press for form submission
   */
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleJoinSession();
    }
  };

  return (
    <>
      {/* Search Button */}
      <Tooltip title="Search for a game session" placement="bottom">
        <IconButton
          onClick={handleSearchClick}
          sx={styles.searchButton}
          aria-label="Search for game session"
        >
          <SearchIcon />
        </IconButton>
      </Tooltip>

      {/* Session Search Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleClose}
        fullWidth
        maxWidth="xs"
        PaperProps={{ sx: styles.dialogPaper }}
        aria-labelledby="session-search-dialog-title"
      >
        <DialogTitle sx={{ pb: 1, px: 1 }} id="session-search-dialog-title">
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Join a Game Session
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ pt: 2, px: 1 }}>
          <SearchField
            sessionId={sessionId}
            handleInputChange={handleInputChange}
            handleKeyPress={handleKeyPress}
            showTooltip={showTooltip}
            setSessionId={setSessionId}
            handleJoinSession={handleJoinSession}
          />
        </DialogContent>

        <DialogActions sx={{ px: 1, pb: 1, justifyContent: 'space-between' }}>
          <ActionButtons
            handleClose={handleClose}
            handleJoinSession={handleJoinSession}
          />
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SessionSearchBar;
SearchField.propTypes = {
  sessionId: PropTypes.string.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleKeyPress: PropTypes.func.isRequired,
  showTooltip: PropTypes.bool.isRequired,
  setSessionId: PropTypes.func.isRequired,
  handleJoinSession: PropTypes.func.isRequired,
};

ActionButtons.propTypes = {
  handleClose: PropTypes.func.isRequired,
  handleJoinSession: PropTypes.func.isRequired,
};
