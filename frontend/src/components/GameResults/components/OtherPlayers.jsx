import PropTypes from 'prop-types';
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
  Chip,
  Box,
} from '@mui/material';
import {
  Timer as TimerIcon,
  EmojiEvents as TrophyIcon,
} from '@mui/icons-material';

// Other players table component
const OtherPlayers = ({ players }) => (
  <TableContainer sx={{ p: 3 }}>
    <Typography
      variant="h6"
      fontWeight={600}
      sx={{ mb: 2, color: 'rgba(0, 0, 0, 0.7)' }}
    >
      Other Top Players
    </Typography>
    <Table>
      <TableHead>
        <TableRow sx={{ backgroundColor: 'rgba(0, 0, 0, 0.03)' }}>
          <TableCell align="center" sx={{ width: '10%', fontWeight: 600 }}>
            Rank
          </TableCell>
          <TableCell align="left" sx={{ width: '40%', fontWeight: 600 }}>
            Player
          </TableCell>
          <TableCell align="center" sx={{ width: '25%', fontWeight: 600 }}>
            Score
          </TableCell>
          <TableCell align="right" sx={{ width: '25%', fontWeight: 600 }}>
            Avg. Time
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {players.map((player, index) => (
          <TableRow
            key={player.name + index}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.03)',
              },
              transition: 'background-color 0.2s',
            }}
          >
            <TableCell
              align="center"
              sx={{
                fontSize: 16,
                fontWeight: 600,
                color: 'rgba(0, 0, 0, 0.6)',
              }}
            >
              {index + 4}
            </TableCell>
            <TableCell
              align="left"
              sx={{
                fontSize: 16,
                fontWeight: 500,
              }}
            >
              {player.name || `Player ${index + 4}`}
            </TableCell>
            <TableCell align="center">
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Chip
                  icon={<TrophyIcon sx={{ color: '#FFD700 !important' }} />}
                  label={`${player.score}/${player.totalQuestions}`}
                  variant="outlined"
                  color="primary"
                  size="small"
                  sx={{ fontWeight: 'bold' }}
                />
              </Box>
            </TableCell>
            <TableCell align="right">
              {player.avgResponseTime !== null ? (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <Chip
                    icon={<TimerIcon fontSize="small" />}
                    label={`${player.avgResponseTime}s`}
                    size="small"
                    color="secondary"
                    variant="outlined"
                  />
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  N/A
                </Typography>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

OtherPlayers.propTypes = {
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

export default OtherPlayers;
