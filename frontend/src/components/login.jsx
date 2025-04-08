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
  Login as LoginIcon,
} from '@mui/icons-material';
import kahootTheme from '../theme/kahootTheme';
import ApiCall from './apiCall';
import LockIcon from '@mui/icons-material/Lock';

export default function Login() {
  const navigate = useNavigate();
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

      // Store token in localStorage
      localStorage.setItem('token', data.token);

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to login. Please try again.');
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

  
}
