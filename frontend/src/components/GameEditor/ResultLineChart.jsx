import { LineChart } from '@mui/x-charts/LineChart';
import { Box, Typography } from '@mui/material';

export default function BasicLineChart() {
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
      <Typography variant='h4' sx={{ mb: 3 }}>
        🎉 Average response/answer time for each question 🎉
      </Typography>
      <Box sx={{ height: 400 }}>
        <LineChart
          xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
          series={[
            {
              data: [2, 5.5, 2, 8.5, 1.5, 5],
            },
          ]}
          width={500}
          height={300}
        />
      </Box>
    </Box>
  );
}
