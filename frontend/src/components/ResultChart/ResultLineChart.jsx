import { Box, Typography } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import PropTypes from 'prop-types';

export default function ResultLineChart({ results = [] }) {
  // Process data for the chart
  const processChartData = () => {
    if (!results || !results.length) {
      return {
        questionLabels: ['No Data'],
        averageResponseTimes: [0]
      };
    }

    // Get the number of questions from the first player's answers
    const questionCount = results[0]?.answers?.length || 0;
    
    // Initialize arrays to store sum of response times and count of responses
    const responseTimes = Array(questionCount).fill(0);
    const responseCount = Array(questionCount).fill(0);
    
    // Calculate sum of response times for each question
    results.forEach(player => {
      player.answers.forEach((answer, index) => {
        if (answer.responseTime) {
          responseTimes[index] += answer.responseTime;
          responseCount[index]++;
        }
      });
    });
    
    // Calculate average response time for each question
    const averageResponseTimes = responseTimes.map((time, index) => {
      return responseCount[index] ? (time / responseCount[index]).toFixed(2) : 0;
    });
    
    // Create question labels (Q1, Q2, etc.)
    const questionLabels = Array.from({ length: questionCount }, (_, i) => `Q${i + 1}`);
    
    return {
      questionLabels,
      averageResponseTimes
    };
  };

  const { questionLabels, averageResponseTimes } = processChartData();

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
        Average Response Time (seconds)
      </Typography>
      <Box sx={{ height: 400, width: '100%', display: 'flex', justifyContent: 'center' }}>
        <LineChart
          xAxis={[
            { 
              scaleType: 'point', 
              data: questionLabels,
              label: 'Questions'
            },
          ]}
          series={[
            {
              data: averageResponseTimes.map(Number),
              label: 'Avg Response Time (s)',
              color: '#3f51b5',
              curve: 'linear',
              showMark: true,
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

ResultLineChart.propTypes = {
  results: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      answers: PropTypes.arrayOf(
        PropTypes.shape({
          responseTime: PropTypes.number,
        })
      ),
    })
  ),
};
