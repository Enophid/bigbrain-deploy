import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  IconButton,
  ThemeProvider,
  CssBaseline,
  Tabs,
  Tab,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

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
  const { game, loading, error, updateGame, fetchGameData } =
    useGameData(gameId);
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
    navigate(`/game/${gameId}/question/${question.id}`);
  };

  // Handle import game from JSON
  const handleImportGame = async (gameData) => {
    try {
      // We'll update the current game with the imported game data
      const updatedGame = {
        ...game,
        name: gameData.name,
        thumbnail: gameData.thumbnail || game.thumbnail,
        questions: gameData.questions || [],
      };

      const success = await updateGame(updatedGame);

      if (success) {
        displayAlert('Game imported successfully!');
        await fetchGameData(); // Refresh game data
      }
    } catch (error) {
      displayAlert(`Failed to import game: ${error.message}`, 'error');
      console.error('Import game error:', error);
    }
  };

  // Create a reusable handler for saving game updates
  const createSaveHandler = (
    updateData,
    closeModalFunction,
    successMessage,
    shouldRefetch = false
  ) => {
    return async (data) => {
      // Prepare update payload based on the type of data
      const updatePayload =
        typeof updateData === 'function' ? updateData(data) : updateData;

      // Update the game with the new data
      const success = await updateGame({
        ...game,
        ...updatePayload,
      });

      // If successful, close modal and show feedback
      if (success) {
        closeModalFunction(false);
        displayAlert(successMessage);

        // Optionally refetch game data
        if (shouldRefetch) {
          await fetchGameData();
        }
      }
    };
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

  return (
    <ThemeProvider theme={bigBrainTheme}>
      <CssBaseline />
      <GlobalStyles />
      <Box
        sx={{
          minHeight: '100vh',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: bigBrainTheme.palette.background.default,
          backgroundImage:
            'linear-gradient(135deg, #2D3047 0%, #00B4D8 50%, #06D6A0 100%)',
          backgroundSize: '400% 400%',
          backgroundAttachment: 'fixed',
          animation: 'gradient 15s ease infinite',
          overflow: 'hidden',
          position: 'fixed',
          width: '100%',
          left: 0,
          top: 0,
          '@keyframes gradient': {
            '0%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' },
            '100%': { backgroundPosition: '0% 50%' },
          },
        }}
      />

      {/* Content Container */}
      <Box
        sx={{
          position: 'relative',
          minHeight: '100vh',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Alert Message */}
        <AlertMessage message={alertMessage} show={showAlert} />

        {/* Header */}
        <Box
          sx={{
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(8px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            py: 2,
            px: { xs: 2, sm: 4 },
            mb: 4,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              onClick={handleBackToDashboard}
              sx={{ mr: 2, color: 'white' }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography
              variant="h4"
              sx={{
                color: '#fff',
                fontWeight: 700,
                textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.25rem' },
              }}
            >
              {game?.name}
            </Typography>
          </Box>
        </Box>

        <Container
          maxWidth="xl"
          sx={{
            flexGrow: 1,
            position: 'relative',
            zIndex: 1,
            mb: 5,
            pb: 5,
            overflowY: 'auto',
          }}
        >
          {/* Tabs */}
          <Box sx={{ mb: 4 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              centered
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 2,
                '.MuiTabs-indicator': {
                  height: 3,
                  borderRadius: 1.5,
                },
              }}
            >
              <Tab
                label="Questions"
                sx={{
                  color: 'white',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1rem',
                  py: 1.5,
                }}
              />
              <Tab
                label="Game Info"
                sx={{
                  color: 'white',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1rem',
                  py: 1.5,
                }}
              />
            </Tabs>
          </Box>

          {/* Questions Tab */}
          {tabValue === 0 && (
            <QuestionTab
              game={game}
              onAddQuestion={handleAddQuestion}
              onEditQuestion={handleEditQuestion}
              onDeleteQuestion={async (questionId) => {
                const success = await updateGame({
                  ...game,
                  questions: game.questions.filter((q) => q.id !== questionId),
                });
                if (success) {
                  displayAlert('Question deleted successfully');
                }
              }}
            />
          )}

          {/* Game Info Tab */}
          {tabValue === 1 && (
            <GameInfoTab
              game={game}
              onEditMetadata={() => setMetadataModalOpen(true)}
              onImportGame={handleImportGame}
            />
          )}
        </Container>

        {/* Question Modal */}
        <QuestionModal
          open={questionModalOpen}
          onClose={() => setQuestionModalOpen(false)}
          currentQuestion={currentQuestion}
          game={game}
          onSave={createSaveHandler(
            (updatedQuestions) => ({ questions: updatedQuestions }),
            setQuestionModalOpen,
            'Question saved successfully'
          )}
          error={error}
          displayAlert={displayAlert}
        />

        {/* Game Metadata Modal */}
        <MetadataModal
          open={metadataModalOpen}
          onClose={() => setMetadataModalOpen(false)}
          game={game}
          onSave={createSaveHandler(
            (gameMetadata) => ({
              name: gameMetadata.name,
              thumbnail: gameMetadata.thumbnail,
            }),
            setMetadataModalOpen,
            'Game details updated successfully',
            true
          )}
        />
      </Box>
    </ThemeProvider>
  );
}

export default GameEditor;
