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
  Menu,
  MenuItem,
} from '@mui/material';
import {
  History as HistoryIcon,
  AccessTime as TimeIcon,
  Assessment as AssessmentIcon,
  Close as CloseIcon,
  BarChart as BarChartIcon,
  MoreVert as MoreVertIcon,
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
  const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);
  const [selectedSessionId, setSelectedSessionId] = React.useState(null);

  const handleViewResults = (sessionId) => {
    // Navigate to the results page for this session
    navigate(`/results/${sessionId}`);
    onClose();
  };

  const handleViewCharts = (sessionId) => {
    // Navigate to the detailed charts page for this session
    navigate(`/game-results/${sessionId}`);
    onClose();
  };

  const handleMenuOpen = (event, sessionId) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
    setSelectedSessionId(sessionId);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedSessionId(null);
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
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 3,
          backgroundImage: 'linear-gradient(to bottom, #ffffff, #f9f9f9)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 3,
          py: 2,
          backgroundColor: theme.palette.primary.main,
          color: 'white',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <HistoryIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="span" sx={{ fontWeight: 600 }}>
            Past Sessions for {gameName}
          </Typography>
        </Box>
        <Tooltip title="Close">
          <IconButton
            edge="end"
            color="inherit"
            onClick={onClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Tooltip>
      </DialogTitle>
      <DialogContent sx={{ px: 2, py: 3 }}>
        {sortedSessions.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              No past sessions available for this game.
            </Typography>
          </Box>
        ) : (
          <List>
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
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Chip
                            size="small"
                            label="View Results"
                            color="info"
                            variant="outlined"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewResults(sessionId);
                            }}
                            sx={{ mr: 1 }}
                          />
                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuOpen(e, sessionId)}
                          >
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        </Box>
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
      <DialogActions sx={{ px: 3, py: 2, justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{ borderRadius: 2 }}
        >
          Close
        </Button>
      </DialogActions>

      {/* Session options menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        elevation={3}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={() => {
          handleViewResults(selectedSessionId);
          handleMenuClose();
        }}>
          <AssessmentIcon fontSize="small" sx={{ mr: 1 }} />
          View Results
        </MenuItem>
        <MenuItem onClick={() => {
          handleViewCharts(selectedSessionId);
          handleMenuClose();
        }}>
          <BarChartIcon fontSize="small" sx={{ mr: 1 }} />
          View Detailed Charts
        </MenuItem>
      </Menu>
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