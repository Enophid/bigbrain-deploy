import { Box } from '@mui/material';
import PropTypes from 'prop-types';
import MobileResultRow from './MobileResultRow';

/**
 * Component to display mobile results list
 */
const MobileResultsList = ({ results }) => (
  <Box sx={{ display: { xs: 'block', sm: 'none' }, mb: 3 }}>
    {results.map((answer, index) => (
      <MobileResultRow key={index} answer={answer} index={index} />
    ))}
  </Box>
);

MobileResultsList.propTypes = {
  results: PropTypes.array.isRequired,
};

export default MobileResultsList;
