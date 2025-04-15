import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
} from '@mui/material';

import { FileToDataUrl } from '../../helper/helpers';

const InputSwitcher = ({ onChange }) => {
  const [inputType, setInputType] = useState('url');
  const [url, setUrl] = useState('');
  const [photo, setPhoto] = useState(null);

  const handleInputTypeChange = (event) => {
    setInputType(event.target.value);
    // Reset input values when switching
    setUrl('');
    setPhoto(null);
    onChange(inputType === 'url' ? { url: '' } : { photo: null });
  };

  const handleUrlChange = (event) => {
    setUrl(event.target.value);
    onChange({ url: event.target.value });
  };

  const handlePhotoChange = async (event) => {
    const uploadedPhoto = event.target.files[0];
    setPhoto(uploadedPhoto);
    onChange({ photo: await FileToDataUrl(uploadedPhoto) });
  };

  return (
    <Box sx={{ maxWidth: 400, margin: '0 auto', textAlign: 'center' }}>
      <Typography variant='h6' sx={{ mb: 3 }}>
        Choose Input Type
      </Typography>

      {/* Dropdown to select input type */}
      <Select
        value={inputType}
        onChange={handleInputTypeChange}
        fullWidth
        sx={{ mb: 3 }}
      >
        <MenuItem value='url'>YouTube URL</MenuItem>
        <MenuItem value='photo'>Upload Photo</MenuItem>
      </Select>

      {/* Conditional rendering for input */}
      {inputType === 'url' ? (
        <TextField
          label='YouTube Embedded URL'
          variant='outlined'
          fullWidth
          value={url}
          onChange={handleUrlChange}
          placeholder='Enter YouTube URL'
          sx={{ mb: 2 }}
        />
      ) : (
        <Button variant='contained' component='label' sx={{ mb: 2 }}>
          Upload Photo
          <input
            type='file'
            hidden
            accept='image/*'
            onChange={handlePhotoChange}
          />
        </Button>
      )}

      {/* Display uploaded photo or URL */}
      <Box sx={{ mt: 2 }}>
        {photo && (
          <Typography variant='body2' color='text.secondary'>
            Uploaded: {photo.name}
          </Typography>
        )}
        {url && (
          <Typography variant='body2' color='text.secondary'>
            URL: {url}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default InputSwitcher;
