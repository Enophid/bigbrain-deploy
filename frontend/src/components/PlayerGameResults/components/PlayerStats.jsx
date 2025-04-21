import { Box, Typography, Grid, Card } from '@mui/material';
import {
  Timer as TimerIcon,
  EmojiEvents as TrophyIcon,
} from '@mui/icons-material';
import PropTypes from 'prop-types';

/**
 * Component to display player statistics
 */
const PlayerStats = ({ totalScore, avgTime, isMobile }) => (
  <Box sx={{ textAlign: 'center', mb: { xs: 3, sm: 4 } }}>
    <Typography
      variant="h4"
      sx={{
        fontWeight: 'bold',
        color: '#1a237e',
        mb: 1.5,
        fontSize: {
          xs: '1.75rem',
          sm: '2.125rem',
          md: '2.5rem',
        },
      }}
    >
      Results So Far
    </Typography>
    <Typography
      variant="h6"
      sx={{
        color: 'text.secondary',
        mb: { xs: 2, sm: 3 },
        fontSize: { xs: '1rem', sm: '1.25rem' },
      }}
    >
      Here&apos;s how you&apos;re performing
    </Typography>

    <Grid
      container
      spacing={2}
      justifyContent="center"
      sx={{ mb: { xs: 3, sm: 4 } }}
    >
      <Grid item xs={6} sm={5} md={4}>
        <Card
          sx={{
            p: { xs: 1.5, sm: 2 },
            bgcolor: 'primary.main',
            color: 'white',
            borderRadius: 3,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mb: 1,
            }}
          >
            <TrophyIcon fontSize={isMobile ? 'medium' : 'large'} />
          </Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 'bold',
              fontSize: { xs: '1.5rem', sm: '1.8rem' },
            }}
          >
            {totalScore}
          </Typography>
          <Typography variant="body2">Total Points</Typography>
        </Card>
      </Grid>

      <Grid item xs={6} sm={5} md={4}>
        <Card
          sx={{
            p: { xs: 1.5, sm: 2 },
            bgcolor: 'secondary.main',
            color: 'white',
            borderRadius: 3,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mb: 1,
            }}
          >
            <TimerIcon fontSize={isMobile ? 'medium' : 'large'} />
          </Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 'bold',
              fontSize: { xs: '1.5rem', sm: '1.8rem' },
            }}
          >
            {avgTime}s
          </Typography>
          <Typography variant="body2">Avg Response Time</Typography>
        </Card>
      </Grid>
    </Grid>
  </Box>
);

PlayerStats.propTypes = {
  totalScore: PropTypes.number.isRequired,
  avgTime: PropTypes.number.isRequired,
  isMobile: PropTypes.bool.isRequired,
};

export default PlayerStats;
