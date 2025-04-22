import PropTypes from 'prop-types';
import { Box, Typography, IconButton } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

/**
 * Header component for the Question Editor screen.
 */
function QuestionEditorHeader({ title, onBack }) {
  return (
    <Box
      sx={{
        backgroundImage:
          'linear-gradient(135deg, #2D3047 0%, #00B4D8 50%, #06D6A0 100%)',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        py: 2,
        px: { xs: 2, sm: 4 },
        mb: 4,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton
          color="inherit"
          onClick={onBack}
          sx={{ mr: 2, color: 'white' }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography
          variant="h4"
          sx={{
            color: '#fff',
            fontWeight: 700,
            textShadow: '0 2px 4px rgba(0,0,0,0.2)',
            fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.25rem' },
          }}
        >
          {title}
        </Typography>
      </Box>
      {/* Placeholder for potential future actions in the header */}
    </Box>
  );
}

QuestionEditorHeader.propTypes = {
  title: PropTypes.string.isRequired,
  onBack: PropTypes.func.isRequired,
};

export default QuestionEditorHeader; 