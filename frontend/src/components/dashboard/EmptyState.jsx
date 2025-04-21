import PropTypes from 'prop-types';
import { Paper, Typography, Button, Stack, useMediaQuery } from '@mui/material';
import { Add as AddIcon, FileUpload as FileUploadIcon } from '@mui/icons-material';

const EmptyState = ({ onCreateGame, onUploadGame }) => {
  const isMobile = useMediaQuery('(max-width:480px)');
  
  return (
    <Paper
      sx={{
        py: { xs: 3, sm: 4 },
        px: { xs: 2, sm: 3 },
        textAlign: 'center',
        borderRadius: 4,
        boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        maxWidth: { xs: '100%', sm: '600px' },
        mx: 'auto',
      }}
    >
      <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>
        No games found
      </Typography>
      <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', mb: 4 }}>
        Create your first game to get started or upload a pre-made game!
      </Typography>
      
      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        spacing={{ xs: 2, sm: 2 }} 
        justifyContent="center"
      >
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={onCreateGame}
          fullWidth={isMobile}
          sx={{ 
            textTransform: 'none', 
            borderRadius: 2,
            py: 1.5,
            px: 3,
            fontWeight: 600,
            minWidth: { xs: '100%', sm: '180px' }
          }}
        >
          Create Game
        </Button>
        
        <Button
          variant="outlined"
          color="secondary"
          startIcon={<FileUploadIcon />}
          onClick={onUploadGame}
          fullWidth={isMobile}
          sx={{ 
            textTransform: 'none', 
            borderRadius: 2,
            py: 1.5,
            px: 3,
            fontWeight: 600,
            borderColor: 'rgba(255, 255, 255, 0.3)',
            color: 'white',
            minWidth: { xs: '100%', sm: '180px' },
            '&:hover': {
              borderColor: 'white',
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          Upload JSON
        </Button>
      </Stack>
    </Paper>
  );
};

EmptyState.propTypes = {
  onCreateGame: PropTypes.func.isRequired,
  onUploadGame: PropTypes.func.isRequired,
};

export default EmptyState;
