import { Box, Typography } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';

export default function ResultBarChart() {
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
        🎉 Question Breakdown 🎉
      </Typography>
      <Box sx={{ height: 400 }}>
        <BarChart
          xAxis={[
            { scaleType: 'band', data: ['group A', 'group B', 'group C'] },
          ]}
          series={[
            { data: [4, 3, 5] },
            { data: [1, 6, 3] },
            { data: [2, 5, 6] },
          ]}
          width={500}
          height={300}
        />
      </Box>
    </Box>
  );
}
