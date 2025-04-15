import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import bigBrainTheme from '../../../theme/bigBrainTheme';

// Main background component
const Background = ({ children }) => (
  <Box
    sx={{
      minHeight: '100vh',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: bigBrainTheme.palette.background.default,
      backgroundImage:
        'linear-gradient(135deg, #2D3047 0%, #00B4D8 50%, #06D6A0 100%)',
      backgroundSize: '400% 400%',
      backgroundAttachment: 'fixed',
      animation: 'gradient 15s ease infinite',
      overflow: 'hidden',
      position: 'fixed',
      width: '100%',
      left: 0,
      top: 0,
      '@keyframes gradient': {
        '0%': { backgroundPosition: '0% 50%' },
        '50%': { backgroundPosition: '100% 50%' },
        '100%': { backgroundPosition: '0% 50%' },
      },
    }}
  >
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
        pb: 6,
      }}
    >
      {children}
    </Box>
  </Box>
);

Background.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Background;
