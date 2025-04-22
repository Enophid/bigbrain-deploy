import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  Divider,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  FileUpload as FileUploadIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import Logout from '../Logout/index.jsx';
import SessionSearchBar from '../SessionSearchBar';
import PropTypes from 'prop-types';

const Header = ({ onCreateGame, onUploadGame }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const isMobile = useMediaQuery('(max-width:768px)');

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleCreateGame = () => {
    handleCloseMenu();
    onCreateGame();
  };

  const handleUploadGame = () => {
    handleCloseMenu();
    onUploadGame();
  };

  return (
    <Box
      sx={{
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        py: { xs: 1.5, md: 2 },
        px: { xs: 1, sm: 2, md: 4 },
        mb: { xs: 2, md: 4 },
        position: 'sticky',
        top: 0,
        zIndex: 1100,
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
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.5rem' },
              mr: { xs: 1, sm: 2 },
              flexShrink: 0,
            }}
          >
            {'BigBrain'}
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <SessionSearchBar />

            <Tooltip title="Menu">
              <IconButton
                color="inherit"
                onClick={handleOpenMenu}
                sx={{
                  color: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  width: { xs: 36, sm: 40 },
                  height: { xs: 36, sm: 40 },
                }}
              >
                <MenuIcon />
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  minWidth: isMobile ? 180 : 220,
                  borderRadius: 2,
                  boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={handleCreateGame}>
                <ListItemIcon>
                  <AddIcon fontSize="small" color="primary" />
                </ListItemIcon>
                <ListItemText primary="Create New Game" />
              </MenuItem>

              <MenuItem onClick={handleUploadGame}>
                <ListItemIcon>
                  <FileUploadIcon fontSize="small" color="secondary" />
                </ListItemIcon>
                <ListItemText primary="Upload JSON Game" />
              </MenuItem>

              <Divider />

              <Box sx={{ px: 1, py: 0.5 }}>
                <Logout />
              </Box>
            </Menu>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

Header.propTypes = {
  onCreateGame: PropTypes.func.isRequired,
  onUploadGame: PropTypes.func.isRequired,
};

export default Header;
