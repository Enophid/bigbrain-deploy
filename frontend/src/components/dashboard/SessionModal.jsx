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
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const SessionModal = ({ open, onClose, sessionId, gameName, isNewSession = true, onEndSession }) => {
  const [copied, setCopied] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [endingSession, setEndingSession] = useState(false);
  const navigate = useNavigate();

  // Generate the play URL with the session ID
  const playUrl = `${window.location.origin}/play?session=${sessionId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(playUrl)
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
    modalTitleColor = theme => theme.palette.warning.main;
    modalIcon = <StopIcon />;
    modalIconLabel = "Processing";
    
    modalContent = (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress color="warning" size={60} sx={{ mb: 3 }} />
        <Typography variant="h6">
          Ending the game session...
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Please wait while we process your request
        </Typography>
      </Box>
    );
    
    modalActions = null;
  } else if (showEndConfirm) {
    modalTitle = 'End Game Session?';
    modalTitleColor = theme => theme.palette.warning.main;
    modalIcon = <StopIcon />;
    modalIconLabel = "Confirm";
    
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
      <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
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
  } 