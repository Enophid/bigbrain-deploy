import PropTypes from 'prop-types';
import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from '@mui/material';

/**
 * Form component for editing question metadata (type, duration, points).
 */
function QuestionMetadataForm({ questionData, onChange }) {
  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={4}>
        <FormControl fullWidth>
          <InputLabel id="question-type-label">Question Type</InputLabel>
          <Select
            labelId="question-type-label"
            id="question-type"
            value={questionData.type}
            label="Question Type"
            onChange={(e) => onChange('type', e.target.value)}
          >
            <MenuItem value="single">Single Choice</MenuItem>
            <MenuItem value="judgement">Judgement (True/False)</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          label="Time Limit (seconds)"
          type="number"
          value={questionData.duration || ''}
          onChange={(e) =>
            onChange('duration', parseInt(e.target.value) || 0)
          }
          fullWidth
          slotProps={{ input: { min: 5, max: 300 } }}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          label="Points"
          type="number"
          value={questionData.points || ''}
          onChange={(e) => onChange('points', parseInt(e.target.value) || 0)}
          fullWidth
          slotProps={{ input: { min: 1, max: 100 } }}
        />
      </Grid>
    </Grid>
  );
}

QuestionMetadataForm.propTypes = {
  questionData: PropTypes.shape({
    type: PropTypes.string.isRequired,
    duration: PropTypes.number,
    points: PropTypes.number,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default QuestionMetadataForm; 