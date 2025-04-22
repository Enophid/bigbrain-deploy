import PropTypes from 'prop-types';
import { Box, Typography, Divider } from '@mui/material';
import { EmojiEvents as TrophyIcon } from '@mui/icons-material';
import TopThreeWinners from './TopThreeWinners';
import OtherPlayers from './OtherPlayers';
import SectionHeader from './SectionHeader';
import { useMemo } from 'react';

// Leaderboard component
const Leaderboard = ({ results }) => {
  // Process results to calculate scores and rank players
  const processedResults = useMemo(() => {
    if (!results || !results.length) return [];

    return (
      results
        .map((player) => {
          // Calculate correct answers
          const correctAnswers = player.answers.filter(
            (answer) => answer.correct
          ).length;
          // Calculate total possible answers
          const totalQuestions = player.answers.length;
          // Calculate score as percentage
          const scorePercentage =
            totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
          // Calculate average response time (in seconds)
          const responseTimes = player.answers
            .filter((a) => a.answeredAt && a.questionStartedAt)
            .map((a) => {
              const startTime = new Date(a.questionStartedAt).getTime();
              const endTime = new Date(a.answeredAt).getTime();
              return (endTime - startTime) / 1000;
            });

          const avgResponseTime =
            responseTimes.length > 0
              ? responseTimes.reduce((sum, time) => sum + time, 0) /
                responseTimes.length
              : null;

          return {
            name: player.name,
            score: correctAnswers,
            totalQuestions,
            scorePercentage,
            avgResponseTime: avgResponseTime
              ? Math.round(avgResponseTime * 10) / 10
              : null, // Round to 1 decimal
            answers: player.answers,
          };
        })
        // Sort by score (descending) then by avg response time (ascending)
        .sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score;
          // For tie-breakers, faster response time wins
          if (a.avgResponseTime !== null && b.avgResponseTime !== null) {
            return a.avgResponseTime - b.avgResponseTime;
          }
          return 0;
        })
    );
  }, [results]);

  return (
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

      {processedResults.length > 0 ? (
        <>
          {/* Top 3 Winners */}
          {processedResults.slice(0, 3).length > 0 && (
            <TopThreeWinners players={processedResults.slice(0, 3)} />
          )}

          {/* Other Players */}
          {processedResults.slice(3).length > 0 && (
            <OtherPlayers players={processedResults.slice(3)} />
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
};

Leaderboard.propTypes = {
  results: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      answers: PropTypes.array,
    })
  ).isRequired,
};

export default Leaderboard;
