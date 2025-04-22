import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
} from '@mui/material';
import {
  Edit as EditIcon,
  FileUpload as FileUploadIcon,
} from '@mui/icons-material';
import PropTypes from 'prop-types';
import GameUploadModal from './GameUploadModal';

const GameInfoTab = ({ game, onEditMetadata, onImportGame }) => {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const handleOpenUploadModal = () => {
    setUploadModalOpen(true);
  };

  const handleCloseUploadModal = () => {
    setUploadModalOpen(false);
  };

  const handleUpload = (gameData) => {
    onImportGame(gameData);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 3, // Spacing between items
      }}
    >
      <Box
        sx={{
          flex: { xs: '0 0 100%', md: '0 0 calc(50% - 12px)' }, // Mimics 'span 12' for xs and 'span 6' for md
        }}
      >
        <Card sx={{ borderRadius: 3, bgcolor: 'rgba(255, 255, 255, 0.9)' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Game Details
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Name
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {game?.name}
              </Typography>
            </Box>

            <Typography variant="subtitle2" color="text.secondary">
              Thumbnail
            </Typography>
            {game?.thumbnail ? (
              <Box
                sx={{
                  borderRadius: 2,
                  overflow: 'hidden',
                  width: '100%',
                  height: 'auto', // Automatically adjusts height based on image dimensions
                  mb: 3,
                }}
              >
                <img
                  src={game.thumbnail}
                  alt={`${game.name} Thumbnail`}
                  style={{
                    width: '100%',
                    height: 'auto', // Adjusts to preserve the image's original aspect ratio
                    objectFit: 'contain', // Ensures the whole image is visible without cropping
                  }}
                />
              </Box>
            ) : (
              <Box
                sx={{
                  borderRadius: 2,
                  bgcolor: 'rgba(0, 0, 0, 0.05)',
                  width: '100%',
                  height: 200,
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  No thumbnail
                </Typography>
              </Box>
            )}

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Number of Questions
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {game?.questions.length}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Total Duration
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {game?.questions?.reduce(
                  (acc, q) => acc + (q.duration / 60 || 0),
                  0
                ) || 0}{' '}
                minutes
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Total Points
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {game?.questions?.reduce(
                  (acc, q) => acc + (q.points || 0),
                  0
                ) || 0}{' '}
                points
              </Typography>
            </Box>

            <Box sx={{ mt: 4 }}>
              <Stack spacing={2}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<EditIcon />}
                  onClick={onEditMetadata}
                  fullWidth
                  sx={{
                    borderRadius: 2,
                    py: 1,
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  Edit Game Details
                </Button>

                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<FileUploadIcon />}
                  onClick={handleOpenUploadModal}
                  fullWidth
                  sx={{
                    borderRadius: 2,
                    py: 1,
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  Import Game from JSON
                </Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Game Upload Modal */}
      <GameUploadModal
        open={uploadModalOpen}
        onClose={handleCloseUploadModal}
        onUpload={handleUpload}
      />
    </Box>
  );
};

export default GameInfoTab;

GameInfoTab.propTypes = {
  game: PropTypes.object.isRequired,
  onEditMetadata: PropTypes.func.isRequired,
  onImportGame: PropTypes.func.isRequired,
};
