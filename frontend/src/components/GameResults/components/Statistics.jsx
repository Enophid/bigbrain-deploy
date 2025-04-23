import { Box, Typography, Paper, Grid, Divider, Chip } from '@mui/material';
import ResultBarChart from '../../ResultChart/ResultBarChart';
import ResultLineChart from '../../ResultChart/ResultLineChart';
import SectionHeader from './SectionHeader';
import ChartSection from './ChartSection';
import PointsSystemExplanation from './PointsSystemExplanation';
import PropTypes from 'prop-types';
import {
  EmojiEvents as TrophyIcon,
  Person as PersonIcon,
  Timer as TimerIcon,
  QuestionAnswer as QuestionIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useMemo } from 'react';

// Statistics component
const Statistics = ({ results = [] }) => {
  // Calculate overall statistics
  const stats = useMemo(() => {
    if (!results || !results.length) {
      return {
        playerCount: 0,
        totalCorrect: 0,
        totalAnswers: 0,
        accuracyPercentage: 0,
        avgResponseTime: 0,
        questionCount: 0,
      };
    }

    const playerCount = results.length;
    let totalCorrect = 0;
    let totalAnswers = 0;
    let responseTimes = [];

    // Use first player's answers to get question count
    const questionCount = results[0]?.answers?.length || 0;

    // Calculate totals
    results.forEach((player) => {
      player.answers.forEach((answer) => {
        totalAnswers++;
        if (answer.correct) totalCorrect++;

        if (answer.answeredAt && answer.questionStartedAt) {
          const startTime = new Date(answer.questionStartedAt).getTime();
          const endTime = new Date(answer.answeredAt).getTime();
          responseTimes.push((endTime - startTime) / 1000);
        }
      });
    });

    // Calculate rates
    const accuracyPercentage =
      totalAnswers > 0 ? Math.round((totalCorrect / totalAnswers) * 100) : 0;

    const avgResponseTime =
      responseTimes.length > 0
        ? Math.round(
          (responseTimes.reduce((sum, time) => sum + time, 0) /
              responseTimes.length) *
              10
        ) / 10
        : 0;

    return {
      playerCount,
      totalCorrect,
      totalAnswers,
      accuracyPercentage,
      avgResponseTime,
      questionCount,
    };
  }, [results]);

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 900,
        mx: 'auto',
        borderRadius: 4,
        bgcolor: 'rgba(255, 255, 255, 0.95)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
        overflow: 'hidden',
      }}
    >
      <SectionHeader title="Game Statistics" />

      {/* Summary Stats */}
      <Paper elevation={0} sx={{ p: 3, mb: 1 }}>
        <Typography
          variant="h6"
          gutterBottom
          fontWeight={600}
          color="text.secondary"
        >
          Session Overview
        </Typography>

        <Grid
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: 3,
            mt: 1,
          }}
        >
          <Grid sx={{ gridColumn: { xs: 'span 6', sm: 'span 3' } }}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <PersonIcon color="primary" sx={{ fontSize: 32, mb: 1 }} />
              <Typography variant="h5" fontWeight="bold">
                {stats.playerCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Players
              </Typography>
            </Box>
          </Grid>

          <Grid sx={{ gridColumn: { xs: 'span 6', sm: 'span 3' } }}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <QuestionIcon color="primary" sx={{ fontSize: 32, mb: 1 }} />
              <Typography variant="h5" fontWeight="bold">
                {stats.questionCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Questions
              </Typography>
            </Box>
          </Grid>

          <Grid sx={{ gridColumn: { xs: 'span 6', sm: 'span 3' } }}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <CheckCircleIcon color="success" sx={{ fontSize: 32, mb: 1 }} />
              <Typography variant="h5" fontWeight="bold">
                {stats.accuracyPercentage}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Accuracy
              </Typography>
            </Box>
          </Grid>

          <Grid sx={{ gridColumn: { xs: 'span 6', sm: 'span 3' } }}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <TimerIcon color="secondary" sx={{ fontSize: 32, mb: 1 }} />
              <Typography variant="h5" fontWeight="bold">
                {stats.avgResponseTime}s
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avg Response
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Chip
            icon={<TrophyIcon />}
            label={`${stats.totalCorrect} correct answers out of ${stats.totalAnswers} total responses`}
            color="primary"
            variant="outlined"
          />
        </Box>
      </Paper>

      <Divider />
      
      {/* Points System Explanation */}
      <Box sx={{ p: 3 }}>
        <PointsSystemExplanation />
      </Box>

      <Divider />

      <Box sx={{ p: 4 }}>
        <ChartSection title="Performance by Question">
          <ResultBarChart results={results} />
        </ChartSection>

        <ChartSection title="Score Distribution">
          <ResultLineChart results={results} />
        </ChartSection>
      </Box>
    </Box>
  );
};

Statistics.propTypes = {
  results: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      answers: PropTypes.array.isRequired,
    })
  ),
};

export default Statistics;
