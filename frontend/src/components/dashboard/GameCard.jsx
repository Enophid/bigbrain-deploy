import PropTypes from 'prop-types';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Button,
  IconButton,
  Chip,
  Divider,
  Tooltip,
  Fade,
  useMediaQuery,
} from '@mui/material';
import { Grid } from '@mui/material';
import {
  Edit as EditIcon,
  PlayArrow as PlayArrowIcon,
  DeleteOutline as DeleteIcon,
  QuestionAnswer as QuestionIcon,
  AccessTime as TimeIcon,
  Sensors as LiveIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const GameCardMedia = ({ game, isActive, theme }) => (
  <Box sx={{ position: 'relative' }}>
    <CardMedia
      component="img"
      height="180"
      image={
        game.thumbnail ||
        'https://via.placeholder.com/400x200?text=Game+Thumbnail'
      }
      alt={`${game.name} Thumbnail`}
      sx={{
        objectFit: 'cover',
        filter: 'none',
      }}
    />
    {isActive && (
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          left: 16,
          display: 'flex',
          alignItems: 'center',
          backgroundColor: theme.palette.success.main,
          color: 'white',
          px: 1.5,
          py: 0.5,
          borderRadius: 4,
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        }}
      >
        <LiveIcon
          fontSize="small"
          sx={{ mr: 0.5, animation: 'pulse 1.5s infinite' }}
        />
        <Typography variant="body2" fontWeight="bold">
          LIVE
        </Typography>
      </Box>
    )}
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background:
          'linear-gradient(to bottom, rgba(0,0,0,0) 60%, rgba(0,0,0,0.8) 100%)',
      }}
    />
    <Typography
      variant="h5"
      sx={{
        position: 'absolute',
        bottom: 10,
        left: 16,
        color: 'white',
        fontWeight: 700,
        textShadow: '0 2px 4px rgba(0,0,0,0.5)',
      }}
    >
      {game.name}
    </Typography>
  </Box>
);

const GameCardActions = ({
  game,
  isMobile,
  onEdit,
  onDelete,
  displayAlert,
}) => {
  const isActive = Boolean(game.active);
  const handleEditClick = () => {
    !game.active
      ? onEdit(game.id)
      : displayAlert(
        'This game session is currently active. You cannot edit it while it is in progress.',
        'error'
      );
  };

  const handleDeleteClick = () => {
    if (isActive) {
      displayAlert(
        'This game session is currently active. You cannot delete it while it is in progress.',
        'error'
      );
      return;
    }

    onDelete(game.id);
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 10,
        right: 10,
        display: 'flex',
        gap: 1,
        zIndex: 10,
      }}
    >
      <Tooltip title="Edit Game">
        <IconButton
          size={isMobile ? 'small' : 'medium'}
          color="primary"
          sx={{
            backgroundColor: 'rgba(255,255,255,0.9)',
            '&:hover': {
              backgroundColor: 'white',
            },
          }}
          onClick={handleEditClick}
        >
          <EditIcon fontSize={isMobile ? 'small' : 'medium'} />
        </IconButton>
      </Tooltip>
      <Tooltip title={isActive ? 'Cannot delete active game' : 'Delete Game'}>
        <IconButton
          size={isMobile ? 'small' : 'medium'}
          color="error"
          sx={{
            backgroundColor: 'rgba(255,255,255,0.9)',
            '&:hover': {
              backgroundColor: 'white',
            },
            opacity: isActive ? 0.6 : 1,
          }}
          onClick={handleDeleteClick}
        >
          <DeleteIcon fontSize={isMobile ? 'small' : 'medium'} />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

