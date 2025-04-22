import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';
import InputSwitcher from '../GameEditor/InputSwitcher'; // Adjust path if needed

/**
 * Component for handling optional media input (YouTube URL or Image upload).
 */
function MediaInputSection({ onMediaChange }) {
  const handleInputChange = (data) => {
    if (data.url) {
      onMediaChange({ videoUrl: data.url, imageUrl: '' });
    } else {
      onMediaChange({ imageUrl: data.photo, videoUrl: '' });
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        URL Youtube Video/ Upload Photo (Optional)
      </Typography>
      <InputSwitcher onChange={handleInputChange} />
    </Box>
  );
}

MediaInputSection.propTypes = {
  onMediaChange: PropTypes.func.isRequired,
};

export default MediaInputSection; 