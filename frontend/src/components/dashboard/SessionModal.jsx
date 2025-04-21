import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  Box,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  Chip,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  Check as CheckIcon,
  Timer as TimerIcon,
  PlayArrow as PlayArrowIcon,
  Stop as StopIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ApiCall from '../apiCall';

// Common styles
const styles = {
  button: {
    borderRadius: 2,
    width: { xs: '100%', sm: 'auto' },
    mb: { xs: 1, sm: 0 },
  },
  actionContainer: {
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' },
    width: '100%',
  },
};

/**
 * Component that displays the modal content for active or new game sessions
 */
const DefaultSessionContent = ({
  gameName,
  isNewSession,
  sessionId = '',
  playUrl,
  copied,
  handleCopyLink,
  handleAdvanceToFirstQuestion,
}) => (
  <>
    <Typography variant="h6" sx={{ mb: 2 }}>
      {gameName} {isNewSession ? 'is now ready to play' : 'is currently active'}
    </Typography>

    <Typography variant="body1" sx={{ mb: 3 }}>
      {isNewSession
        ? 'Share this session with your players so they can join:'
        : 'Players can continue to join this active session:'}
    </Typography>

    <Box sx={{ mb: 3 }}>
      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
        Session ID:
      </Typography>
      <TextField
        fullWidth
        variant="outlined"
        value={sessionId || ''}
        slotProps={{
          input: {
            readOnly: true,
            sx: { fontWeight: 'bold', fontSize: '1.1rem' },
          },
        }}
      />
    </Box>

    <Box>
      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
        Share this link with players:
      </Typography>
      <TextField
        fullWidth
        variant="outlined"
        value={playUrl}
        slotProps={{
          input: {
            readOnly: true,
            endAdornment: (
              <Tooltip title={copied ? 'Copied!' : 'Copy to clipboard'}>
                <IconButton onClick={handleCopyLink} edge="end">
                  {copied ? <CheckIcon color="success" /> : <CopyIcon />}
                </IconButton>
              </Tooltip>
            ),
          },
        }}
      />
    </Box>

    <Box sx={{ mt: 3, mb: 3 }}>
      <Button
        fullWidth
        variant="contained"
        color="info"
        onClick={() => handleAdvanceToFirstQuestion()}
      >
        Advance to the question 🚀
      </Button>
    </Box>

    {!isNewSession && (
      <Box sx={{ mt: 4, mb: 2 }}>
        <Divider sx={{ mb: 3 }} />
        <Typography variant="body2" color="error.main" fontWeight="medium">
          Only one session of a game can be active at a time. To start a new
          session, you must first end the current one.
        </Typography>
      </Box>
    )}
  </>
);

/**
 * Component that displays the action buttons for active or new game sessions
 */
const DefaultSessionActions = ({
  isNewSession,
  copied,
  handleShowEndConfirm,
  onClose,
  handleCopyLink,
  initialFocusRef,
}) => (
  <Box sx={styles.actionContainer}>
    {!isNewSession && (
      <Button
        variant="outlined"
        color="error"
        onClick={handleShowEndConfirm}
        startIcon={<StopIcon />}
        sx={{
          ...styles.button,
          mr: { sm: 2 },
        }}
        ref={initialFocusRef}
      >
        End Session
      </Button>
    )}
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        width: { xs: '100%', sm: 'auto' },
        ml: { sm: isNewSession ? 'auto' : 0 },
      }}
    >
      <Button
        variant="outlined"
        onClick={onClose}
        sx={{
          ...styles.button,
          mr: { sm: 2 },
        }}
      >
        Close
      </Button>
      <Button
        variant="contained"
        color={isNewSession ? 'primary' : 'success'}
        onClick={handleCopyLink}
        startIcon={copied ? <CheckIcon /> : <CopyIcon />}
        sx={styles.button}
        ref={isNewSession ? initialFocusRef : null}
      >
        {copied ? 'Copied!' : 'Copy Link'}
      </Button>
    </Box>
  </Box>
);

/**
 * Component that displays the confirmation content for ending a session
 */
