import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Avatar,
  Zoom,
  Fade,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import {
  Lightbulb as LightbulbIcon,
  EmojiObjects as EmojiObjectsIcon,
  SportsEsports as GameIcon,
  Psychology as PsychologyIcon,
  Forum as ForumIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';

/**
 * Displays the lobby screen while waiting for the game to start
 */
const LobbyView = ({
  playerInfo,
  waitingTime,
  formatWaitingTime,
  lobbyTipIndex,
  lobbyTips,
}) => {
  return (
    <Fade in={true} timeout={800}>
      <Box sx={{ mt: 2 }}>
        {/* Player info section */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Zoom in={true} timeout={1000}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: playerInfo.color || 'primary.main',
                fontSize: '2rem',
                fontWeight: 'bold',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }}
            >
              {playerInfo.initials}
            </Avatar>
          </Zoom>
        </Box>

        <Zoom in={true} timeout={800}>
          <Typography variant="h5" align="center" gutterBottom>
            Welcome, {playerInfo.name}!
          </Typography>
        </Zoom>

        <Zoom in={true} timeout={1000}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mb: 4,
              mt: 1,
            }}
          >
            <Chip
              label="Ready"
              color="success"
              variant="outlined"
              sx={{ fontWeight: 'bold', mx: 1 }}
            />
            <Chip
              label={`Waiting: ${formatWaitingTime(waitingTime)}`}
              icon={<ScheduleIcon />}
              color="primary"
              variant="outlined"
              sx={{ fontWeight: 'bold', mx: 1 }}
            />
          </Box>
        </Zoom>

        {/* Status card */}
        <Zoom in={true} timeout={1200}>
          <Card
            sx={{
              mb: 4,
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              bgcolor: 'primary.light',
              color: 'white',
            }}
          >
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <GameIcon sx={{ mr: 1 }} /> Waiting for host to start
                the game...
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  mt: 2,
                }}
              >
                <CircularProgress sx={{ color: 'white' }} />
              </Box>
            </CardContent>
          </Card>
        </Zoom>

        {/* Tips section */}
        <Divider sx={{ my: 3 }}>
          <Chip label="Game Tips" color="primary" />
        </Divider>

        <Box sx={{ mb: 3 }}>
          <Fade key={lobbyTipIndex} in={true} timeout={500}>
            <Box
              sx={{
                p: 2,
                bgcolor: 'rgba(25, 118, 210, 0.08)',
                borderRadius: 2,
              }}
            >
              <Typography
                variant="body1"
                align="center"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'medium',
                  color: 'primary.dark',
                }}
              >
                <LightbulbIcon sx={{ mr: 1, color: 'warning.main' }} />
                {lobbyTips[lobbyTipIndex]}
              </Typography>
            </Box>
          </Fade>
        </Box>

        {/* How to play section */}
        <Zoom in={true} timeout={1500}>
          <Card sx={{ borderRadius: 2, mt: 3 }}>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <EmojiObjectsIcon sx={{ mr: 1, color: 'warning.main' }} /> How
                to Play
              </Typography>

              <List dense sx={{ bgcolor: 'background.paper' }}>
                <ListItem>
                  <ListItemIcon>
                    <PsychologyIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Answer questions as quickly as possible"
                    secondary="Faster answers earn more points"
                  />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <ForumIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Some questions have multiple answers"
                    secondary="Select all that apply in these cases"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Zoom>
      </Box>
    </Fade>
  );
};

LobbyView.propTypes = {
  playerInfo: PropTypes.shape({
    name: PropTypes.string,
    initials: PropTypes.string,
    color: PropTypes.string,
  }).isRequired,
  waitingTime: PropTypes.number.isRequired,
  formatWaitingTime: PropTypes.func.isRequired,
  lobbyTipIndex: PropTypes.number.isRequired,
  lobbyTips: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default LobbyView; 