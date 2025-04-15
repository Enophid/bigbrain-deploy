import PropTypes from 'prop-types';
import { Box, Typography, Paper } from '@mui/material';

// Chart section component
const ChartSection = ({ title, children }) => (
  <Box sx={{ mb: title === 'Performance by Question' ? 6 : 0 }}>
    <Typography
      variant="h6"
      fontWeight={600}
      sx={{ mb: 3, color: 'rgba(0, 0, 0, 0.7)' }}
    >
      {title}
    </Typography>
    <Paper
      elevation={2}
      sx={{
        p: 3,
        borderRadius: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
      }}
    >
      {children}
    </Paper>
  </Box>
);

ChartSection.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default ChartSection;
