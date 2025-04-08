import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Container,
  InputAdornment,
  IconButton,
  Alert,
  ThemeProvider,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Person,
  HowToReg,
} from '@mui/icons-material';
import bigBrainTheme from '../theme/bigBrainTheme';
import ApiCall from './apiCall';
import LockIcon from '@mui/icons-material/Lock';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Please enter your name');
      return false;
    }

    if (!formData.email.trim()) {
      setError('Please enter your email');
      return false;
    }

    if (!formData.password.trim()) {
      setError('Please enter your password');
      return false;
    }

    if (!formData.confirmPassword.trim()) {
      setError('Please confirm your password');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Use apiCall utility
      const data = await ApiCall(
        '/admin/auth/register',
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        },
        'POST'
      );

      if (data.error) {
        throw new Error(data.error || 'Registration failed');
      }

      // Store token in localStorage
      localStorage.setItem('token', data.token);

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to register. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Allow form submission with Enter key from any input field
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <ThemeProvider theme={bigBrainTheme}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: bigBrainTheme.palette.background.default,
          backgroundImage: 'linear-gradient(135deg, #2D3047 0%, #00B4D8 50%, #06D6A0 100%)',
          backgroundSize: '400% 400%',
          animation: 'gradient 15s ease infinite',
          py: { xs: 2, sm: 4 },
          px: { xs: 1, sm: 2 },
          overflow: 'auto',
          '@keyframes gradient': {
            '0%': {
              backgroundPosition: '0% 50%',
            },
            '50%': {
              backgroundPosition: '100% 50%',
            },
            '100%': {
              backgroundPosition: '0% 50%',
            },
          },
        }}
      >
        <Container maxWidth="sm" sx={{ width: '100%' }}>
          <Paper
            elevation={8}
            sx={{
              p: { xs: 2, sm: 3, md: 5 },
              borderRadius: { xs: 3, sm: 4 },
              textAlign: 'center',
              background: 'white',
              width: '100%',
              maxWidth: '100%',
              mx: 'auto',
            }}
          >
            <Box sx={{ mb: { xs: 2, sm: 4 } }}>
              <Typography
                variant="h3"
                color="primary"
                gutterBottom
                sx={{
                  fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2.5rem' },
                  mb: { xs: 0.5, sm: 1 },
                  fontWeight: 700,
                }}
              >
                Join BigBrain!
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                }}
              >
                Create an account to start making amazing quizzes
              </Typography>
            </Box>

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
                          onClick={() => setShowPassword(!showPassword)}
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
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
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
            </Box>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
