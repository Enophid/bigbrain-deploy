import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Modal,
  Paper,
  Fade,
} from '@mui/material';
import { Save as SaveIcon, Image as ImageIcon } from '@mui/icons-material';
import bigBrainTheme from '../../theme/bigBrainTheme';
import { FileToDataUrl } from '../../helper/helpers';

const MetadataModal = ({ open, onClose, game, onSave }) => {
  // Game metadata state
  const [gameMetadata, setGameMetadata] = useState({
    name: '',
    thumbnail: '',
  });
  const [fileName, setFileName] = useState('No file chosen');

  // Update form when game changes
  useEffect(() => {
    if (game) {
      setGameMetadata({
        name: game.name || '',
        thumbnail: game.thumbnail || '',
      });
    }
  }, [game, open]);

  // Handle thumbnail file change
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      const dataURL = await FileToDataUrl(file);
      setGameMetadata((prev) => ({
        ...prev,
        thumbnail: dataURL,
      }));
    }
  };

  // Handle save
  const handleSaveMetadata = async () => {
    await onSave(gameMetadata);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      aria-labelledby="metadata-modal-title"
      aria-describedby="metadata-modal-description"
      disableRestoreFocus
    >
      <Fade in={open}>
        <Paper
          elevation={24}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '95%', sm: '90%', md: '600px' },
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
              id="metadata-modal-title"
              variant="h5"
              sx={{
                color: 'white',
                fontWeight: 700,
                textAlign: 'center',
                textShadow: '0 2px 4px rgba(0,0,0,0.2)',
              }}
            >
              Edit Game Details
            </Typography>
          </Box>

          <Box sx={{ p: 3 }}>
            <TextField
              label="Game Name"
              value={gameMetadata.name}
              onChange={(e) =>
                setGameMetadata((prev) => ({ ...prev, name: e.target.value }))
              }
              fullWidth
              variant="outlined"
              sx={{ mb: 3 }}
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
                {gameMetadata.thumbnail ? (
                  <img
                    src={gameMetadata.thumbnail}
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
                    onChange={handleFileChange}
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

          <Box
            sx={{ p: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}
          >
            <Button
              variant="outlined"
              onClick={onClose}
              sx={{
                borderRadius: 2,
                px: 3,
                textTransform: 'none',
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={handleSaveMetadata}
              disabled={!gameMetadata.name}
              sx={{
                borderRadius: 2,
                px: 3,
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Save Changes
            </Button>
          </Box>
        </Paper>
      </Fade>
    </Modal>
  );
};

MetadataModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  game: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default MetadataModal;
