import PropTypes from 'prop-types';
import { Box, Button, Divider } from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';

/**
 * Component containing the action buttons for the Question Editor (e.g., Save).
 */
function QuestionEditorActions({ onSave, isSaveDisabled }) {
  return (
    <>
      <Divider />
      <Box
        sx={{ p: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}
      >
        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={onSave}
          sx={{
            borderRadius: 2,
            px: 3,
            textTransform: 'none',
            fontWeight: 600,
          }}
          disabled={isSaveDisabled}
        >
          Save Question
        </Button>
      </Box>
    </>
  );
}

QuestionEditorActions.propTypes = {
  onSave: PropTypes.func.isRequired,
  isSaveDisabled: PropTypes.bool.isRequired,
};

export default QuestionEditorActions; 