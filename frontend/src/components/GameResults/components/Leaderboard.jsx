import PropTypes from 'prop-types';
import { Box, Typography, Divider } from '@mui/material';
import { EmojiEvents as TrophyIcon } from '@mui/icons-material';
import TopThreeWinners from './TopThreeWinners';
import OtherPlayers from './OtherPlayers';
import SectionHeader from './SectionHeader';

// Leaderboard component
const Leaderboard = ({ results }) => (
  <Box
    sx={{
      width: '100%',
      maxWidth: 700,
      mx: 'auto',
      borderRadius: 4,
      bgcolor: 'rgba(255, 255, 255, 0.95)',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
      overflow: 'hidden',
    }}
  >
    <SectionHeader 
      title="Leaderboard" 
      icon={
        <TrophyIcon 
          sx={{ 
            fontSize: 40,
            color: '#FFD700',
            position: 'absolute',
            left: '15%',
            top: '50%',
            transform: 'translateY(-50%)',
            display: { xs: 'none', sm: 'block' },
          }} 
        />
      }
    />

    <Divider />

    {results.length > 0 ? (
      <>
        {/* Top 3 Winners */}
        {results.slice(0, 3).length > 0 && (
          <TopThreeWinners players={results} />
        )}

        {/* Other Players */}
        {results.slice(3, 10).length > 0 && (
          <OtherPlayers players={results.slice(3, 10)} />
        )}
      </>
    ) : (
      <Box sx={{ p: 5, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          No players to display! 🛑
        </Typography>
        <Typography sx={{ mt: 1, color: 'text.secondary' }}>
          Results will appear once players have completed the game.
        </Typography>
      </Box>
    )}
  </Box>
);

Leaderboard.propTypes = {
  results: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string,
      score: PropTypes.number,
    })
  ).isRequired,
};

export default Leaderboard; 