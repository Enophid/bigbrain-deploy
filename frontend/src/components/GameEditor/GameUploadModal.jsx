import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  IconButton,
  styled,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import PropTypes from 'prop-types';
import { validateGameImport } from '../../utils/gameImportValidator';

// Styled component for the file input
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

/**
 * Modal component for uploading a game JSON file
 */
const GameUploadModal = ({ open, onClose, onUpload }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [fileContent, setFileContent] = useState(null);

  // Reset state when modal closes
  const handleClose = () => {
    setFile(null);
    setError('');
    setFileContent(null);
    onClose();
  };

  // Handle file selection
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    // Check if a file was selected
    if (!selectedFile) {
      setFile(null);
      setError('');
      setFileContent(null);
      return;
    }

    // Check if it's a JSON file
    if (selectedFile.type !== 'application/json') {
      setFile(null);
      setError('Please select a valid JSON file');
      return;
    }

    // Read and validate the file
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = JSON.parse(e.target.result);
        const validation = validateGameImport(content);

        if (!validation.valid) {
          setError(validation.error);
          setFileContent(null);
        } else {
          setError('');
          setFileContent(content);
        }
      } catch (err) {
        setError('Invalid JSON format: ' + err.message);
        setFileContent(null);
      }
    };

    reader.onerror = () => {
      setError('Failed to read file');
      setFileContent(null);
    };

    reader.readAsText(selectedFile);
    setFile(selectedFile);
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!fileContent) {
      setError('Please select a valid JSON file');
      return;
    }

    // Pass the validated content to the parent component
    onUpload(fileContent);
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
            Upload Game
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Upload a JSON file containing a complete game structure. The file will
          be validated before import.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {fileContent && (
          <Alert severity="success" sx={{ mb: 3 }}>
            File validated successfully. Ready to import game:{' '}
            <strong>{fileContent.name}</strong> with{' '}
            {fileContent.questions.length} questions.
          </Alert>
        )}

        <Box
          sx={{
            border: '2px dashed',
            borderColor: 'primary.main',
            borderRadius: 2,
            p: 3,
            textAlign: 'center',
            backgroundColor: 'rgba(25, 118, 210, 0.04)',
            mb: 2,
          }}
        >
          <Button
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
            sx={{ mb: 2 }}
          >
            Choose JSON File
            <VisuallyHiddenInput
              type="file"
              accept="application/json"
              onChange={handleFileChange}
            />
          </Button>

          <Typography variant="body2" color="text.secondary">
            {file ? `Selected: ${file.name}` : 'No file selected'}
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary">
          The JSON file must include a game name, questions array, and proper
          question structure. Refer to the documentation for the expected
          format.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!fileContent}
          sx={{ ml: 2 }}
        >
          Import Game
        </Button>
      </DialogActions>
    </Dialog>
  );
};

GameUploadModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpload: PropTypes.func.isRequired,
};

export default GameUploadModal;
