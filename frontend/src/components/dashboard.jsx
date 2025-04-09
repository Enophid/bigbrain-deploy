import { useState, useEffect, useRef } from 'react';
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
const GenerateRandomID = () => {
  return Math.floor(Math.random() * Math.pow(10, 8));
};

function Dashboard() {
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
    try {
      const GameToRender = async () => {
        const data = await ApiCall('/admin/games', {}, 'GET');
        if (data.error) {
          throw new Error(data.error);
        }
        setGames(data.games);
        console.log(data.games);
      };

      if (!hasFetched.current) {
        GameToRender();
        hasFetched.current = true;
      }
    } catch (err) {
      console.error(err.message);
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

          
}

export default Dashboard;
