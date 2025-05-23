import PropTypes from 'prop-types';
import { Box, Typography, IconButton, Chip, Alert } from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';

// Header component with back button and title
const ResultsHeader = ({ onBack, title = 'Game Results', error = null }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
    }}
  >
    <Box
      sx={{
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        py: 2,
        px: { xs: 2, sm: 4 },
        mb: error ? 0 : 4,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton
          color="inherit"
          onClick={onBack}
          sx={{
            mr: 2,
            color: 'white',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
            },
            transition: 'all 0.2s ease-in-out',
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography
          variant="h4"
          sx={{
            color: '#fff',
            fontWeight: 700,
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.25rem' },
            letterSpacing: '0.5px',
          }}
        >
          {title}
        </Typography>
      </Box>
      <Chip
        icon={<AssessmentIcon />}
        label="Results"
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          color: 'white',
          fontWeight: 'bold',
          backdropFilter: 'blur(5px)',
          '& .MuiChip-icon': {
            color: 'white',
          },
        }}
      />
    </Box>

    {error && (
      <Alert
        severity="error"
        sx={{
          mx: { xs: 2, sm: 4 },
          mt: 0,
          mb: 4,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        }}
      >
        {error}
      </Alert>
    )}
  </Box>
);

ResultsHeader.propTypes = {
  onBack: PropTypes.func.isRequired,
  title: PropTypes.string,
  error: PropTypes.string,
};

export default ResultsHeader;