const ConfirmEndContent = () => (
  <>
    <Typography variant="h6" sx={{ mb: 2 }}>
      Are you sure you want to end this session?
    </Typography>
    <Typography variant="body1" sx={{ mb: 1 }}>
      Ending this session will:
    </Typography>
    <Box sx={{ pl: 2, mb: 3 }}>
      <Typography variant="body2" component="p">
        • Send all active players to the results screen
      </Typography>
      <Typography variant="body2" component="p">
        • Stop the session permanently (it cannot be restarted)
      </Typography>
      <Typography variant="body2" component="p">
        • Allow you to view the final results
      </Typography>
    </Box>
  </>
);

/**
 * Component that displays the action buttons for ending session confirmation
 */
const ConfirmEndActions = ({
  handleCancelEndSession,
  handleConfirmEndSession,
  initialFocusRef,
}) => (
  <Box
    sx={{
      ...styles.actionContainer,
      justifyContent: 'space-between',
    }}
  >
    <Button
      variant="outlined"
      onClick={handleCancelEndSession}
      sx={styles.button}
    >
      Cancel
    </Button>
    <Button
      variant="contained"
      color="error"
      onClick={handleConfirmEndSession}
      startIcon={<StopIcon />}
      sx={styles.button}
      ref={initialFocusRef}
    >
      End Session
    </Button>
  </Box>
);

/**
 * Component that displays the content after a session has ended
 */
const SessionEndedContent = ({ gameName }) => (
  <>
    <Typography variant="h6" sx={{ mb: 2 }}>
      Session for {gameName} has ended
    </Typography>
    <Typography variant="body1" sx={{ mb: 3 }}>
      Would you like to view the results for this session?
    </Typography>
  </>
);

/**
 * Component that displays the action buttons after a session has ended
 */
const SessionEndedActions = ({
  onClose,
  handleViewResults,
  initialFocusRef,
}) => (
  <Box
    sx={{
      ...styles.actionContainer,
      justifyContent: 'space-between',
    }}
  >
    <Button variant="outlined" onClick={onClose} sx={styles.button}>
      No, Close
    </Button>
    <Button
      variant="contained"
      color="info"
      onClick={handleViewResults}
      startIcon={<AssessmentIcon />}
      sx={styles.button}
      ref={initialFocusRef}
    >
      Yes, View Results
    </Button>
  </Box>
);

/**
 * Component that displays the content while a session is ending
 */
const EndingSessionContent = () => (
  <Box sx={{ py: 4, textAlign: 'center' }}>
    <CircularProgress color="warning" size={60} sx={{ mb: 3 }} />
    <Typography variant="h6">Ending the game session...</Typography>
    <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
      Please wait while we process your request
    </Typography>
  </Box>
);

/**
 * Main SessionModal component
 * Displays different content based on the session state
 */
