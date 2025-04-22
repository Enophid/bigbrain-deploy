import PropTypes from 'prop-types';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import { processResponseTimeData } from './utils';

/**
 * Component to display average response times in a line chart
 */
const ResultLineChart = ({ results = [] }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Get processed data from utility function
  const { questionLabels, averageResponseTimes } =
    processResponseTimeData(results);

  const chartHeight = isMobile ? 250 : 300;
  const chartWidth = isMobile ? 300 : isTablet ? 400 : 500;

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 800,
        mx: 'auto',
        mt: 4,
        p: { xs: 1, sm: 2 },
        borderRadius: 3,
        bgcolor: 'rgba(255, 255, 255, 0.9)',
        boxShadow: 3,
        textAlign: 'center',
      }}
      aria-describedby="response-time-chart-desc"
      tabIndex={0}
    >
      <Typography
        id="response-time-chart-title"
        variant="h4"
        component="h2"
        sx={{ mb: 3, fontSize: { xs: '1.5rem', sm: '2rem' } }}
      >
        Average Response Time (seconds)
      </Typography>
      <Typography
        id="response-time-chart-desc"
        variant="body2"
        color="text.secondary"
        paragraph
      >
        This chart shows the average time taken to answer each question
      </Typography>
      <Box
        sx={{
          height: { xs: 300, sm: 400 },
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <LineChart
          xAxis={[
            {
              scaleType: 'point',
              data: questionLabels,
              label: 'Questions',
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
          height={chartHeight}
          width={chartWidth}
          legend={{
            position: { vertical: 'top', horizontal: 'middle' },
            padding: 20,
          }}
          margin={{
            top: 40,
            bottom: 40,
            left: isMobile ? 30 : 40,
            right: isMobile ? 30 : 40,
          }}
          aria-labelledby="response-time-chart-title"
        />
      </Box>
    </Box>
  );
};

ResultLineChart.propTypes = {
  results: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      answers: PropTypes.arrayOf(
        PropTypes.shape({
          responseTime: PropTypes.number,
          answeredAt: PropTypes.string,
          questionStartedAt: PropTypes.string,
        })
      ),
    })
  ),
};

export default ResultLineChart;
