import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  IconButton,
  ThemeProvider,
  CssBaseline,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';

// Local components
import AlertMessage from './GameEditor/AlertMessage';
import QuestionTab from './GameEditor/QuestionTab';
import GameInfoTab from './GameEditor/GameInfoTab';
import QuestionModal from './GameEditor/QuestionModal';
import MetadataModal from './GameEditor/MetadataModal';

// Hooks
import useGameData from '../hooks/useGameData';
import useAlert from '../hooks/useAlert';

// Theme
import bigBrainTheme from '../theme/bigBrainTheme';
import GlobalStyles from '../theme/globalStyles';

function GameEditor() {
  const { gameId } = useParams();
  const navigate = useNavigate();

  // Custom hooks
  const { game, loading, error, updateGame, fetchGameData } = useGameData(gameId);
  const { alertMessage, showAlert, displayAlert } = useAlert();

  // UI state
  const [tabValue, setTabValue] = useState(0);
  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const [metadataModalOpen, setMetadataModalOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);

  // Navigate back to dashboard
  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  // Tab change handler
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Open question modal to add new question
  const handleAddQuestion = () => {
    setCurrentQuestion(null);
    setQuestionModalOpen(true);
  };

  // Open question modal to edit existing question
  const handleEditQuestion = (question) => {
    setCurrentQuestion(question);
    setQuestionModalOpen(true);
  };

  // Loading state
  if (loading) {
    return (
      <ThemeProvider theme={bigBrainTheme}>
        <CssBaseline />
        <GlobalStyles />
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: bigBrainTheme.palette.background.default,
          }}
        >
          <Typography variant="h5">Loading game...</Typography>
        </Box>
      </ThemeProvider>
    );
  }

  // Error state
  if (error) {
    return (
      <ThemeProvider theme={bigBrainTheme}>
        <CssBaseline />
        <GlobalStyles />
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: bigBrainTheme.palette.background.default,
          }}
        >
          <Typography variant="h5" color="error">
            Error: {error}
          </Typography>
        </Box>
      </ThemeProvider>
    );
  }

  
}

export default GameEditor;
