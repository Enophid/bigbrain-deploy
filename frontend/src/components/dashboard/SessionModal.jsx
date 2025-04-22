import { useState, useRef, useEffect } from 'react';
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
  BarChart as BarChartIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ApiCall from '../apiCall';
import React from 'react';

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
  handleStartGame,
  onClose,
  isAdvancing,
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
        onClick={(e) => {
          // Prevent any double-click issues
          e.preventDefault();
          console.log('Advance button clicked');
          
          // Call the handler function
          handleStartGame();
          
          // Only close modal for new sessions
          if (isNewSession) {
            console.log('Closing modal for new session');
            onClose();
          }
        }}
        disabled={isAdvancing} // Disable button while advancing
      >
        {isNewSession ? 'Start game 🎮' : 'Advance to next question 🚀'}
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
    <Typography variant="body1" sx={{ mb: 2 }}>
      You can now view the results and statistics for this session:
    </Typography>
    <Box sx={{ mb: 3, pl: 2 }}>
      <Typography variant="body2" component="p" sx={{ mb: 1 }}>
        • View top 5 players and their scores
      </Typography>
      <Typography variant="body2" component="p" sx={{ mb: 1 }}>
        • See question performance statistics
      </Typography>
      <Typography variant="body2" component="p">
        • Analyze average response times
      </Typography>
    </Box>
    <Typography variant="body2" color="primary" fontWeight="medium">
      Would you like to view these results now?
    </Typography>
  </>
);

/**
 * Component that displays the action buttons after a session has ended
 */
