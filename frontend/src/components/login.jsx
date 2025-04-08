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

