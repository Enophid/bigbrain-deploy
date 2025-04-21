import {
  TextField,
  Button,
  Box,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Login as LoginIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import PropTypes from 'prop-types';

/**
 * Form component with email and password fields
 */
const LoginForm = ({
  formData,
  handleChange,
  handleSubmit,
  showPassword,
  handleTogglePassword,
  isLoading,
}) => {
  // Allow form submission with Enter key from any input field
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{
        mt: { xs: 1, sm: 2 },
        width: '100%',
      }}
    >
      <TextField
        fullWidth
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        onKeyDown={handleKeyPress}
        variant="outlined"
        size="medium"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon
                  color="primary"
                  sx={{ fontSize: { xs: 18, sm: 24 } }}
                />
              </InputAdornment>
            ),
          },
        }}
        sx={{
          mb: { xs: 2, sm: 3 },
          '& .MuiInputBase-root': {
            fontSize: { xs: '0.875rem', sm: '1rem' },
          },
          '& .MuiInputLabel-root': {
            fontSize: { xs: '0.875rem', sm: '1rem' },
          },
        }}
      />

      <TextField
        fullWidth
        label="Password"
        name="password"
        type={showPassword ? 'text' : 'password'}
        value={formData.password}
        onChange={handleChange}
        onKeyDown={handleKeyPress}
        variant="outlined"
        size="medium"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon
                  color="primary"
                  sx={{ fontSize: { xs: 18, sm: 24 } }}
                />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleTogglePassword}
                  edge="end"
                  size="small"
                >
                  {showPassword ? (
                    <VisibilityOff
                      sx={{ fontSize: { xs: 18, sm: 24 } }}
                    />
                  ) : (
                    <Visibility sx={{ fontSize: { xs: 18, sm: 24 } }} />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        sx={{
          mb: { xs: 2, sm: 3 },
          '& .MuiInputBase-root': {
            fontSize: { xs: '0.875rem', sm: '1rem' },
          },
          '& .MuiInputLabel-root': {
            fontSize: { xs: '0.875rem', sm: '1rem' },
          },
        }}
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        size="large"
        fullWidth
        disabled={isLoading}
        startIcon={<LoginIcon sx={{ fontSize: { xs: 18, sm: 22 } }} />}
        sx={{
          py: { xs: 1, sm: 1.5 },
          mt: { xs: 1, sm: 1 },
          fontSize: { xs: '0.9rem', sm: '1.1rem' },
          fontWeight: 700,
          boxShadow: 3,
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 4,
          },
          transition: 'all 0.2s',
        }}
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </Button>
    </Box>
  );
};

LoginForm.propTypes = {
  formData: PropTypes.shape({
    email: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  showPassword: PropTypes.bool.isRequired,
  handleTogglePassword: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default LoginForm; 