const SessionEndedActions = ({
  onClose,
  handleViewResults,
  handleViewCharts,
  initialFocusRef,
}) => {
  // Use useEffect to ensure the focus gets set correctly when component mounts
  React.useEffect(() => {
    if (initialFocusRef && initialFocusRef.current) {
      setTimeout(() => initialFocusRef.current.focus(), 100);
    }
  }, [initialFocusRef]);

  return (
    <Box
      sx={{
        ...styles.actionContainer,
        justifyContent: 'space-between',
      }}
    >
      <Button variant="outlined" onClick={onClose} sx={styles.button}>
        Close
      </Button>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          variant="outlined"
          color="info"
          onClick={handleViewCharts}
          startIcon={<BarChartIcon />}
          sx={styles.button}
        >
          View Charts
        </Button>
        <Button
          variant="contained"
          color="info"
          onClick={handleViewResults}
          startIcon={<AssessmentIcon />}
          sx={{
            ...styles.button,
            fontWeight: 'bold',
            px: 2.5,
            boxShadow: (theme) => theme.shadows[4],
            '&:hover': {
              boxShadow: (theme) => theme.shadows[6],
            }
          }}
          ref={initialFocusRef}
          autoFocus
        >
          View Results
        </Button>
      </Box>
    </Box>
  );
};

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

  // Log state changes for debugging
  useEffect(() => {
    console.log('Modal state:', { isEnded, isEnding, showEndConfirm });
  }, [isEnded, isEnding, showEndConfirm]);

  // Check if session has already ended when the modal opens (for auto-ended sessions)
  useEffect(() => {
    const checkSessionStatus = async () => {
      // Only run this check for active sessions and when modal is open
      if (!open || isNewSession || !gameId || !sessionId) return;
      
      console.log('Checking session status for potentially auto-ended session:', sessionId);
      
      try {
        // Use the games endpoint instead of individual game endpoint
        const data = await ApiCall(
          `/admin/games`,
          {},
          'GET'
        );
        
        // Find the specific game in the response
        const game = data.games?.find(g => g.id === gameId);
        
        // Check if the game has no active session
        if (game && !game.active) {
          console.log('Session has automatically ended (detected via game data), showing results options');
          
          // Show the Session Ended view
          setIsEnding(false);
          setIsEnded(true);
        } else if (game) {
          console.log('Session is still active:', game.active);
        } else {
          console.log('Game not found in response');
        }
      } catch (error) {
        console.error('Error checking session status:', error);
      }
    };
    
    // Only run once when the modal opens
    if (open) {
      checkSessionStatus();
    }
  }, [open, gameId, sessionId, isNewSession]);

  // Add a check when the modal first opens for active sessions
  useEffect(() => {
    // When the modal opens for an existing session, check if it has the active field
    if (open && !isNewSession && gameId && sessionId) {
      console.log('Checking if session was previously ended:', sessionId);
      
      // Make API call to get current game state using games endpoint
      ApiCall(`/admin/games`, {}, 'GET')
        .then(data => {
          // Find the specific game in the response
          const game = data.games?.find(g => g.id === gameId);
          
          // If the game doesn't have an active session when we expect it to
          if (game && !game.active) {
            console.log('Found previously ended session, showing results options');
            setIsEnded(true);
          } else if (game) {
            console.log('Active session confirmed:', game.active);
          } else {
            console.log('Game not found in response');
          }
        })
        .catch(err => {
          console.error('Error checking game status:', err);
        });
    }
  }, [open, isNewSession, gameId, sessionId]);

  /**
   * Advances the game to the first question
   */
  const handleStartGame = async () => {
    if (!gameId) {
      console.error('Cannot start game: Game ID is missing');
      setError({
        severity: 'error',
        message: 'Cannot start game: Game ID is missing'
      });
      return;
    }

    // Prevent multiple clicks
    if (isAdvancing) {
      console.log('Ignoring click - already processing advance request');
      return;
    }

    try {
      setIsAdvancing(true);
      console.log('Advancing to next question for game:', gameId);

      // First check if the game is still active using the games endpoint
      const gamesData = await ApiCall(`/admin/games`, {}, 'GET');
      const game = gamesData.games?.find(g => g.id === gameId);
      
      if (!game) {
        throw new Error('Game not found');
      }
      
      if (!game.active) {
        console.log('Game has already ended. Showing results options.');
        setIsEnding(false);
        setIsEnded(true);
        return;
      }

      // If the game is still active, try to advance it
      const data = await ApiCall(
        `/admin/game/${gameId}/mutate`,
        {
          mutationType: 'ADVANCE',
        },
        'POST'
      );

      console.log('Game advancement result:', data);
      
      // Check if the response indicates that the game has ended
      if (data.error === 'Game has no active session' || 
          (data.error && data.error.includes('no active session'))) {
        console.log('Game has automatically ended. Showing results options.');
        
        // Use setTimeout to ensure state updates properly with React's batching
        setTimeout(() => {
          setIsEnded(true);
          console.log('isEnded state set to true due to auto-end detection');
        }, 50);
      } else if (!data.error) {
        console.log('Successfully advanced to next question');
      }
    } catch (e) {
      console.error('Error advancing game:', e);
      
      // Check if error message indicates the game has ended
      if (e.message === 'Game has no active session' || 
          (e.message && e.message.includes('no active session'))) {
        console.log('Game has automatically ended. Showing results options.');
        
        // Show Session Ended view
        setTimeout(() => {
          setIsEnded(true);
          console.log('isEnded state set to true due to auto-end detection');
        }, 50);
      } else {
        setError({
          severity: 'error',
          message: `Failed to advance game: ${e.message || 'Unknown error'}`,
        });
      }
    } finally {
      // Add a small delay before allowing another click to prevent rapid multiple clicks
      setTimeout(() => {
        setIsAdvancing(false);
        console.log('Ready for next advance');
      }, 500);
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
          message: 'Failed to copy to clipboard. Please try again.',
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
      console.log('Ending session process started...');

      // Call the onEndSession function from props
      if (onEndSession) {
        const success = await onEndSession();
        console.log('Session end API result:', success);

        if (success) {
          console.log('Session ended successfully, showing result options');
          // Ensure we set states in correct order
          setIsEnding(false); 
          // Use setTimeout to ensure state updates properly with React's batching
          setTimeout(() => {
            setIsEnded(true);
            console.log('isEnded state set to true');
          }, 50);
        } else {
          console.log('Session ending failed');
          setIsEnding(false);
          onClose();
        }
      } else {
        console.error('No onEndSession handler provided');
        setIsEnding(false);
        onClose();
      }
    } catch (error) {
      console.error('Error ending session:', error);
      setIsEnding(false);
      onClose(); // Close on error
    }
  };

  /**
   * Navigates to the results page for the session
   */
  const handleViewResults = () => {
    console.log('Navigating to results for session:', sessionId);
    if (sessionId) {
      // Close modal first to avoid state conflicts
      onClose();
      // Use small timeout to ensure modal closing completes before navigation
      setTimeout(() => {
        console.log('Navigating to:', `/session/${sessionId}`);
        navigate(`/session/${sessionId}`);
      }, 150);
    } else {
      console.error('Cannot navigate to results: Session ID is missing.');
      onClose();
    }
  };

  /**
   * Navigates to the charts page for the session
   */
  const handleViewCharts = () => {
    console.log('Navigating to charts for session:', sessionId);
    if (sessionId) {
      // Close modal first to avoid state conflicts
      onClose();
      // Use small timeout to ensure modal closing completes before navigation
      setTimeout(() => {
        console.log('Navigating to:', `/game-results/${sessionId}`);
        navigate(`/game-results/${sessionId}`);
      }, 150);
    } else {
      console.error('Cannot navigate to charts: Session ID is missing.');
      onClose();
    }
  };

  // Regular close handler (used for non-end-session cases)
  const handleClose = (event, reason) => {
    console.log('Handle close triggered, reason:', reason);
    
    // Prevent closing with backdrop or escape key during loading or when showing results
    if ((isEnding || isEnded) && (reason === 'backdropClick' || reason === 'escapeKeyDown')) {
      console.log('Preventing close during loading/results state');
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
    console.log('Closing modal after session ended');
    onClose();
  };

  // Reset session ended state when the modal is closed or reopened
  const handleModalOnExited = () => {
    // Reset all local state after the closing animation completes
    console.log('Modal fully closed, resetting states');
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
            handleViewCharts={handleViewCharts}
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
          handleStartGame={handleStartGame}
          onClose={onClose}
          isAdvancing={isAdvancing}
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
              width: { xs: 'calc(100% - 32px)', sm: isEnded ? '550px' : '500px' },
              maxWidth: { xs: 'calc(100% - 32px)', sm: isEnded ? '550px' : '500px' },
            },
          },
          transition: {
            onExited: handleModalOnExited, // Reset state when modal is fully closed
          },
          backdrop: {
            onClick: (isEnding || isEnded) ? (e) => e.stopPropagation() : undefined,
          },
        }}
        disableEscapeKeyDown={isEnding || isEnded}
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
  handleStartGame: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  isAdvancing: PropTypes.bool,
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
  handleViewCharts: PropTypes.func,
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
