import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import PlayerPodium from './PlayerPodium';

// Top 3 winners component
const TopThreeWinners = ({ players }) => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      gap: { xs: 2, md: 4 },
      p: 3,
      pb: 4,
      backgroundColor: 'rgba(245, 248, 255, 0.8)',
    }}
  >
    {/* Second Place */}
    {players.length > 1 && (
      <PlayerPodium
        player={players[1]}
        rank={2}
        color="#C0C0C0"
        size={{
          width: { xs: 80, md: 100 },
          height: { xs: 80, md: 100 },
          fontSize: '2rem',
        }}
        marginTop={{ xs: 3, md: 6 }}
        order={{ xs: 2, md: 1 }}
      />
    )}

    {/* First Place */}
    {players.length > 0 && (
      <PlayerPodium
        player={players[0]}
        rank={1}
        color="#FFD700"
        size={{
          width: { xs: 100, md: 130 },
          height: { xs: 100, md: 130 },
          fontSize: '2.5rem',
        }}
        marginTop={0}
        order={{ xs: 1, md: 2 }}
      />
    )}

    {/* Third Place */}
    {players.length > 2 && (
      <PlayerPodium
        player={players[2]}
        rank={3}
        color="#CD7F32"
        size={{
          width: { xs: 70, md: 90 },
          height: { xs: 70, md: 90 },
          fontSize: '1.8rem',
        }}
        marginTop={{ xs: 3, md: 7 }}
        order={{ xs: 3, md: 3 }}
      />
    )}
  </Box>
);

TopThreeWinners.propTypes = {
  players: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      score: PropTypes.number.isRequired,
      totalQuestions: PropTypes.number.isRequired,
      scorePercentage: PropTypes.number.isRequired,
      avgResponseTime: PropTypes.number,
    })
  ).isRequired,
};

export default TopThreeWinners;
