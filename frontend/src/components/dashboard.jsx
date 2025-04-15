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
} from '@mui/material';
import bigBrainTheme from '../theme/bigBrainTheme';
import GlobalStyles from '../theme/globalStyles';

// Component imports
import Header from './dashboard/Header';
import GameCard from './dashboard/GameCard';
import CreateGameModal from './dashboard/CreateGameModal';
import EmptyState from './dashboard/EmptyState';

// Helper function
const generateRandomID = () => Math.floor(Math.random() * 10 ** 8);

function Dashboard() {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [fileName, setFileName] = useState('No file chosen');
  const hasFetched = useRef(false);
  const [newGameDetails, setNewGameDetails] = useState({
    id: 0,
    owner: '',
    questions: [],
    active: 0,
    createAt: '',
    name: '',
    thumbnail: '',
  });

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

  // File upload handler
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
    }
    const dataURL = await FileToDataUrl(file);
    setNewGameDetails((prev) => ({
      ...prev,
      thumbnail: dataURL,
      id: generateRandomID(),
      owner: localStorage.getItem('admin'),
      createAt: new Date(Date.now()),
    }));
  };

  // Form input handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGameDetails((details) => ({
      ...details,
      [name]: value,
    }));
  };

  // Create new game
  const handleAddNewGame = async () => {
    try {
      // Create a new game object with integer ID
      const gameId = generateRandomID();
      const newGame = {
        ...newGameDetails,
        id: gameId, // Make sure this is an integer
        owner: localStorage.getItem('admin'), // Use 'admin' key which stores the email
        questions: [], // Start with empty questions array
        createAt: new Date().toISOString(),
        name: newGameDetails.name || 'Untitled Game', // Ensure name is set
      };

      console.log('New game data:', newGame);

      // Add to local state
      const updatedGames = [...games, newGame];
      setGames(updatedGames);

      console.log('Saving games to backend:', updatedGames);

      // Save to backend - note we're sending all games
      const response = await ApiCall(
        '/admin/games',
        { games: updatedGames },
        'PUT',
      );
      console.log('Backend response:', response);

      if (response.error) {
        throw new Error(response.error);
      }

      // Reset form
      setModalOpen(false);
      setNewGameDetails({
        id: 0,
        owner: '',
        questions: [],
        active: 0,
        createAt: '',
        name: '',
        thumbnail: '',
      });
      setFileName('No file chosen');
    } catch (err) {
      console.error('Failed to save game:', err.message);
      // Revert local state if backend failed
      setGames(games);
    }
  };

  // Game management handlers
  const handleEditGame = (gameId) => {
    navigate(`/game/${gameId}`);
  };

  const handleDeleteGame = async (gameId) => {
    try {
      // Filter out the game to delete
      const updatedGames = games.filter((game) => game.id !== gameId);

      // Update local state
      setGames(updatedGames);

      console.log('Deleting game ID:', gameId);
      console.log('Updated games list:', updatedGames);

      // Save to backend
      const response = await ApiCall(
        '/admin/games',
        { games: updatedGames },
        'PUT',
      );

      if (response.error) {
        throw new Error(response.error);
      }

      console.log('Game deleted successfully');
    } catch (err) {
      console.error('Failed to delete game:', err.message);
    }
  };

  const handleStartGame = async (gameId) => {
    try {
      const response = await ApiCall(
        `/admin/games/${gameId}/start`,
        {},
        'POST',
      );
      if (response.error) {
        throw new Error(response.error);
      }

      setGames((prevGames) =>
        prevGames.map((game) =>
          game.id === gameId ? { ...game, active: true } : game,
        ),
      );

      console.log('Game started successfully, session:', response);
    } catch (err) {
      console.error('Failed to start game:', err.message);
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
        }}
      >
        {/* Header Section */}
        <Header onCreateGame={handleOpenModal} />

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
            <EmptyState onCreateGame={handleOpenModal} />
          ) : (
            <Grid container spacing={3}>
              {games.map((game, index) => (
                <GameCard
                  key={game.id}
                  game={game}
                  index={index}
                  onEdit={handleEditGame}
                  onDelete={handleDeleteGame}
                  onStart={handleStartGame}
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
    </ThemeProvider>
  );
}

export default Dashboard;
