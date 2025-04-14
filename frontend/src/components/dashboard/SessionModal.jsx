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
} from '@mui/material';
import { 
  ContentCopy as CopyIcon, 
  Check as CheckIcon,
  Timer as TimerIcon,
  PlayArrow as PlayArrowIcon,
  Stop as StopIcon
} from '@mui/icons-material';

const SessionModal = ({ open, onClose, sessionId, gameName, isNewSession = true, onEndSession }) => {
  const [copied, setCopied] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

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

  return (
    <>
      <Dialog 
        open={open} 
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          }
        }}
      >
        <DialogTitle sx={{ 
          pb: 1, 
          fontWeight: 600,
          backgroundColor: (theme) => isNewSession 
            ? theme.palette.primary.main 
            : theme.palette.success.main,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {isNewSession ? 'Game Session Started!' : 'Active Game Session'}
          
          <Chip
            icon={isNewSession ? <PlayArrowIcon /> : <TimerIcon />}
            label={isNewSession ? "New" : "Live"}
            size="small"
            sx={{ 
              color: 'white',
              borderColor: 'white',
              '& .MuiChip-icon': {
                color: 'white'
              }
            }}
            variant="outlined"
          />
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2 }}>
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
              value={sessionId}
              InputProps={{
                readOnly: true,
                sx: { fontWeight: 'bold', fontSize: '1.1rem' }
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
                  <Tooltip title={copied ? "Copied!" : "Copy to clipboard"}>
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
                Only one session of a game can be active at a time. To start a new session, you must first end the current one.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, display: 'flex', justifyContent: 'space-between' }}>
          <Box>
            {!isNewSession && (
              <Button
                variant="outlined"
                color="error"
                onClick={onEndSession}
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
              color={isNewSession ? "primary" : "success"}
              onClick={handleCopyLink}
              startIcon={copied ? <CheckIcon /> : <CopyIcon />}
              sx={{ borderRadius: 2 }}
            >
              {copied ? "Copied!" : "Copy Link"}
            </Button>
          </Box>
        </DialogActions>
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