const SessionModal = ({
  open,
  onClose,
  sessionId,
  gameId,
  gameName,
  isNewSession = true,
  onEndSession,
}) => {
  const navigate = useNavigate();
  const initialFocusRef = useRef(null);

  // UI states
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  const [isAdvancing, setIsAdvancing] = useState(false);

  // URLs
  const baseAppUrl = window.location.origin;
  const playUrl = sessionId
    ? `${baseAppUrl}/play?session=${sessionId}`
    : `${baseAppUrl}/play`;

  /**
   * Advances the game to the first question
   */
  const handleAdvanceToFirstQuestion = async () => {
    if (!gameId) {
      console.error('Cannot advance: Game ID is missing');
      setError('Cannot advance: Game ID is missing');
      return;
    }
    
    // Prevent multiple clicks
    if (isAdvancing) {
      return;
    }
    
    try {
      setIsAdvancing(true);
      console.log('Advancing to first question for game:', gameId);
      
      const data = await ApiCall(
        `/admin/game/${gameId}/mutate`,
        {
          mutationType: 'ADVANCE',
        },
        'POST'
      );

      // No need to close the modal
      console.log('Game advanced successfully:', data);
      
      // Show feedback to the user
      setError({ 
        severity: 'success', 
        message: 'Advanced to the next question successfully!' 
      });
      
      // Re-fetch game list would happen in the parent component
    } catch (e) {
      console.error('Error advancing to question:', e);
      setError({ 
        severity: 'error', 
        message: `Failed to advance: ${e.message || 'Unknown error'}` 
      });
    } finally {
      setIsAdvancing(false);
    }
  };

  // Copy play URL
  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(playUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        setError({ 
          severity: 'error', 
          message: 'Failed to copy to clipboard. Please try again.' 
        });
      });
  };

  const handleCloseAlert = () => {
    setError(null);
  };

  const handleShowEndConfirm = () => {
    setShowEndConfirm(true);
  };

  const handleCancelEndSession = () => {
    setShowEndConfirm(false);
  };

  /**
   * Handles the confirmation to end a session
   */
  const handleConfirmEndSession = async () => {
    setShowEndConfirm(false);
    try {
      setIsEnding(true);

      // Call the onEndSession function from props
      if (onEndSession) {
        const success = await onEndSession();

        if (success) {
          // Show the Session Ended view
          setIsEnded(true);
        } else {
          // If session ending failed, just close the modal
          onClose();
        }
      }
    } catch (error) {
      console.error('Error ending session:', error);
      onClose(); // Close on error
    } finally {
      setIsEnding(false);
    }
  };

  /**
   * Navigates to the results page for the session
   */
  const handleViewResults = () => {
    onClose();
    if (sessionId) {
      navigate(`/session/${sessionId}`);
    } else {
      console.error('Cannot navigate to results: Session ID is missing.');
    }
  };

  // Regular close handler (used for non-end-session cases)
  const handleClose = (event, reason) => {
    // Prevent closing with backdrop or escape key during loading
    if (
      isEnding &&
      (reason === 'backdropClick' || reason === 'escapeKeyDown')
    ) {
      return;
    }

    // Reset state
    setShowEndConfirm(false);
    setCopied(false);

    // Call the parent's close handler
    onClose();
  };

  // Special handler for "No, Close" in Session Ended view
  const handleCloseAfterEnd = () => {
    onClose();
  };

  // Reset session ended state when the modal is closed or reopened
  const handleModalOnExited = () => {
    // Reset all local state after the closing animation completes
    setIsEnded(false);
    setShowEndConfirm(false);
    setIsEnding(false);
    setCopied(false);
  };

  /**
   * Determine modal configuration based on current state
   */
  const getModalConfig = () => {
    if (isEnded) {
      return {
        title: 'Session Ended',
        titleColor: (theme) => theme.palette.info.main,
        icon: <AssessmentIcon />,
        iconLabel: 'Ended',
        content: <SessionEndedContent gameName={gameName} />,
        actions: (
          <SessionEndedActions
            onClose={handleCloseAfterEnd}
            handleViewResults={handleViewResults}
            initialFocusRef={initialFocusRef}
          />
        ),
      };
    }

    if (isEnding) {
      return {
        title: 'Ending Session...',
        titleColor: (theme) => theme.palette.warning.main,
        icon: <StopIcon />,
        iconLabel: 'Processing',
        content: <EndingSessionContent />,
        actions: null,
      };
    }

    if (showEndConfirm) {
      return {
        title: 'End Game Session?',
        titleColor: (theme) => theme.palette.warning.main,
        icon: <StopIcon />,
        iconLabel: 'Confirm',
        content: <ConfirmEndContent />,
        actions: (
          <ConfirmEndActions
            handleCancelEndSession={handleCancelEndSession}
            handleConfirmEndSession={handleConfirmEndSession}
            initialFocusRef={initialFocusRef}
          />
        ),
      };
    }

    return {
      title: isNewSession ? 'Game Session Started!' : 'Active Game Session',
      titleColor: (theme) =>
        isNewSession ? theme.palette.primary.main : theme.palette.success.main,
      icon: isNewSession ? <PlayArrowIcon /> : <TimerIcon />,
      iconLabel: isNewSession ? 'New' : 'Live',
      content: (
        <DefaultSessionContent
          gameName={gameName}
          isNewSession={isNewSession}
          sessionId={sessionId}
          gameId={gameId}
          playUrl={playUrl}
          copied={copied}
          handleCopyLink={handleCopyLink}
          handleAdvanceToFirstQuestion={handleAdvanceToFirstQuestion}
        />
      ),
      actions: (
        <DefaultSessionActions
          isNewSession={isNewSession}
          copied={copied}
          handleShowEndConfirm={handleShowEndConfirm}
          onClose={onClose}
          handleCopyLink={handleCopyLink}
          initialFocusRef={initialFocusRef}
        />
      ),
    };
  };

  // Get modal configuration based on current state
  const modalConfig = getModalConfig();

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: 2,
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
              margin: { xs: '16px', sm: '32px' },
              width: { xs: 'calc(100% - 32px)', sm: '500px' },
              maxWidth: { xs: 'calc(100% - 32px)', sm: '500px' },
            },
          },
          transition: {
            onExited: handleModalOnExited, // Reset state when modal is fully closed
          },
        }}
        disableEscapeKeyDown={isEnding}
        keepMounted={false}
        aria-labelledby="session-modal-title"
      >
        <DialogTitle
          id="session-modal-title"
          sx={{
            pb: 1,
            fontWeight: 600,
            backgroundColor: modalConfig.titleColor,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: { xs: 2, sm: 3 },
            py: { xs: 1.5, sm: 2 },
            fontSize: { xs: '1.1rem', sm: '1.25rem' },
          }}
        >
          {modalConfig.title}

          {modalConfig.iconLabel && (
            <Chip
              icon={modalConfig.icon}
              label={modalConfig.iconLabel}
              size="small"
              sx={{
                color: 'white',
                borderColor: 'white',
                '& .MuiChip-icon': {
                  color: 'white',
                },
                fontSize: { xs: '0.7rem', sm: '0.8rem' },
                height: { xs: 24, sm: 32 },
              }}
              variant="outlined"
            />
          )}
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2, px: { xs: 2, sm: 3 } }}>
          {modalConfig.content}
        </DialogContent>
        {modalConfig.actions && (
          <DialogActions
            sx={{
              px: { xs: 2, sm: 3 },
              pb: { xs: 2, sm: 3 },
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: { xs: 'column', sm: 'row' },
            }}
          >
            {modalConfig.actions}
          </DialogActions>
        )}
      </Dialog>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseAlert} 
          severity={error?.severity || 'error'} 
          sx={{ width: '100%' }}
        >
          {error?.message || 'An error occurred'}
        </Alert>
      </Snackbar>
    </>
  );
};

