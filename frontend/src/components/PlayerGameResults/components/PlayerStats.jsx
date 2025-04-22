import { Box, Typography, Grid, Card, Tooltip } from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  CheckCircle as CheckCircleIcon,
  BarChart as AccuracyIcon,
} from '@mui/icons-material';
import PropTypes from 'prop-types';

/**
 * Component to display player statistics
 */
const PlayerStats = ({ totalScore, results, isMobile }) => {
  // Calculate additional stats
  const totalQuestions = results.length;
  const correctAnswers = results.filter((result) => result.correct).length;
  const accuracy =
    totalQuestions > 0
      ? Math.round((correctAnswers / totalQuestions) * 100)
      : 0;

  return (
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
        Your Game Results
      </Typography>
      <Typography
        variant="h6"
        sx={{
          color: 'text.secondary',
          mb: { xs: 2, sm: 3 },
          fontSize: { xs: '1rem', sm: '1.25rem' },
        }}
      >
        Here&apos;s how you performed in this game
      </Typography>

      <Grid
        container
        spacing={2}
        justifyContent="center"
        sx={{ mb: { xs: 3, sm: 4 } }}
      >
        <Grid item xs={12} sm={4}>
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
              position: 'relative',
              overflow: 'hidden',
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

        <Grid item xs={6} sm={4}>
          <Card
            sx={{
              p: { xs: 1.5, sm: 2 },
              bgcolor: '#388e3c', // green
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
              <CheckCircleIcon fontSize={isMobile ? 'medium' : 'large'} />
            </Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 'bold',
                fontSize: { xs: '1.5rem', sm: '1.8rem' },
              }}
            >
              {correctAnswers}/{totalQuestions}
            </Typography>
            <Typography variant="body2">Correct Answers</Typography>
          </Card>
        </Grid>

        <Grid item xs={6} sm={4}>
          <Tooltip title="Percentage of correct answers" arrow>
            <Card
              sx={{
                p: { xs: 1.5, sm: 2 },
                bgcolor: '#0277bd', // blue
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
                <AccuracyIcon fontSize={isMobile ? 'medium' : 'large'} />
              </Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 'bold',
                  fontSize: { xs: '1.5rem', sm: '1.8rem' },
                }}
              >
                {accuracy}%
              </Typography>
              <Typography variant="body2">Accuracy</Typography>
            </Card>
          </Tooltip>
        </Grid>
      </Grid>
    </Box>
  );
};

PlayerStats.propTypes = {
  totalScore: PropTypes.number.isRequired,
  results: PropTypes.array.isRequired,
  isMobile: PropTypes.bool.isRequired,
};

export default PlayerStats;
