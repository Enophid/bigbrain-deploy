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
} from '@mui/material';
import bigBrainTheme from '../theme/bigBrainTheme';
import GlobalStyles from '../theme/globalStyles';

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

  return (
    <ThemeProvider theme={bigBrainTheme}>
      <CssBaseline />
      <GlobalStyles />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          flexDirection: 'column',
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
        <Typography
          variant='h1'
          align='center'
          sx={{
            marginBottom: 5,
            color: '#fff',
            fontSize: { xs: '2.7rem', sm: '3.5rem', md: '4rem' }, // Responsive font sizes
          }}
        >
          Game Dashboard
        </Typography>
        <Grid
          container
          spacing={4}
          sx={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {games.map((game, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  position: 'relative',
                  borderRadius: 2,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 4,
                    '& .edit-button': {
                      opacity: 1,
                      visibility: 'visible',
                    },
                  },
                  transition: 'all 0.2s',
                }}
              >
                {/* Placeholder for task 2.2.2 */}
                <Button
                  type='button'
                  variant='contained'
                  color='success'
                  size='small'
                  className='edit-button'
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    p: { xs: 0.75, sm: 1 }, // Responsive padding
                    color: '#fff',
                    fontSize: { xs: '0.75rem', sm: '0.9rem' }, // Responsive font sizes
                    fontWeight: 700,
                    boxShadow: 3,
                    zIndex: 1,
                    opacity: 0,
                    visibility: 'hidden',
                    transition: 'all 0.2s',
                  }}
                >
                  Edit
                </Button>
                <CardMedia
                  component='img'
                  height='140'
                  image={game.thumbnail}
                  alt={`${game.name} Thumbnail`}
                />
                <CardContent>
                  <Typography variant='h5' gutterBottom>
                    <strong>{game.name}</strong>
                  </Typography>
                  <Typography variant='body1'>
                    <strong>Questions:</strong> {game.questions.length}
                  </Typography>
                  <Typography variant='body1'>
                    <strong>Total Duration:</strong>{' '}
                    {game.questions.reduce((acc, q) => acc + q.duration, 0)}{' '}
                    minutes
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ mt: 5, ml: { xs: 25, sm: 50, md: 100 } }}>
          <Button
            type='button'
            variant='contained'
            color='primary'
            size='large'
            sx={{
              p: { xs: 0.75, sm: 1, md: 1.3 }, // Responsive padding
              color: '#fff',
              fontSize: { xs: '1rem', sm: '1.2rem', md: '1.3rem' }, // Responsive font sizes
              fontWeight: 700,
              boxShadow: 3,
              transition: 'all 0.2s',
            }}
            onClick={HandleOpenModal}
          >
            + Create New Game
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default Dashboard;
