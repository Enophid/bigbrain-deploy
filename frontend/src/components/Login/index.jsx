import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Paper, Alert, ThemeProvider } from '@mui/material';
import bigBrainTheme from '../../theme/bigBrainTheme';
import ApiCall from '../apiCall';
import { useAuth } from '../../hooks/useAuth';

// Import subcomponents
import LoginHeader from './components/LoginHeader';
import LoginForm from './components/LoginForm';
import RegisterLink from './components/RegisterLink';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation
    if (!formData.email.trim()) {
      setError('Please enter your email');
      return;
    }

    if (!formData.password.trim()) {
      setError('Please enter your password');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Use apiCall utility
      const data = await ApiCall(
        '/admin/auth/login',
        {
          email: formData.email,
          password: formData.password,
        },
        'POST'
      );

      if (data.error) {
        throw new Error(data.error || 'Login failed');
      }

      // Use auth context to login
      login(data.token, formData.email);

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
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
          backgroundImage:
            'linear-gradient(135deg, #2D3047 0%, #00B4D8 50%, #06D6A0 100%)',
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
            <LoginHeader />

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

            <LoginForm
              formData={formData}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              showPassword={showPassword}
              handleTogglePassword={handleTogglePassword}
              isLoading={isLoading}
            />

            <RegisterLink theme={bigBrainTheme} />
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
