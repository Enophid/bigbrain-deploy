import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Divider,
  LinearProgress,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  EmojiEvents as TrophyIcon,
  Speed as SpeedIcon,
} from '@mui/icons-material';
import PropTypes from 'prop-types';

/**
 * Component to display detailed performance analysis for each question
 */
const DetailedPerformance = ({ results }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Sort results by question position
  const sortedResults = [...results].sort((a, b) => a.position - b.position);

  return (
    <Box sx={{ mb: 4 }}>
      <Typography
        variant="h6"
        sx={{
          mb: { xs: 2, sm: 2.5 },
          fontWeight: 'bold',
          fontSize: { xs: '1.1rem', sm: '1.25rem' },
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <SpeedIcon sx={{ mr: 1, color: 'primary.main' }} />
        Detailed Performance Analysis
      </Typography>

      {sortedResults.map((result, index) => {
        const isCorrect = result.correct;
        const basePoints = result.questionPoints || 10;
        const earnedPoints = result.points || 0;
        const speedMultiplier =
          result.speedMultiplier || (isCorrect ? earnedPoints / basePoints : 0);

        // Calculate bonus points explicitly
        const regularPoints = isCorrect ? basePoints : 0;
        const bonusPoints = isCorrect ? earnedPoints - regularPoints : 0;

        // Calculate percentage of points earned (for progress bar)
        const pointsPercentage = isCorrect
          ? (earnedPoints / (basePoints * 2)) * 100
          : 0;

        return (
          <Paper
            key={index}
            elevation={1}
            sx={{
              p: { xs: 2, sm: 3 },
              mb: 2,
              borderRadius: 2,
              border: isCorrect
                ? '1px solid rgba(76, 175, 80, 0.2)'
                : '1px solid rgba(244, 67, 54, 0.2)',
              backgroundColor: isCorrect
                ? 'rgba(76, 175, 80, 0.05)'
                : 'rgba(244, 67, 54, 0.05)',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexDirection: isMobile ? 'column' : 'row',
                mb: 1.5,
              }}
            >
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  Question {result.position}
                  <Chip
                    icon={isCorrect ? <CheckCircleIcon /> : <CancelIcon />}
                    label={isCorrect ? 'Correct' : 'Incorrect'}
                    color={isCorrect ? 'success' : 'error'}
                    size="small"
                    sx={{ ml: 1, fontWeight: 'medium' }}
                  />
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5, mb: 1 }}
                >
                  {result.question}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mt: isMobile ? 1 : 0,
                }}
              >
                <TrophyIcon
                  color={isCorrect ? 'success' : 'disabled'}
                  sx={{ mr: 0.5 }}
                />
                <Typography
                  variant="h6"
                  color={isCorrect ? 'success.main' : 'text.secondary'}
                >
                  {earnedPoints} points
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 1.5 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">
                  Base Points
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                  <Typography variant="body1" fontWeight="medium">
                    {basePoints}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">
                  Speed Multiplier
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                  <Typography
                    variant="body1"
                    fontWeight="medium"
                    color={isCorrect ? 'primary.main' : 'text.secondary'}
                  >
                    {isCorrect ? `${speedMultiplier}x` : 'N/A'}
                  </Typography>
                  {isCorrect && speedMultiplier > 1 && (
                    <Chip
                      label="Speed Bonus!"
                      color="secondary"
                      size="small"
                      sx={{ ml: 1, fontWeight: 'medium' }}
                    />
                  )}
                </Box>
              </Grid>

              {isCorrect && (
                <Grid item xs={12} sx={{ mt: 1 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mb: 0.5, display: 'block' }}
                  >
                    Points Calculation
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2">
                      {basePoints} × {speedMultiplier} = {earnedPoints} points
                    </Typography>
                  </Box>

                  {bonusPoints > 0 && (
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        mb: 2,
                        bgcolor: 'rgba(156, 39, 176, 0.08)',
                        border: '1px solid rgba(156, 39, 176, 0.2)',
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        color="secondary.main"
                        sx={{ mb: 0.5, fontWeight: 'bold' }}
                      >
                        Speed Bonus Breakdown:
                      </Typography>
                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <Typography variant="body2">Base Points:</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" align="right">
                            {regularPoints}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography
                            variant="body2"
                            color="secondary.main"
                            fontWeight="medium"
                          >
                            Speed Bonus:
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography
                            variant="body2"
                            color="secondary.main"
                            fontWeight="bold"
                            align="right"
                          >
                            +{bonusPoints}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Divider sx={{ my: 0.5 }} />
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" fontWeight="bold">
                            Total:
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography
                            variant="body2"
                            fontWeight="bold"
                            align="right"
                          >
                            {earnedPoints}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  )}

                  <LinearProgress
                    variant="determinate"
                    value={pointsPercentage}
                    color="success"
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    }}
                  />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 0.5, display: 'block' }}
                  >
                    {earnedPoints} out of maximum {basePoints * 2} possible
                    points ({Math.round(pointsPercentage)}%)
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Paper>
        );
      })}
    </Box>
  );
};

DetailedPerformance.propTypes = {
  results: PropTypes.array.isRequired,
};

export default DetailedPerformance;
