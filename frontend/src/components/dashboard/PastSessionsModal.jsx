import React from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  History as HistoryIcon,
  AccessTime as TimeIcon,
  Assessment as AssessmentIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

/**
 * Component to display a list of past sessions for a game
 * and allow navigating to view their results
 */
const PastSessionsModal = ({
  open,
  onClose,
  gameName,
  pastSessions = [],
}) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleViewResults = (sessionId) => {
    // Navigate to the results page for this session
    navigate(`/results/${sessionId}`);
    onClose();
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown date';
    
    try {
      const date = new Date(timestamp);
      return new Intl.DateTimeFormat('default', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(date);
    } catch (err) {
      console.error('Error formatting date:', err);
      return 'Invalid date';
    }
  };

  // Sort sessions by date (most recent first)
  const sortedSessions = [...pastSessions].sort((a, b) => b - a);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      scroll="paper"
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        },
      }}
      aria-labelledby="past-sessions-dialog-title"
    >
      <DialogTitle
        id="past-sessions-dialog-title"
        sx={{
          bgcolor: theme.palette.info.main,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <HistoryIcon sx={{ mr: 1.5 }} />
          <Typography variant="h6" component="div">
            Past Sessions for {gameName}
          </Typography>
        </Box>
        <Tooltip title="Close">
          <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Tooltip>
      </DialogTitle>

      <DialogContent dividers>
        {pastSessions.length === 0 ? (
          <Box
            sx={{
              py: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <HistoryIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No past sessions found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Start a new game session to create history
            </Typography>
          </Box>
        ) : (
          <List sx={{ width: '100%', pt: 1 }}>
            {sortedSessions.map((sessionId, index) => (
              <React.Fragment key={sessionId}>
                {index > 0 && <Divider component="li" variant="inset" />}
                <ListItem
                  alignItems="flex-start"
                  sx={{
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                    borderRadius: 1,
                    py: 1.5,
                  }}
                  onClick={() => handleViewResults(sessionId)}
                >
                  <ListItemIcon sx={{ minWidth: '40px' }}>
                    <AssessmentIcon color="info" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" component="span" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 'medium' }}>
                        <span>Session #{sessionId}</span>
                        <Chip
                          size="small"
                          label="View Results"
                          color="info"
                          variant="outlined"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewResults(sessionId);
                          }}
                        />
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary" component="span" sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                        <TimeIcon fontSize="small" sx={{ mr: 0.5, fontSize: '0.9rem', color: 'text.secondary' }} />
                        <span>Ended on {formatDate(Date.now() - index * 8640000)}</span> {/* Mock dates for display */}
                      </Typography>
                    }
                  />
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2 }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

PastSessionsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  gameName: PropTypes.string.isRequired,
  pastSessions: PropTypes.array,
};

export default PastSessionsModal; 