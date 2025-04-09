import { Box, Container, Typography, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import Logout from '../logout';
import bigBrainTheme from '../../theme/bigBrainTheme';
import PropTypes from 'prop-types';

const Header = ({ onCreateGame }) => {
  return (
    <Box
      sx={{
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        py: 2,
        px: { xs: 2, sm: 4 },
        mb: 4,
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography
            variant="h4"
            sx={{
              color: '#fff',
              fontWeight: 700,
              textShadow: '0 2px 4px rgba(0,0,0,0.2)',
              fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' },
            }}
          >
            BigBrain Games
          </Typography>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={onCreateGame}
              sx={{
                borderRadius: 2,
                py: { xs: 1, sm: 1.25 },
                px: { xs: 2, sm: 3 },
                fontSize: { xs: '0.875rem', sm: '1rem' },
                fontWeight: 600,
                boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                textTransform: 'none',
                backgroundColor: bigBrainTheme.palette.primary.main,
                '&:hover': {
                  backgroundColor: bigBrainTheme.palette.primary.dark,
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 15px rgba(0,0,0,0.2)',
                },
                transition: 'all 0.2s',
              }}
            >
              Create New Game
            </Button>
            <Logout />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

Header.propTypes = {
  onCreateGame: PropTypes.func.isRequired
};

export default Header; 