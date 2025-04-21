import { Paper, Typography } from '@mui/material';

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
    <Typography
      variant="h6"
      sx={{
        fontWeight: 'bold',
        mb: 1.5,
        color: 'primary.main',
        fontSize: { xs: '1rem', sm: '1.25rem' },
      }}
    >
      Advanced Points System
    </Typography>
    <Typography variant="body2" sx={{ mb: 1.5 }}>
      Your points are calculated using a speed-based multiplier:
    </Typography>
    <Typography variant="body2" component="div" sx={{ mb: 1 }}>
      <strong>Final Points = Base Question Points × Speed Multiplier</strong>
    </Typography>
    <Typography variant="body2" sx={{ mb: 0.5 }}>
      • Faster answers earn higher multipliers (up to 2x for instant answers)
    </Typography>
    <Typography variant="body2" sx={{ mb: 0.5 }}>
      • Even the slowest answers receive at least 0.5x multiplier
    </Typography>
    <Typography variant="body2">
      • The multiplier decreases linearly as more time is used
    </Typography>
  </Paper>
);

export default PointsSystemExplanation;
