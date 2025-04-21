import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Chip,
  Box,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Timer as TimerIcon,
} from '@mui/icons-material';
import PropTypes from 'prop-types';

/**
 * Component to display results table (desktop and tablet view)
 */
const ResultsTable = ({ results, isTablet }) => (
  <TableContainer
    component={Paper}
    elevation={0}
    sx={{ mb: 3, display: { xs: 'none', sm: 'block' } }}
  >
    <Table size={isTablet ? 'small' : 'medium'}>
      <TableHead>
        <TableRow sx={{ bgcolor: 'rgba(0,0,0,0.04)' }}>
          <TableCell sx={{ fontWeight: 'bold' }}>Question</TableCell>
          <TableCell align="center" sx={{ fontWeight: 'bold' }}>
            Result
          </TableCell>
          <TableCell align="center" sx={{ fontWeight: 'bold' }}>
            Points
          </TableCell>
          <TableCell align="right" sx={{ fontWeight: 'bold' }}>
            Response Time
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {results.map((answer, index) => {
          // Determine if correct based on points
          const isCorrect = answer.points > 0;

          return (
            <TableRow
              key={index}
              sx={{
                '&:nth-of-type(odd)': {
                  bgcolor: 'rgba(0,0,0,0.02)',
                },
                transition: 'background-color 0.2s',
                '&:hover': {
                  bgcolor: 'rgba(0,0,0,0.05)',
                },
              }}
            >
              <TableCell>
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                  Question {answer.position || index + 1}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  noWrap
                  sx={{ maxWidth: isTablet ? 120 : 200 }}
                >
                  {answer.question}
                </Typography>
              </TableCell>
              <TableCell align="center">
                {isCorrect ? (
                  <Chip
                    icon={<CheckCircleIcon />}
                    label="Correct"
                    color="success"
                    size="small"
                    sx={{ fontWeight: 'medium' }}
                  />
                ) : (
                  <Chip
                    icon={<CancelIcon />}
                    label="Incorrect"
                    color="error"
                    size="small"
                    sx={{ fontWeight: 'medium' }}
                  />
                )}
              </TableCell>
              <TableCell align="center">
                {isCorrect ? (
                  <Box>
                    <Typography
                      variant="body1"
                      fontWeight="medium"
                      color="success.main"
                    >
                      {answer.points}
                    </Typography>
                    {answer.speedMultiplier && (
                      <Typography variant="caption" color="text.secondary">
                        {answer.questionPoints} × {answer.speedMultiplier} speed
                      </Typography>
                    )}
                  </Box>
                ) : (
                  <Typography
                    variant="body1"
                    fontWeight="medium"
                    color="text.secondary"
                  >
                    0
                  </Typography>
                )}
              </TableCell>
              <TableCell align="right">
                {answer.responseTime ? (
                  <Chip
                    icon={<TimerIcon fontSize="small" />}
                    label={`${answer.responseTime}s`}
                    size="small"
                    color="secondary"
                    variant="outlined"
                    sx={{ fontWeight: 'medium' }}
                  />
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    N/A
                  </Typography>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  </TableContainer>
);

ResultsTable.propTypes = {
  results: PropTypes.array.isRequired,
  isTablet: PropTypes.bool.isRequired,
};

export default ResultsTable;
