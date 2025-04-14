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



const SessionModal = ({
  open,
  onClose,
  sessionId,
  gameName,
  isNewSession = true,
  onEndSession,
}) => {
  const [copied, setCopied] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [endingSession, setEndingSession] = useState(false);
  const navigate = useNavigate();

  // Ref for managing focus
  const initialFocusRef = useRef(null);

  // Generate the play URL with the session ID
  const playUrl = `${window.location.origin}/play?session=${sessionId}`;

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(playUrl)
      .then(() => {
        setCopied(true);
        setShowAlert(true);
        // Reset copy icon after 2 seconds
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
      });
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const handleShowEndConfirm = () => {
    setShowEndConfirm(true);
  };

  const handleCancelEndSession = () => {
    setShowEndConfirm(false);
  };

  const handleConfirmEndSession = async () => {
    // Hide the confirmation dialog
    setShowEndConfirm(false);

    try {
      // Set loading state
      setEndingSession(true);

      // Create a local copy of onEndSession to prevent closure issues
      const endSessionFn = onEndSession;

      // Actually end the session
      await endSessionFn();

      // Show the results prompt
      setSessionEnded(true);
    } catch (error) {
      console.error('Error ending session:', error);
      // Handle error if needed
    } finally {
      setEndingSession(false);
    }
  };

  const handleViewResults = () => {
    // Close the current modal
    onClose();
    // Navigate to the results page
    navigate(`/results/${sessionId}`);
  };

  // Custom close handler to prevent closing when in loading state
  const handleClose = (event, reason) => {
    if (endingSession) {
      return; // Don't close during session end
    }

    if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
      if (endingSession) {
        return; // Don't close during session end
      }
    }

    onClose();
  };

  // Determine modal state properties
  let modalContent;
  let modalActions;
  let modalTitle;
  let modalTitleColor;
  let modalIcon;
  let modalIconLabel;

  if (endingSession) {
    modalTitle = 'Ending Session...';
    modalTitleColor = (theme) => theme.palette.warning.main;
    modalIcon = <StopIcon />;
    modalIconLabel = 'Processing';
    modalContent = <EndingSessionContent />;
    modalActions = null;
  } else if (showEndConfirm) {
    modalTitle = 'End Game Session?';
    modalTitleColor = (theme) => theme.palette.warning.main;
    modalIcon = <StopIcon />;
    modalIconLabel = 'Confirm';
    modalContent = <ConfirmEndContent />;
    modalActions = (
      <ConfirmEndActions
        handleCancelEndSession={handleCancelEndSession}
        handleConfirmEndSession={handleConfirmEndSession}
        initialFocusRef={initialFocusRef}
      />
    );
  } else if (sessionEnded) {
    modalTitle = 'Session Ended';
    modalTitleColor = (theme) => theme.palette.info.main;
    modalIcon = <AssessmentIcon />;
    modalIconLabel = 'Ended';
    modalContent = <SessionEndedContent gameName={gameName} />;
    modalActions = (
      <SessionEndedActions
        onClose={onClose}
        handleViewResults={handleViewResults}
        initialFocusRef={initialFocusRef}
      />
    );
  } else {
    modalTitle = isNewSession ? 'Game Session Started!' : 'Active Game Session';
    modalTitleColor = (theme) =>
      isNewSession ? theme.palette.primary.main : theme.palette.success.main;
    modalIcon = isNewSession ? <PlayArrowIcon /> : <TimerIcon />;
    modalIconLabel = isNewSession ? 'New' : 'Live';
    modalContent = (
      <DefaultSessionContent
        gameName={gameName}
        isNewSession={isNewSession}
        sessionId={sessionId}
        playUrl={playUrl}
        copied={copied}
        handleCopyLink={handleCopyLink}
      />
    );
    modalActions = (
      <DefaultSessionActions
        isNewSession={isNewSession}
        copied={copied}
        handleShowEndConfirm={handleShowEndConfirm}
        onClose={onClose}
        handleCopyLink={handleCopyLink}
        initialFocusRef={initialFocusRef}
      />
    );
  }

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
            },
          },
        }}
        disableEscapeKeyDown={endingSession}
        keepMounted={false}
        aria-labelledby="session-modal-title"
      >
        <DialogTitle
          id="session-modal-title"
          sx={{
            pb: 1,
            fontWeight: 600,
            backgroundColor: modalTitleColor,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {modalTitle}

          <Chip
            icon={modalIcon}
            label={modalIconLabel}
            size="small"
            sx={{
              color: 'white',
              borderColor: 'white',
              '& .MuiChip-icon': {
                color: 'white',
              },
            }}
            variant="outlined"
          />
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2 }}>{modalContent}</DialogContent>
        {modalActions && (
          <DialogActions
            sx={{
              px: 3,
              pb: 3,
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            {modalActions}
          </DialogActions>
        )}
      </Dialog>

      <Snackbar
        open={showAlert}
        autoHideDuration={3000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Link copied to clipboard!
        </Alert>
      </Snackbar>
    </>
  );
};

// Prop types for helper components
DefaultSessionContent.propTypes = {
  gameName: PropTypes.string,
  isNewSession: PropTypes.bool,
  sessionId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  playUrl: PropTypes.string,
  copied: PropTypes.bool,
  handleCopyLink: PropTypes.func,
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
  gameName: PropTypes.string,
  isNewSession: PropTypes.bool,
  onEndSession: PropTypes.func,
};

export default SessionModal;
