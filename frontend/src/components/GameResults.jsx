import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Alert,
  Divider,
  Grid,
  IconButton,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  EmojiEvents as TrophyIcon,
  PersonOutline as PersonIcon,
  CheckCircle as CorrectIcon,
  Cancel as IncorrectIcon,
  Timer as TimerIcon,
} from '@mui/icons-material';
import ApiCall from './apiCall';
import { useTheme } from '@mui/material/styles';

const gameResult = () => {
  return (
    <div>GameResult</div>
  )
}

export default gameResult;
