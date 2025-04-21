import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiCall from './apiCall';
import { FileToDataUrl } from '../helper/helpers';
import {
  ThemeProvider,
  CssBaseline,
  Box,
  Container,
  Typography,
  Grid,
  Alert,
  Snackbar,
} from '@mui/material';
import bigBrainTheme from '../theme/bigBrainTheme';
import GlobalStyles from '../theme/globalStyles';
import useAlert from '../hooks/useAlert';

// Component imports
import Header from './dashboard/Header';
import GameCard from './dashboard/GameCard';
import CreateGameModal from './dashboard/CreateGameModal';
import EmptyState from './dashboard/EmptyState';
import SessionModal from './dashboard/SessionModal';
import PastSessionsModal from './dashboard/PastSessionsModal';
import GameUploadModal from './dashboard/GameUploadModal';

// Helper function
const generateRandomID = () => Math.floor(Math.random() * 10 ** 8);

function Dashboard() {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [fileName, setFileName] = useState('No file chosen');
  const hasFetched = useRef(false);
  const [sessionModalOpen, setSessionModalOpen] = useState(false);
  const [currentSession, setCurrentSession] = useState({
    id: null,
    gameName: '',
    isNewSession: true,
    gameId: null,
  });
  const [pastSessionsModalOpen, setPastSessionsModalOpen] = useState(false);
  const [currentPastSessions, setCurrentPastSessions] = useState({
    gameId: null,
    gameName: '',
    sessions: [],
  });
  const [newGameDetails, setNewGameDetails] = useState({
    id: 0,
    owner: '',
    questions: [],
    active: null,
    createAt: '',
    name: '',
    thumbnail: '',
  });
  const { alertMessage, showAlert, alertSeverity, displayAlert } = useAlert();

  // Load games on component mount
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const data = await ApiCall('/admin/games', {}, 'GET');
        if (data.error) {
          throw new Error(data.error);
        }
        setGames(data.games);
      } catch (err) {
        console.error('Failed to fetch games:', err.message);
      }
    };

    if (!hasFetched.current) {
      fetchGames();
      hasFetched.current = true;
    }
  }, []);

  // Modal handlers
  const handleCloseModal = () => setModalOpen(false);
  const handleOpenModal = () => setModalOpen(true);
  const handleOpenUploadModal = () => setUploadModalOpen(true);
  const handleCloseUploadModal = () => setUploadModalOpen(false);

  // File handlers
  const handleFileChange = async (event) => {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      setFileName(file.name);
      try {
        const dataUrl = await FileToDataUrl(file);
        setNewGameDetails({
          ...newGameDetails,
          thumbnail: dataUrl,
        });
      } catch (err) {
        console.error('Failed to convert file to data URL:', err);
      }
    }
  };

  // Input handlers
  const handleInputChange = (e) => {
    setNewGameDetails({
      ...newGameDetails,
      [e.target.name]: e.target.value,
    });
    setNewGameDetails({
      ...newGameDetails,
      [e.target.name]: e.target.value,
    });
  };

  // New game handler
  const handleAddNewGame = async () => {
    try {
      // Get the current user's email from localStorage
      const userEmail = localStorage.getItem('admin');

      if (!userEmail) {
        throw new Error('User not authenticated. Please log in again.');
      }

      const gameId = generateRandomID();
      const newGame = {
        ...newGameDetails,
        id: gameId,
        owner: userEmail, // Set the owner to the current user's email
        questions: [],
        active: null,
        createAt: new Date().toISOString(),
      };

      // Update local state

      // Update local state
      const updatedGames = [...games, newGame];

      // Reset form and close modal

      // Reset form and close modal
      setNewGameDetails({
        id: 0,
        owner: '',
        questions: [],
        active: null,
        createAt: '',
        name: '',
        thumbnail: '',
      });
      setFileName('No file chosen');
      setModalOpen(false);

      // Save to backend
      const response = await ApiCall(
        '/admin/games',
        { games: updatedGames },
        'PUT',
      );

      if (response.error) {
        throw new Error(response.error);
      }

      // Re-fetch the games to ensure we have the latest state from the server
      const refreshData = await ApiCall('/admin/games', {}, 'GET');
      if (refreshData.error) {
        throw new Error(refreshData.error);
      }

      setGames(refreshData.games);
      console.log('New game created successfully');
    } catch (err) {
      console.error('Failed to save game:', err.message);
      // Revert local state if backend failed - but still fetch fresh data
      try {
        const refreshData = await ApiCall('/admin/games', {}, 'GET');
        if (!refreshData.error) {
          setGames(refreshData.games);
        }
      } catch (refreshErr) {
        console.error('Failed to refresh game data:', refreshErr.message);
      }
      // Revert local state if backend failed - but still fetch fresh data
      try {
        const refreshData = await ApiCall('/admin/games', {}, 'GET');
        if (!refreshData.error) {
          setGames(refreshData.games);
        }
      } catch (refreshErr) {
        console.error('Failed to refresh game data:', refreshErr.message);
      }
    }
  };

  // Game management handlers
  const handleEditGame = (gameId) => {
    navigate(`/game/${gameId}`);
  };

  const handleDeleteGame = async (gameId) => {
    try {
      // Get the current user's email from localStorage
      const userEmail = localStorage.getItem('admin');

      if (!userEmail) {
        throw new Error('User not authenticated. Please log in again.');
      }

      // Find the game to ensure it exists
      const gameToDelete = games.find((game) => game.id === gameId);

      if (!gameToDelete) {
        throw new Error('Game not found');
      }

      // Check if the game is active
      if (gameToDelete.active) {
        throw new Error(
          'Cannot delete a game with an active session. End the session first.',
        );
      }

      // Filter out the game to delete
      const updatedGames = games.filter((game) => game.id !== gameId);

      // Make sure all games have the owner field set
      const gamesWithOwner = updatedGames.map((game) => ({
        ...game,
        owner: game.owner || userEmail,
      }));

      // Update local state
      setGames(gamesWithOwner);

      setGames(gamesWithOwner);

      console.log('Deleting game ID:', gameId);

      // Save to backend
      const response = await ApiCall(
        '/admin/games',
        { games: gamesWithOwner },
        'PUT',
      );

      if (response.error) {
        throw new Error(response.error);
      }

      console.log('Game deleted successfully');
    } catch (err) {
      console.error('Failed to delete game:', err.message);
      // Show an alert to the user
      alert(`Failed to delete game: ${err.message}`);
      // Show an alert to the user
      alert(`Failed to delete game: ${err.message}`);
    }
  };

  const handleStartGame = async (gameId) => {
    try {
      // Re-fetch the games list first to ensure we have the latest state
      const refreshData = await ApiCall('/admin/games', {}, 'GET');
      if (refreshData.error) {
        throw new Error(refreshData.error);
      }

      // Update games with the latest data
      setGames(refreshData.games);

      // Find the game in the updated list
      const game = refreshData.games.find((g) => g.id === gameId);

      if (!game) {
        throw new Error('Game not found');
      }

      const gameName = game.name || 'Game';

      // If the game is already active, just show the session modal with current session ID
      if (game.active) {
        setCurrentSession({
          id: game.active,
          gameName,
          isNewSession: false,
          gameId: gameId,
        });
        setSessionModalOpen(true);
        return;
      }

      // Otherwise start a new game session
      const response = await ApiCall(
        `/admin/game/${gameId}/mutate`,
        { mutationType: 'START' },
        'POST',
      );

      if (response.error) {
        throw new Error(response.error);
      }

      // Re-fetch games to update the game's active status
      const updatedData = await ApiCall('/admin/games', {}, 'GET');
      if (!updatedData.error) {
        setGames(updatedData.games);
      }

      // Set current session and open modal
      setCurrentSession({
        id: response.data.sessionId,
        gameName,
        isNewSession: true,
        gameId: gameId,
      });
      setSessionModalOpen(true);

      console.log(
        'Game started successfully, session:',
        response.data.sessionId,
      );
    } catch (err) {
      console.error('Failed to start game:', err.message);
      alert(`Failed to start game: ${err.message}`);
    }
  };

  const handleEndSession = async () => {
    try {
      if (!currentSession.gameId) {
        throw new Error('Game ID not found');
      }

      // Call the API to end the game session
      const response = await ApiCall(
        `/admin/game/${currentSession.gameId}/mutate`,
        { mutationType: 'END' },
        'POST',
      );

      if (response.error) {
        throw new Error(response.error);
      }

      // Re-fetch games to update the game's active status
      const updatedData = await ApiCall('/admin/games', {}, 'GET');
      if (!updatedData.error) {
        setGames(updatedData.games);
      }

      return true; // Return success
    } catch (err) {
      displayAlert(`Failed to end game session: ${err.message}`, 'error');
      return false; // Return failure
    }
  };

  const handleCloseSessionModal = async () => {
    setSessionModalOpen(false);
    
    // Refresh games list when modal is closed to ensure we have the latest state
    try {
      const refreshData = await ApiCall('/admin/games', {}, 'GET');
      if (!refreshData.error) {
        setGames(refreshData.games);
      }
    } catch (err) {
      console.error('Failed to refresh games after closing session modal:', err.message);
    }
  };

  // Handle viewing past sessions
  const handleViewPastSessions = (gameId, gameName, pastSessions) => {
    setCurrentPastSessions({
      gameId,
      gameName,
      sessions: pastSessions,
    });
    setPastSessionsModalOpen(true);
  };

  const handleClosePastSessionsModal = () => {
    setPastSessionsModalOpen(false);
  };

  // Add periodic refresh to ensure games data is always up to date
  useEffect(() => {
    // Function to refresh games data
    const refreshGames = async () => {
      try {
        const data = await ApiCall('/admin/games', {}, 'GET');
        if (!data.error) {
          setGames(data.games);
        }
      } catch (error) {
        console.error('Failed to refresh games data:', error);
      }
    };

    // Set up periodic refresh every 10 seconds
    const intervalId = setInterval(refreshGames, 10000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const handleUploadGame = async (gameData) => {
    try {
      // Get the current user's email from localStorage
      const userEmail = localStorage.getItem('admin');
      
      if (!userEmail) {
        throw new Error('User not authenticated. Please log in again.');
      }

      // Process and normalize the game data
      const normalizedQuestions = gameData.questions 
        ? gameData.questions.map((question, index) => ({
            id: Date.now() + index, // Ensure ID is unique
            text: question.text || '',
            type: question.type || 'single',
            timeLimit: question.timeLimit || question.duration || 30,
            points: question.points || 10,
            answers: Array.isArray(question.answers)
              ? question.answers.map((answer, idx) => ({
                  id: Date.now() + index + idx,
                  text: answer.text || '',
                  isCorrect: answer.isCorrect === true,
                }))
              : [],
            imageUrl: question.imageUrl || '',
            videoUrl: question.videoUrl || '',
          }))
        : [];

      // Create a new game object
      const gameId = generateRandomID();
      const newGame = {
        id: gameId,
        name: gameData.name,
        thumbnail: gameData.thumbnail || '',
        owner: userEmail,
        questions: normalizedQuestions,
        active: null,
        oldSessions: [],
        createAt: new Date().toISOString(),
      };

      // Add the new game to the existing games
      const updatedGames = [...games, newGame];

      // Use the PUT endpoint to update all games
      const response = await ApiCall(
        '/admin/games',
        { games: updatedGames },
        'PUT'
      );

      if (response.error) {
        throw new Error(response.error);
      }

      // Refresh the games list
      const refreshData = await ApiCall('/admin/games', {}, 'GET');
      if (!refreshData.error) {
        setGames(refreshData.games);
        // Show success message
        displayAlert('Game imported successfully!', 'success');
      }
    } catch (error) {
      console.error('Failed to import game:', error);
      displayAlert(`Failed to import game: ${error.message}`, 'error');
    }
  };

  return (
    <ThemeProvider theme={bigBrainTheme}>
      <CssBaseline />
      <GlobalStyles />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: bigBrainTheme.palette.background.default,
          backgroundImage:
            'linear-gradient(135deg, #2D3047 0%, #00B4D8 50%, #06D6A0 100%)',
          backgroundSize: '400% 400%',
          animation: 'gradient 15s ease infinite',
          overflow: 'hidden',
          '@keyframes gradient': {
            '0%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' },
            '100%': { backgroundPosition: '0% 50%' },
          },
          '@keyframes pulse': {
            '0%': { boxShadow: '0 0 0 0 rgba(76, 175, 80, 0.4)' },
            '70%': { boxShadow: '0 0 0 10px rgba(76, 175, 80, 0)' },
            '100%': { boxShadow: '0 0 0 0 rgba(76, 175, 80, 0)' },
          },
        }}
      >
        {/* Header Section */}
        <Header onCreateGame={handleOpenModal} onUploadGame={handleOpenUploadModal} />

        <Container
          maxWidth='xl'
          sx={{
            flexGrow: 1,
            mb: 5,
            px: { xs: 2, sm: 3, md: 4 },
            overflowY: 'auto',
          }}
        >
          {/* Dashboard Title */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 4,
            }}
          >
            <Typography
              variant='h3'
              sx={{
                color: '#fff',
                fontWeight: 700,
                textShadow: '0 2px 8px rgba(0,0,0,0.2)',
                fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
              }}
            >
              Your Games
            </Typography>
          </Box>

          {/* Games Display */}
          {games.length === 0 ? (
            <EmptyState onCreateGame={handleOpenModal} onUploadGame={handleOpenUploadModal} />
          ) : (
            <Grid
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr', // 1 column on mobile
                  sm: 'repeat(2, 1fr)', // 2 columns on tablet
                  md: 'repeat(2, 1fr)', // 2 columns on smaller desktops
                  lg: 'repeat(3, 1fr)', // 3 columns on large desktops
                },
                gap: { xs: 2, sm: 3, md: 4 }, // Increasing gap on larger screens
                padding: { xs: 1, sm: 2 }, // Add some padding
                maxWidth: '1400px', // Limit maximum width
                mx: 'auto', // Center the grid
              }}
            >
              {games
                .slice() // Create a shallow copy to avoid mutating the original array
                .sort(
                  (a, b) =>
                    new Date(b.createAt || 0) - new Date(a.createAt || 0),
                ) // Sort by creation date (newest first)
                .map((game, index) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    index={index}
                    onEdit={handleEditGame}
                    onDelete={handleDeleteGame}
                    onStart={handleStartGame}
                    onViewPastSessions={handleViewPastSessions}
                    displayAlert={displayAlert}
                  />
                ))}
            </Grid>
          )}
        </Container>
      </Box>

      {/* Create Game Modal */}
      <CreateGameModal
        open={modalOpen}
        onClose={handleCloseModal}
        gameDetails={newGameDetails}
        fileName={fileName}
        onInputChange={handleInputChange}
        onFileChange={handleFileChange}
        onCreateGame={handleAddNewGame}
      />

      {/* Game Upload Modal */}
      <GameUploadModal
        open={uploadModalOpen}
        onClose={handleCloseUploadModal}
        onUpload={handleUploadGame}
      />

      {/* Session Started Modal */}
      <SessionModal
        open={sessionModalOpen}
        onClose={handleCloseSessionModal}
        sessionId={currentSession.id}
        gameId={currentSession.gameId}
        gameName={currentSession.gameName}
        isNewSession={currentSession.isNewSession}
        onEndSession={handleEndSession}
      />

      <PastSessionsModal
        open={pastSessionsModalOpen}
        onClose={handleClosePastSessionsModal}
        gameId={currentPastSessions.gameId}
        gameName={currentPastSessions.gameName}
        pastSessions={currentPastSessions.sessions}
      />

      <Snackbar
        open={showAlert}
        autoHideDuration={5000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={alertSeverity} variant='filled' sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default Dashboard;
