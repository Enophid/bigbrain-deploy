import PropTypes from 'prop-types';
import {
  Grid,
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
import {
  Edit as EditIcon,
  PlayArrow as PlayArrowIcon,
  DeleteOutline as DeleteIcon,
  QuestionAnswer as QuestionIcon,
  AccessTime as TimeIcon,
  Sensors as LiveIcon,
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

