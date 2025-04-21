import { Paper, Typography, Box } from '@mui/material';
import { EmojiEvents as TrophyIcon } from '@mui/icons-material';

/**
 * Component to display points system explanation
 */
const PointsSystemExplanation = () => (
  <Paper
    elevation={0}
    sx={{
      p: { xs: 2, sm: 3 },
      mb: { xs: 3, sm: 4 },
      bgcolor: 'rgba(25, 118, 210, 0.08)',
      borderRadius: 2,
      border: '1px solid rgba(25, 118, 210, 0.2)',
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
      <TrophyIcon sx={{ color: 'primary.main', mr: 1 }} />
      <Typography
        variant="h6"
        sx={{
          fontWeight: 'bold',
          color: 'primary.main',
          fontSize: { xs: '1rem', sm: '1.25rem' },
        }}
      >
        Points System Explained
      </Typography>
    </Box>
    
    <Typography variant="body2" sx={{ mb: 1.5 }}>
      Your points are calculated using a speed-based scoring system that rewards both accuracy and quick responses:
    </Typography>
    
    <Box sx={{ bgcolor: 'rgba(255,255,255,0.6)', p: 1.5, borderRadius: 1, mb: 2 }}>
      <Typography variant="body2" component="div" sx={{ mb: 1, fontWeight: 'bold', color: 'primary.dark' }}>
        Final Points = Base Question Points × Speed Multiplier
      </Typography>
    </Box>
    
    <Typography variant="body2" sx={{ fontWeight: 'medium', mb: 1 }}>
      How the Speed Multiplier works:
    </Typography>
    
    <Typography variant="body2" sx={{ mb: 0.5, display: 'flex', alignItems: 'center' }}>
      • <strong>Fast answers (under 10% of time):</strong> Up to 2x multiplier
    </Typography>
    <Typography variant="body2" sx={{ mb: 0.5 }}>
      • <strong>Medium speed answers:</strong> Between 1x and 2x multiplier
    </Typography>
    <Typography variant="body2" sx={{ mb: 0.5 }}>
      • <strong>Slow answers (using most of the time):</strong> Between 0.5x and 1x multiplier
    </Typography>
    <Typography variant="body2" sx={{ mb: 2 }}>
      • <strong>Incorrect answers:</strong> Always 0 points, regardless of speed
    </Typography>
    
    <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
      Example: A 10-point question answered correctly in half the allowed time would earn approximately 15 points (10 × 1.5).
    </Typography>
  </Paper>
);

export default PointsSystemExplanation;
