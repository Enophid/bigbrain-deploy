/**
 * Custom theme configuration for BigBrain
 * A modern, innovative color scheme that promotes learning and engagement
 */

import { createTheme } from '@mui/material';

// Create a theme with vibrant colors
const bigBrainTheme = createTheme({
  palette: {
    primary: {
      main: '#2D3047', // Deep Space Blue - sophisticated and focused
      light: '#4F5D75',
      dark: '#1B1C2C',
    },
    secondary: {
      main: '#00B4D8', // Electric Azure - energetic and innovative
      light: '#90E0EF',
      dark: '#0077B6',
    },
    background: {
      default: '#F8F9FA',
      paper: '#FFFFFF',
    },
    success: {
      main: '#06D6A0', // Neo Mint - fresh and encouraging
      light: '#48F2C8',
      dark: '#058C67',
    },
    error: {
      main: '#FF6B6B', // Coral Passion - warm and attention-grabbing
      light: '#FF9E9E',
      dark: '#CC4545',
    },
    warning: {
      main: '#FFB84C', // Golden Mind - warm and inviting
      light: '#FFD07F',
      dark: '#CC8F26',
    },
    info: {
      main: '#7F5AF0', // Cosmic Purple - creative and inspiring
      light: '#A389F4',
      dark: '#5B3DBD',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Inter", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      letterSpacing: '-0.5px',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.25px',
    },
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '1rem',
      letterSpacing: '0.5px',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.75,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '12px 28px',
          borderRadius: 16,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          },
        },
        contained: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          marginBottom: 20,
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
          },
        },
      },
    },
  },
});

export default bigBrainTheme;
