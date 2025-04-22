import PropTypes from 'prop-types';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { processQuestionPerformanceData } from './utils';

/**
 * Component to display game results in a bar chart
 */
const ResultBarChart = ({ results }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
  // Responsive chart dimensions
  const chartHeight = isMobile ? 250 : 400;
  
  // Determine chart width based on screen size
  let chartWidth = 700; // Default for desktop
  if (isMobile) {
    chartWidth = 300;
  } else if (isTablet) {
    chartWidth = 500;
  }
  
  // Get question performance data
  const { questionLabels, correctCount, incorrectCount } = processQuestionPerformanceData(results);
  
  // Create dataset for chart
  const dataset = questionLabels.map((label, index) => ({
    question: label,
    correct: correctCount[index],
    incorrect: incorrectCount[index]
  }));
  
  if (!questionLabels.length) {
    return (
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="body1">Insufficient data for bar chart visualization</Typography>
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        mb: 6, 
        textAlign: 'center',
        p: isMobile ? 1 : 3,
        overflowX: 'auto'
      }}
      aria-describedby="performance-chart-desc"
      tabIndex={0}
    >
      <Typography 
        id="performance-chart-title"
        variant={isMobile ? 'h6' : 'h5'} 
        component="h2" 
        gutterBottom
      >
        Performance by Question
      </Typography>
      <Typography 
        id="performance-chart-desc"
        variant="body2" 
        color="text.secondary" 
        paragraph
      >
        This chart shows the number of correct/incorrect responses for each question
      </Typography>
      
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          minWidth: chartWidth
        }}
      >
        <BarChart
          dataset={dataset}
          xAxis={[{ 
            scaleType: 'band', 
            dataKey: 'question',
            label: 'Questions',
            labelStyle: {
              fontSize: isMobile ? 14 : 16,
            }
          }]}
          series={[
            {
              dataKey: 'correct',
              label: 'Correct',
              color: '#4caf50',
              valueFormatter: (value) => `${value} responses`,
            },
            {
              dataKey: 'incorrect',
              label: 'Incorrect',
              color: '#f44336',
              valueFormatter: (value) => `${value} responses`,
            }
          ]}
          height={chartHeight}
          width={chartWidth}
          margin={{
            top: isMobile ? 30 : 50,
            right: isMobile ? 20 : 30,
            bottom: isMobile ? 50 : 70,
            left: isMobile ? 50 : 70,
          }}
          colors={['#4caf50', '#f44336']}
          slotProps={{
            legend: {
              labelStyle: {
                fontSize: isMobile ? 12 : 14,
              }
            }
          }}
          legend={{ 
            position: { vertical: 'top', horizontal: 'middle' },
            padding: 20,
          }}
          aria-labelledby="performance-chart-title"
        />
      </Box>
    </Box>
  );
};

ResultBarChart.propTypes = {
  results: PropTypes.array.isRequired,
};

export default ResultBarChart;