// PropTypes for helper components
DefaultSessionContent.propTypes = {
  gameName: PropTypes.string.isRequired,
  isNewSession: PropTypes.bool.isRequired,
  sessionId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  playUrl: PropTypes.string.isRequired,
  copied: PropTypes.bool.isRequired,
  handleCopyLink: PropTypes.func.isRequired,
  gameId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  handleAdvanceToFirstQuestion: PropTypes.func.isRequired,
};

DefaultSessionActions.propTypes = {
  isNewSession: PropTypes.bool,
  copied: PropTypes.bool,
  handleShowEndConfirm: PropTypes.func,
  onClose: PropTypes.func,
  handleCopyLink: PropTypes.func,
  initialFocusRef: PropTypes.object,
};

ConfirmEndContent.propTypes = {};

ConfirmEndActions.propTypes = {
  handleCancelEndSession: PropTypes.func,
  handleConfirmEndSession: PropTypes.func,
  initialFocusRef: PropTypes.object,
};

SessionEndedContent.propTypes = {
  gameName: PropTypes.string,
};

SessionEndedActions.propTypes = {
  onClose: PropTypes.func,
  handleViewResults: PropTypes.func,
  initialFocusRef: PropTypes.object,
};

EndingSessionContent.propTypes = {};

SessionModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  sessionId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  gameId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  gameName: PropTypes.string,
  isNewSession: PropTypes.bool,
  onEndSession: PropTypes.func,
};

export default SessionModal;
