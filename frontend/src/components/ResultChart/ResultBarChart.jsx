import { Box, Typography } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import PropTypes from 'prop-types';

export default function ResultBarChart({ results = [] }) {
  // Process data for the chart
  const processChartData = () => {
    if (!results || !results.length) {
      return {
        questionLabels: ['No Data'],
        correctData: [0],
        incorrectData: [0]
      };
    }

    // Get the number of questions from the first player's answers
    const questionCount = results[0]?.answers?.length || 0;
    
    // Initialize arrays to count correct and incorrect answers for each question
    const correctAnswers = Array(questionCount).fill(0);
    const incorrectAnswers = Array(questionCount).fill(0);
    
    // Count correct and incorrect answers for each question
    results.forEach(player => {
      player.answers.forEach((answer, index) => {
        if (answer.correct) {
          correctAnswers[index]++;
        } else {
          incorrectAnswers[index]++;
        }
      });
    });
    
    // Create question labels (Q1, Q2, etc.)
    const questionLabels = Array.from({ length: questionCount }, (_, i) => `Q${i + 1}`);
    
    return {
      questionLabels,
      correctData: correctAnswers,
      incorrectData: incorrectAnswers
    };
  };

  const { questionLabels, correctData, incorrectData } = processChartData();

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 800,
        mx: 'auto',
        mt: 4,
        p: 2,
        borderRadius: 3,
        bgcolor: 'rgba(255, 255, 255, 0.9)',
        boxShadow: 3,
        textAlign: 'center',
      }}
    >
      <Typography variant="h4" sx={{ mb: 3 }}>
        Question Performance Breakdown
      </Typography>
      <Box sx={{ height: 400, width: '100%', display: 'flex', justifyContent: 'center' }}>
        <BarChart
          xAxis={[
            { 
              scaleType: 'band', 
              data: questionLabels,
              label: 'Questions'
            },
          ]}
          series={[
            { 
              data: correctData,
              label: 'Correct Answers',
              color: '#4caf50'
            },
            { 
              data: incorrectData,
              label: 'Incorrect Answers',
              color: '#f44336'
            },
          ]}
          height={300}
          width={500}
          legend={{ 
            position: 'top',
            padding: 20,
          }}
          margin={{ top: 40, bottom: 40, left: 40, right: 40 }}
        />
      </Box>
    </Box>
  );
}

ResultBarChart.propTypes = {
  results: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      answers: PropTypes.arrayOf(
        PropTypes.shape({
          correct: PropTypes.bool,
        })
      ),
    })
  ),
};
