import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Avatar,
  Chip,
} from '@mui/material';

// Player podium component (1st, 2nd, 3rd places)
const PlayerPodium = ({ player, rank, color, size, order, marginTop }) => {
  const medalEmoji = {
    1: '🥇',
    2: '🥈',
    3: '🥉'
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mt: marginTop,
        order: order,
      }}
    >
      <Avatar
        sx={{
          width: size.width,
          height: size.height,
          bgcolor: color,
          border: '4px solid white',
          boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
          fontSize: size.fontSize,
          mb: 1,
        }}
      >
        {medalEmoji[rank]}
      </Avatar>
      <Typography
        variant={rank === 1 ? 'h5' : 'h6'}
        fontWeight={rank === 1 ? 700 : 600}
        sx={{ mb: 0.5 }}
      >
        {player?.name || `Player ${rank}`}
      </Typography>
      <Chip
        label={`${player?.score || 0} pts`}
        sx={{
          backgroundColor: color,
          color: 'white',
          fontWeight: 'bold',
          fontSize: rank === 1 ? '1rem' : '0.9rem',
          px: rank === 1 ? 1 : 0,
        }}
      />
    </Box>
  );
};

PlayerPodium.propTypes = {
  player: PropTypes.shape({
    name: PropTypes.string,
    score: PropTypes.number,
  }),
  rank: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  size: PropTypes.shape({
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    fontSize: PropTypes.string,
  }).isRequired,
  order: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  marginTop: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
};

export default PlayerPodium; 