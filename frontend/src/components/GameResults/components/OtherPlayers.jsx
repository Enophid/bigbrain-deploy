import PropTypes from 'prop-types';
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';
import bigBrainTheme from '../../../theme/bigBrainTheme';

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
      <TableBody>
        {players.map((player, index) => (
          <TableRow 
            key={player.id || index}
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
                fontSize: 18,
                fontWeight: 600,
                color: 'rgba(0, 0, 0, 0.6)',
                width: '15%',
              }}
            >
              {index + 4}
            </TableCell>
            <TableCell
              align="left"
              sx={{ 
                fontSize: 16, 
                fontWeight: 500,
                width: '60%',
              }}
            >
              {player.name || `Player ${index + 4}`}
            </TableCell>
            <TableCell
              align="right"
              sx={{ 
                fontSize: 16, 
                fontWeight: 700,
                color: bigBrainTheme.palette.primary.main,
                width: '25%',
              }}
            >
              {player.score || 0} pts
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
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string,
      score: PropTypes.number,
    })
  ).isRequired,
};

export default OtherPlayers; 