/**
 * Custom theme configuration based on Kahoot's vibrant design language
 * Uses Material UI's createTheme for consistent theming across components
 */

import { createTheme } from '@mui/material';

// Create a Kahoot-inspired theme with vibrant colors
const bigBrainTheme = createTheme({
  palette: {
    primary: {
      main: '#46178F', // Kahoot purple
      light: '#7E57C2',
      dark: '#2A0F54',
    },
    secondary: {
      main: '#FF3355', // Kahoot red
      light: '#FF6B80',
      dark: '#C4002B',
    },
    background: {
      default: '#F5F5F9',
      paper: '#FFFFFF',
    },
    success: {
      main: '#26890C', // Kahoot green
    },
    info: {
      main: '#0091EA', // Kahoot blue
    },
    warning: {
      main: '#FF9800', // Kahoot orange
    },
  },
  typography: {
    fontFamily: '"Montserrat", "Roboto", "Arial", sans-serif',
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 700,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '1rem',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '12px 24px',
          borderRadius: 12,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          marginBottom: 16,
        },
      },
    },
  },
});

export default bigBrainTheme;
