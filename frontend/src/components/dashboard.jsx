import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiCall from './apiCall';
import FileToDataUrl from '../helper/helpers';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Grid,
  ThemeProvider,
  CssBaseline,
  Button,
  Box,
  Modal,
  TextField,
  IconButton,
  Chip,
  Divider,
  Paper,
  Container,
  Fade,
  Tooltip,
  useMediaQuery,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  PlayArrow as PlayArrowIcon,
  DeleteOutline as DeleteIcon,
  Image as ImageIcon,
  QuestionAnswer as QuestionIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import bigBrainTheme from '../theme/bigBrainTheme';
import GlobalStyles from '../theme/globalStyles';
import Logout from './logout';
import { useTheme } from '@mui/material/styles';

const GenerateRandomID = () => {
  return Math.floor(Math.random() * Math.pow(10, 8));
};

function Dashboard() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [games, setGames] = useState([]);
  const [open, setOpen] = useState(false);
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

  const handleClose = () => setOpen(false);
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name); // Set the file name for display
    }
    const dataURL = await FileToDataUrl(file);
    setNewGameDetails((d) => ({
      ...d,
      thumbnail: dataURL,
      id: GenerateRandomID(),
      owner: localStorage.getItem('admin'),
      createAt: new Date(Date.now()),
    }));
  };

  useEffect(() => {
    const GameToRender = async () => {
      const data = await ApiCall('/admin/games', {}, 'GET');
      if (data.error) {
        throw new Error(data.error);
      }
      setGames(data.games);
      console.log(data.games);
    };

    if (!hasFetched.current) {
      GameToRender().catch((err) => {
        console.error(err.message);
      });
      hasFetched.current = true;
    }
  }, []);

  const HandleOpenModal = () => {
    setOpen(true);
  };

  const HandleOnChange = (e) => {
    const { name, value } = e.target;
    setNewGameDetails((details) => ({
      ...details,
      [name]: value,
    }));
  };

  const HandleAddNewGame = () => {
    console.log(newGameDetails);
    setGames((curGames) => [...curGames, newGameDetails]);
    setOpen(false);
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
  };

  // Navigate to edit game
  const handleEditGame = (gameId) => {
    navigate(`/game/${gameId}`);
  };

  // Delete game
  const handleDeleteGame = async (gameId) => {
    try {
      const response = await ApiCall(`/admin/games/${gameId}`, {}, 'DELETE');
      if (response.error) {
        throw new Error(response.error);
      }
      // Remove game from state after successful deletion
      setGames((prevGames) => prevGames.filter((game) => game.id !== gameId));
    } catch (err) {
      console.error('Failed to delete game:', err.message);
      // Could add error handling UI here
    }
  };

  // Start game
  const handleStartGame = async (gameId) => {
    try {
      const response = await ApiCall(
        `/admin/games/${gameId}/start`,
        {},
        'POST'
      );
      if (response.error) {
        throw new Error(response.error);
      }

      // Update the game status in the UI
      setGames((prevGames) =>
        prevGames.map((game) =>
          game.id === gameId ? { ...game, active: true } : game
        )
      );

      // Could redirect to session page or show session ID
      // navigate(`/game/${gameId}/session/${response.sessionId}`);
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
          }}
        >
          <Container maxWidth="xl">
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  color: '#fff',
                  fontWeight: 700,
                  textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' },
                }}
              >
                BigBrain Games
              </Typography>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={HandleOpenModal}
                  sx={{
                    borderRadius: 2,
                    py: { xs: 1, sm: 1.25 },
                    px: { xs: 2, sm: 1 },
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    fontWeight: 600,
                    boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                    textTransform: 'none',
                    backgroundColor: bigBrainTheme.palette.primary.main,
                    '&:hover': {
                      backgroundColor: bigBrainTheme.palette.primary.dark,
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 15px rgba(0,0,0,0.2)',
                    },
                    transition: 'all 0.2s',
                  }}
                >
                  Create New Game
                </Button>
                <Logout />
              </Box>
            </Box>
          </Container>
        </Box>

        <Container
          maxWidth="xl"
          sx={{
            flexGrow: 1,
            mb: 5,
            px: { xs: 2, sm: 3, md: 4 },
            overflowY: 'auto',
          }}
        >
          {/* Dashboard Title and Create Button */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 4,
            }}
          >
            <Typography
              variant="h3"
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

          {/* Game Cards Grid */}
          {games.length === 0 ? (
            <Paper
              elevation={0}
              sx={{
                p: 5,
                textAlign: 'center',
                backgroundColor: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: 4,
              }}
            >
              <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>
                No games found
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: 'rgba(255,255,255,0.7)' }}
              >
                Create your first game to get started!
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={HandleOpenModal}
                sx={{ mt: 3, textTransform: 'none', borderRadius: 2 }}
              >
                Create Game
              </Button>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {games.map((game, index) => (
                <Grid item xs={12} sm={6} md={4} key={game.id}>
                  <Fade in={true} timeout={300 + index * 100}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 3,
                        overflow: 'hidden',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                        transition: 'all 0.3s ease',
                        backgroundColor: 'rgba(255,255,255,0.97)',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                        },
                      }}
                    >
                      <Box sx={{ position: 'relative' }}>
                        <CardMedia
                          component="img"
                          height="180"
                          image={
                            game.thumbnail ||
                            'https://via.placeholder.com/400x200?text=Game+Thumbnail'
                          }
                          alt={`${game.name} Thumbnail`}
                          sx={{
                            objectFit: 'cover',
                          }}
                        />
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background:
                              'linear-gradient(to bottom, rgba(0,0,0,0) 60%, rgba(0,0,0,0.8) 100%)',
                          }}
                        />
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 10,
                            right: 10,
                            display: 'flex',
                            gap: 1,
                          }}
                        >
                          <Tooltip title="Edit Game">
                            <IconButton
                              size={isMobile ? 'small' : 'medium'}
                              color="primary"
                              sx={{
                                backgroundColor: 'rgba(255,255,255,0.9)',
                                '&:hover': {
                                  backgroundColor: 'white',
                                },
                              }}
                              onClick={() => handleEditGame(game.id)}
                            >
                              <EditIcon
                                fontSize={isMobile ? 'small' : 'medium'}
                              />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Game">
                            <IconButton
                              size={isMobile ? 'small' : 'medium'}
                              color="error"
                              sx={{
                                backgroundColor: 'rgba(255,255,255,0.9)',
                                '&:hover': {
                                  backgroundColor: 'white',
                                },
                              }}
                              onClick={() => handleDeleteGame(game.id)}
                            >
                              <DeleteIcon
                                fontSize={isMobile ? 'small' : 'medium'}
                              />
                            </IconButton>
                          </Tooltip>
                        </Box>
                        <Typography
                          variant="h5"
                          sx={{
                            position: 'absolute',
                            bottom: 10,
                            left: 16,
                            color: 'white',
                            fontWeight: 700,
                            textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                          }}
                        >
                          {game.name}
                        </Typography>
                      </Box>

                      <CardContent sx={{ flexGrow: 1, pt: 2 }}>
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', mb: 2 }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <QuestionIcon
                              fontSize="small"
                              color="primary"
                              sx={{ mr: 0.5 }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              {game.questions.length} Questions
                            </Typography>
                          </Box>
                          <Divider
                            orientation="vertical"
                            flexItem
                            sx={{ mx: 1.5, my: 0.5 }}
                          />
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <TimeIcon
                              fontSize="small"
                              color="primary"
                              sx={{ mr: 0.5 }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              {game.questions.reduce(
                                (acc, q) => acc + q.duration,
                                0
                              )}{' '}
                              min
                            </Typography>
                          </Box>
                        </Box>

                        <Box
                          sx={{
                            display: 'flex',
                            gap: 1,
                            flexWrap: 'wrap',
                            mb: 2,
                          }}
                        >
                          <Chip
                            label="Active"
                            size="small"
                            color={game.active ? 'success' : 'default'}
                            variant={game.active ? 'filled' : 'outlined'}
                          />
                          <Chip
                            label={new Date(game.createAt).toLocaleDateString()}
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                      </CardContent>

                      <Divider />
                      <Box sx={{ p: 2 }}>
                        <Button
                          variant="contained"
                          color="primary"
                          fullWidth
                          startIcon={<PlayArrowIcon />}
                          sx={{
                            borderRadius: 2,
                            py: 1,
                            textTransform: 'none',
                            fontWeight: 600,
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                            '&:hover': {
                              boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
                            },
                          }}
                          onClick={() => handleStartGame(game.id)}
                        >
                          Start Game
                        </Button>
                      </Box>
                    </Card>
                  </Fade>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>

      {/* Create Game Modal */}
      <Modal open={open} onClose={handleClose} closeAfterTransition>
        <Fade in={open}>
          <Paper
            elevation={24}
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: '90%', sm: '500px', md: '600px' },
              maxWidth: '95vw',
              maxHeight: '90vh',
              overflow: 'auto',
              borderRadius: 3,
              boxShadow: '0 24px 48px rgba(0, 0, 0, 0.2)',
              p: 0,
            }}
          >
            <Box
              sx={{
                background: `linear-gradient(135deg, ${bigBrainTheme.palette.primary.main} 0%, ${bigBrainTheme.palette.secondary.dark} 100%)`,
                p: 3,
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  color: 'white',
                  fontWeight: 700,
                  textAlign: 'center',
                  textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                }}
              >
                Create New Game
              </Typography>
            </Box>

            <Box sx={{ p: 3 }}>
              <TextField
                type="text"
                label="Game Title"
                name="name"
                value={newGameDetails.name}
                variant="outlined"
                fullWidth
                required
                onChange={HandleOnChange}
                sx={{ mb: 3 }}
                placeholder="Enter an engaging title for your game"
              />

              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
                Game Thumbnail
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: { xs: 'flex-start', sm: 'center' },
                  gap: 2,
                  mb: 3,
                  p: 2,
                  borderRadius: 2,
                  border: '1px dashed',
                  borderColor: 'divider',
                  backgroundColor: 'rgba(0, 0, 0, 0.02)',
                }}
              >
                <Box
                  sx={{
                    width: { xs: '100%', sm: '120px' },
                    height: { xs: '120px', sm: '80px' },
                    borderRadius: 1,
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  {newGameDetails.thumbnail ? (
                    <img
                      src={newGameDetails.thumbnail}
                      alt="Thumbnail preview"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <ImageIcon sx={{ fontSize: 40, color: 'text.disabled' }} />
                  )}
                </Box>

                <Box sx={{ flexGrow: 1 }}>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<ImageIcon />}
                    sx={{
                      mb: 1,
                      borderRadius: 2,
                      textTransform: 'none',
                    }}
                  >
                    Select Image{' '}
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </Button>
                  <Typography variant="body2" color="text.secondary">
                    {fileName}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: 'block', mt: 0.5 }}
                  >
                    Recommended: 16:9 ratio, PNG or JPG
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Divider />

            <Box
              sx={{ p: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}
            >
              <Button
                variant="outlined"
                onClick={handleClose}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  textTransform: 'none',
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={HandleAddNewGame}
                startIcon={<AddIcon />}
                disabled={!newGameDetails.name || !newGameDetails.thumbnail}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Create Game
              </Button>
            </Box>
          </Paper>
        </Fade>
      </Modal>
    </ThemeProvider>
  );
}

export default Dashboard;
