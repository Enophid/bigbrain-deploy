import { Navigate, Outlet } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, IconButton, useMediaQuery, useTheme } from '@mui/material';
import Logout from './logout';
import bigBrainTheme from '../theme/bigBrainTheme';
import MenuIcon from '@mui/icons-material/Menu';

/**
 * AuthLayout component that wraps all authenticated routes
 * Includes the header with app title and logout button
 * Redirects to login if no auth token is present
 */
const AuthLayout = () => {
  // Check if user is authenticated
  const token = localStorage.getItem('token');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // If not authenticated, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header with logout button */}
      <AppBar 
        position="static" 
        color="primary"
        elevation={3}
        sx={{
          transition: 'all 0.3s',
        }}
      >
        <Toolbar 
          sx={{ 
            justifyContent: 'space-between',
            minHeight: { xs: '56px', sm: '64px' },
            px: { xs: 1.5, sm: 2, md: 3 },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isMobile && (
              <IconButton 
                color="inherit" 
                edge="start" 
                sx={{ mr: 1 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700,
                fontSize: { xs: '1.1rem', sm: '1.3rem' },
                letterSpacing: '0.5px',
                backgroundImage: 'linear-gradient(45deg, #FFFFFF, #E0E0E0)',
                backgroundSize: '100%',
                backgroundClip: 'text',
                textFillColor: 'transparent',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              BigBrain
            </Typography>
          </Box>
          <Logout />
        </Toolbar>
      </AppBar>
      
      {/* Main content area */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: { xs: 1.5, sm: 2, md: 3 },
          backgroundColor: bigBrainTheme.palette.background.default,
          transition: 'padding 0.3s ease'
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AuthLayout; 