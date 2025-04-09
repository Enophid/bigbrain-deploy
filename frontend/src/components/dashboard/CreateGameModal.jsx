import PropTypes from 'prop-types';
import {
  Modal,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Fade,
} from '@mui/material';
import { Add as AddIcon, Image as ImageIcon } from '@mui/icons-material';
import bigBrainTheme from '../../theme/bigBrainTheme';

const CreateGameModal = ({
  open,
  onClose,
  gameDetails,
  fileName,
  onInputChange,
  onFileChange,
  onCreateGame,
}) => {
  return (
    <Modal 
      open={open} 
      onClose={onClose} 
      closeAfterTransition
      aria-labelledby="create-game-modal-title"
    >
      <Fade in={open}>
        <Paper
          elevation={24}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: '500px', md: '600px' },
            maxWidth: '95vw',
            maxHeight: '90vh',
            overflow: 'auto',
            borderRadius: 3,
            boxShadow: '0 24px 48px rgba(0, 0, 0, 0.2)',
            p: 0,
            outline: 'none',
          }}
          tabIndex={-1}
        >
          <Box
            sx={{
              background: `linear-gradient(135deg, ${bigBrainTheme.palette.primary.main} 0%, ${bigBrainTheme.palette.secondary.dark} 100%)`,
              p: 3,
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
            }}
          >
            <Typography
              id="create-game-modal-title"
              variant="h4"
              sx={{
                color: 'white',
                fontWeight: 700,
                textAlign: 'center',
                textShadow: '0 2px 4px rgba(0,0,0,0.2)',
              }}
            >
              Create New Game
            </Typography>
          </Box>

          <Box sx={{ p: 3 }}>
            <TextField
              type="text"
              label="Game Title"
              name="name"
              value={gameDetails.name}
              variant="outlined"
              fullWidth
              required
              onChange={onInputChange}
              sx={{ mb: 3 }}
              placeholder="Enter an engaging title for your game"
            />

            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
              Game Thumbnail
            </Typography>

            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'flex-start', sm: 'center' },
                gap: 2,
                mb: 3,
                p: 2,
                borderRadius: 2,
                border: '1px dashed',
                borderColor: 'divider',
                backgroundColor: 'rgba(0, 0, 0, 0.02)',
              }}
            >
              <Box
                sx={{
                  width: { xs: '100%', sm: '120px' },
                  height: { xs: '120px', sm: '80px' },
                  borderRadius: 1,
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(0, 0, 0, 0.05)',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                {gameDetails.thumbnail ? (
                  <img
                    src={gameDetails.thumbnail}
                    alt="Thumbnail preview"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <ImageIcon sx={{ fontSize: 40, color: 'text.disabled' }} />
                )}
              </Box>

              <Box sx={{ flexGrow: 1 }}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<ImageIcon />}
                  sx={{
                    mb: 1,
                    borderRadius: 2,
                    textTransform: 'none',
                  }}
                >
                  Select Image{' '}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={onFileChange}
                  />
                </Button>
                <Typography variant="body2" color="text.secondary">
                  {fileName}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', mt: 0.5 }}
                >
                  Recommended: 16:9 ratio, PNG or JPG
                </Typography>
              </Box>
            </Box>
          </Box>

          <Divider />

          
        </Paper>
      </Fade>
    </Modal>
  );
};

CreateGameModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  gameDetails: PropTypes.object.isRequired,
  fileName: PropTypes.string.isRequired,
  onInputChange: PropTypes.func.isRequired,
  onFileChange: PropTypes.func.isRequired,
  onCreateGame: PropTypes.func.isRequired
};

export default CreateGameModal; 