import {
  TextField,
  Button,
  Box,
  InputAdornment,
  IconButton,
  Alert,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Person,
  HowToReg,
} from '@mui/icons-material';
import LockIcon from '@mui/icons-material/Lock';
import useRegister from '../hooks/useRegister';

export default function RegisterForm() {
  const {
    formData,
    showPassword,
    showConfirmPassword,
    error,
    isLoading,
    handleChange,
    handleSubmit,
    handleKeyPress,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
  } = useRegister();

  return (
    <>
      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: 2,
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
          }}
        >
          {error}
        </Alert>
      )}

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
          label="Name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          onKeyDown={handleKeyPress}
          variant="outlined"
          size="medium"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Person
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
                  <Email
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
                  <LockIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={togglePasswordVisibility}
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

        <TextField
          fullWidth
          label="Confirm Password"
          name="confirmPassword"
          type={showConfirmPassword ? 'text' : 'password'}
          value={formData.confirmPassword}
          onChange={handleChange}
          onKeyDown={handleKeyPress}
          variant="outlined"
          size="medium"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle confirm password visibility"
                    onClick={toggleConfirmPasswordVisibility}
                    edge="end"
                    size="small"
                  >
                    {showConfirmPassword ? (
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
          startIcon={<HowToReg sx={{ fontSize: { xs: 18, sm: 22 } }} />}
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
          {isLoading ? 'Registering...' : 'Create Account'}
        </Button>
      </Box>
    </>
  );
}
