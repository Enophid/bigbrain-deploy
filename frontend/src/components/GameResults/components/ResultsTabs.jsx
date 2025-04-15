import PropTypes from 'prop-types';
import { Box, Paper, Tabs, Tab } from '@mui/material';
import {
  BarChart as BarChartIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import bigBrainTheme from '../../../theme/bigBrainTheme';

// Navigation tabs component
const ResultsTabs = ({ value, onChange }) => (
  <Box
    sx={{
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      mb: 4,
    }}
  >
    <Paper
      elevation={3}
      sx={{
        borderRadius: '50px',
        overflow: 'hidden',
        width: { xs: '90%', sm: '70%', md: '50%' },
        maxWidth: '500px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
      }}
    >
      <Tabs
        value={value}
        onChange={onChange}
        variant="fullWidth"
        sx={{
          '& .MuiTabs-indicator': {
            backgroundColor: bigBrainTheme.palette.primary.main,
            height: 3,
          },
        }}
      >
        <Tab
          icon={<PeopleIcon />}
          iconPosition="start"
          label="Leaderboard"
          sx={{
            fontWeight: 600,
            textTransform: 'none',
            fontSize: '1rem',
            py: 1.5,
          }}
        />
        <Tab
          icon={<BarChartIcon />}
          iconPosition="start"
          label="Statistics"
          sx={{
            fontWeight: 600,
            textTransform: 'none',
            fontSize: '1rem',
            py: 1.5,
          }}
        />
      </Tabs>
    </Paper>
  </Box>
);

ResultsTabs.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default ResultsTabs;
