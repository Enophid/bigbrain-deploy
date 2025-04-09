import PropTypes from 'prop-types';
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Button,
  IconButton,
  Chip,
  Divider,
  Tooltip,
  Fade,
  useMediaQuery,
} from '@mui/material';
import {
  Edit as EditIcon,
  PlayArrow as PlayArrowIcon,
  DeleteOutline as DeleteIcon,
  QuestionAnswer as QuestionIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const GameCard = ({ game, index, onEdit, onDelete, onStart }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Grid sx={{ 
      width: { 
        xs: '100%', 
        sm: '50%', 
        md: '33.33%', 
        lg: '33.33%' 
      }, 
      p: 1.5 
    }}>
      <Fade in timeout={300 + index * 100}>
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
            {/* Action Buttons */}
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
                  onClick={() => onEdit(game.id)}
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
                  onClick={() => onDelete(game.id)}
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

          {/* Game Info */}
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
                    (acc, q) => acc + (q.duration || 0),
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
              onClick={() => onStart(game.id)}
            >
              Start Game
            </Button>
          </Box>
        </Card>
      </Fade>
    </Grid>
  );
};

GameCard.propTypes = {
  game: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onStart: PropTypes.func.isRequired
};

export default GameCard; 