const GameCardInfo = ({ game, isActive }) => {
  const totalMinutes = game.questions.reduce(
    (acc, q) => acc + (q.duration / 60 || 0),
    0
  );

  const gameDate =
    new Date(game.createAt || '').toLocaleDateString() || 'No date';

  // Check if game has past sessions
  const hasPastSessions = game.oldSessions && game.oldSessions.length > 0;

  return (
    <CardContent sx={{ flexGrow: 1, pt: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <QuestionIcon fontSize="small" color="primary" sx={{ mr: 0.5 }} />
          <Typography variant="body2" color="text.secondary">
            {game.questions.length} Questions
          </Typography>
        </Box>
        <Divider orientation="vertical" flexItem sx={{ mx: 1.5, my: 0.5 }} />
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TimeIcon fontSize="small" color="primary" sx={{ mr: 0.5 }} />
          <Typography variant="body2" color="text.secondary">
            {totalMinutes} minutes
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          gap: 1,
          flexWrap: 'wrap',
          mb: 2,
        }}
      >
        {isActive ? (
          <Chip
            label="Active Session"
            size="small"
            color="success"
            sx={{
              fontWeight: 'bold',
              animation: 'pulse 1.5s infinite',
              '@keyframes pulse': {
                '0%': { boxShadow: '0 0 0 0 rgba(76, 175, 80, 0.4)' },
                '70%': { boxShadow: '0 0 0 10px rgba(76, 175, 80, 0)' },
                '100%': { boxShadow: '0 0 0 0 rgba(76, 175, 80, 0)' },
              },
            }}
          />
        ) : (
          <Chip
            label="Inactive"
            size="small"
            color="default"
            variant="outlined"
          />
        )}
        <Chip label={gameDate} size="small" variant="outlined" />
        {hasPastSessions && (
          <Chip
            label={`${game.oldSessions.length} Past Session${
              game.oldSessions.length > 1 ? 's' : ''
            }`}
            size="small"
            color="info"
            variant="outlined"
            icon={<HistoryIcon fontSize="small" />}
          />
        )}
      </Box>

      {isActive && (
        <Box sx={{ mt: 1, mb: 1 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontWeight: 'medium' }}
          >
            Session ID:{' '}
            <Typography
              component="span"
              variant="body2"
              color="success.main"
              fontWeight="bold"
            >
              {game.active}
            </Typography>
          </Typography>
        </Box>
      )}
    </CardContent>
  );
};

const GameCardFooter = ({ game, onStart, onViewPastSessions }) => {
  const isActive = Boolean(game.active);
  const hasPastSessions = game.oldSessions && game.oldSessions.length > 0;

  return (
    <>
      <Divider />
      <Box sx={{ p: 2, display: 'flex', gap: 1 }}>
        <Button
          variant="contained"
          color={isActive ? 'success' : 'primary'}
          fullWidth
          startIcon={<PlayArrowIcon />}
          sx={{
            borderRadius: 2,
            py: 1,
            textTransform: 'none',
            fontWeight: 600,
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            '&:hover': {
              boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
            },
          }}
          onClick={() => onStart(game.id)}
        >
          {isActive ? 'View Active Session' : 'Start Game'}
        </Button>

        {hasPastSessions && (
          <Button
            variant="outlined"
            color="info"
            sx={{
              borderRadius: 2,
              py: 1,
              textTransform: 'none',
              fontWeight: 600,
              minWidth: 'auto',
              width: '48px',
            }}
            onClick={() =>
              onViewPastSessions(game.id, game.name, game.oldSessions)
            }
            title="View Past Sessions"
          >
            <HistoryIcon />
          </Button>
        )}
      </Box>
    </>
  );
};

const GameCard = ({
  game,
  index,
  onEdit,
  onDelete,
  onStart,
  onViewPastSessions,
  displayAlert,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isActive = Boolean(game.active);

  return (
    <Grid
      sx={{
        gridColumn: {
          xs: 'span 1',
          sm: 'span 1',
          md: 'span 1',
          lg: 'span 1',
          xl: 'span 1',
        },
      }}
    >
      <Fade in={true} timeout={300 + index * 100}>
        <Card
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            transition: 'transform 0.3s, box-shadow 0.3s',
            position: 'relative',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 12px 28px rgba(0,0,0,0.2)',
            },
            ...(isActive && {
              border: '2px solid',
              borderColor: 'success.main',
            }),
          }}
          elevation={3}
        >
          <GameCardActions
            game={game}
            isMobile={isMobile}
            onEdit={onEdit}
            onDelete={onDelete}
            displayAlert={displayAlert}
          />
          <GameCardMedia game={game} isActive={isActive} theme={theme} />
          <GameCardInfo game={game} isActive={isActive} />
          <GameCardFooter
            game={game}
            onStart={onStart}
            onViewPastSessions={onViewPastSessions}
          />
        </Card>
      </Fade>
    </Grid>
  );
};

GameCardMedia.propTypes = {
  game: PropTypes.object.isRequired,
  isActive: PropTypes.bool.isRequired,
  theme: PropTypes.object.isRequired,
};

GameCardActions.propTypes = {
  game: PropTypes.object.isRequired,
  isMobile: PropTypes.bool.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  displayAlert: PropTypes.func.isRequired,
};

GameCardInfo.propTypes = {
  game: PropTypes.object.isRequired,
  isActive: PropTypes.bool.isRequired,
};

GameCardFooter.propTypes = {
  game: PropTypes.object.isRequired,
  onStart: PropTypes.func.isRequired,
  onViewPastSessions: PropTypes.func.isRequired,
};

GameCard.propTypes = {
  game: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onStart: PropTypes.func.isRequired,
  onViewPastSessions: PropTypes.func.isRequired,
  displayAlert: PropTypes.func.isRequired,
};

export default GameCard;
