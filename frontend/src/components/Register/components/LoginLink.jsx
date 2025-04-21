import { Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import bigBrainTheme from '../../../theme/bigBrainTheme';

export default function LoginLink() {
  return (
    <Box sx={{ mt: { xs: 2, sm: 4 }, textAlign: 'center' }}>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
      >
        Already have an account?{' '}
        <Link
          to="/login"
          style={{
            color: bigBrainTheme.palette.primary.main,
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          Login here
        </Link>
      </Typography>
    </Box>
  );
}
