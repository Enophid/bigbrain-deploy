import { Box } from '@mui/material';
import ResultBarChart from '../../ResultChart/ResultBarChat';
import ResultLineChart from '../../ResultChart/ResultLineChart';
import SectionHeader from './SectionHeader';
import ChartSection from './ChartSection';

// Statistics component
const Statistics = () => (
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

    <Box sx={{ p: 4 }}>
      <ChartSection title="Performance by Question">
        <ResultBarChart />
      </ChartSection>

      <ChartSection title="Score Distribution">
        <ResultLineChart />
      </ChartSection>
    </Box>
  </Box>
);

export default Statistics;
