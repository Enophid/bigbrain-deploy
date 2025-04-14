import { useState } from 'react';
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

  // Optional manual close handler to ensure we control when the modal closes
  const handleManualClose = () => {
    // Only close if we're not in the middle of ending a session
    if (!endingSession) {
      onClose();
    }
  };

  // Render different content based on the modal state
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

    modalContent = (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress color="warning" size={60} sx={{ mb: 3 }} />
        <Typography variant="h6">Ending the game session...</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Please wait while we process your request
        </Typography>
      </Box>
    );

    modalActions = null;
  } else if (showEndConfirm) {
    modalTitle = 'End Game Session?';
    modalTitleColor = (theme) => theme.palette.warning.main;
    modalIcon = <StopIcon />;
    modalIconLabel = 'Confirm';

    modalContent = (
      <>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Are you sure you want to end this session?
        </Typography>

        <Typography variant="body1" sx={{ mb: 1 }}>
          Ending this session will:
        </Typography>

        <Box sx={{ pl: 2, mb: 3 }}>
          <Typography variant="body2" paragraph>
            • Send all active players to the results screen
          </Typography>
          <Typography variant="body2" paragraph>
            • Stop the session permanently (it cannot be restarted)
          </Typography>
          <Typography variant="body2" paragraph>
            • Allow you to view the final results
          </Typography>
        </Box>
      </>
    );

    modalActions = (
      <Box
        sx={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}
      >
        <Button
          variant="outlined"
          onClick={handleCancelEndSession}
          sx={{ borderRadius: 2 }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleConfirmEndSession}
          startIcon={<StopIcon />}
          sx={{ borderRadius: 2 }}
        >
          End Session
        </Button>
      </Box>
    );
  } else if (sessionEnded) {
    modalTitle = 'Session Ended';
    modalTitleColor = (theme) => theme.palette.info.main;
    modalIcon = <AssessmentIcon />;
    modalIconLabel = 'Ended';

    modalContent = (
      <>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Session for {gameName} has ended
        </Typography>

        <Typography variant="body1" sx={{ mb: 3 }}>
          Would you like to view the results for this session?
        </Typography>
      </>
    );

    modalActions = (
      <>
        <Button variant="outlined" onClick={onClose} sx={{ borderRadius: 2 }}>
          No, Close
        </Button>
        <Button
          variant="contained"
          color="info"
          onClick={handleViewResults}
          startIcon={<AssessmentIcon />}
          sx={{ borderRadius: 2 }}
        >
          Yes, View Results
        </Button>
      </>
    );
  } else {
    modalTitle = isNewSession ? 'Game Session Started!' : 'Active Game Session';
    modalTitleColor = (theme) =>
      isNewSession ? theme.palette.primary.main : theme.palette.success.main;
    modalIcon = isNewSession ? <PlayArrowIcon /> : <TimerIcon />;
    modalIconLabel = isNewSession ? 'New' : 'Live';

    modalContent = (
      <>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {gameName}{' '}
          {isNewSession ? 'is now ready to play' : 'is currently active'}
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
            value={sessionId}
            InputProps={{
              readOnly: true,
              sx: { fontWeight: 'bold', fontSize: '1.1rem' },
            }}
          />
        </Box>

        <Box>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
            Direct link:
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            value={playUrl}
            InputProps={{
              readOnly: true,
              endAdornment: (
                <Tooltip title={copied ? 'Copied!' : 'Copy to clipboard'}>
                  <IconButton onClick={handleCopyLink} edge="end">
                    {copied ? <CheckIcon color="success" /> : <CopyIcon />}
                  </IconButton>
                </Tooltip>
              ),
            }}
          />
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

    modalActions = (
      <>
        <Box>
          {!isNewSession && (
            <Button
              variant="outlined"
              color="error"
              onClick={handleShowEndConfirm}
              startIcon={<StopIcon />}
              sx={{ borderRadius: 2, mr: 2 }}
            >
              End Session
            </Button>
          )}
        </Box>
        <Box>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{ borderRadius: 2, mr: 2 }}
          >
            Close
          </Button>
          <Button
            variant="contained"
            color={isNewSession ? 'primary' : 'success'}
            onClick={handleCopyLink}
            startIcon={copied ? <CheckIcon /> : <CopyIcon />}
            sx={{ borderRadius: 2 }}
          >
            {copied ? 'Copied!' : 'Copy Link'}
          </Button>
        </Box>
      </>
    );
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={handleManualClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          },
        }}
        // Prevent closing when clicking backdrop or pressing escape during session end
        disableEscapeKeyDown={endingSession}
        disableBackdropClick={endingSession}
      >
        <DialogTitle
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

SessionModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  sessionId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  gameName: PropTypes.string,
  isNewSession: PropTypes.bool,
  onEndSession: PropTypes.func,
};

export default SessionModal;
