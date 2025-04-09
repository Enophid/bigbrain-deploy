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
import {
  Save as SaveIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import bigBrainTheme from '../../theme/bigBrainTheme';
import FileToDataUrl from '../../helper/helpers';

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

  
};

MetadataModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  game: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired
};

export default MetadataModal; 