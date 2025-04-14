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
  Sensors as LiveIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const GameCard = ({ game, index, onEdit, onDelete, onStart }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isActive = Boolean(game.active);

  return (
    <Grid
      sx={{
        width: {
          xs: '100%',
          sm: '50%',
          md: '33.33%',
          lg: '33.33%',
        },
        p: 1.5,
      }}
    >
      <Fade in timeout={300 + index * 100}>
        <Card
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: isActive
              ? `0 10px 30px ${theme.palette.success.main}40`
              : '0 10px 30px rgba(0,0,0,0.15)',
            transition: 'all 0.3s ease',
            backgroundColor: 'rgba(255,255,255,0.97)',
            border: isActive
              ? `2px solid ${theme.palette.success.main}`
              : 'none',
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: isActive
                ? `0 20px 40px ${theme.palette.success.main}50`
                : '0 20px 40px rgba(0,0,0,0.2)',
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
                filter: isActive ? 'none' : 'none',
              }}
            />
            {isActive && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 16,
                  left: 16,
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: theme.palette.success.main,
                  color: 'white',
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 4,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                }}
              >
                <LiveIcon
                  fontSize="small"
                  sx={{ mr: 0.5, animation: 'pulse 1.5s infinite' }}
                />
                <Typography variant="body2" fontWeight="bold">
                  LIVE
                </Typography>
              </Box>
            )}
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
                  <EditIcon fontSize={isMobile ? 'small' : 'medium'} />
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
                  disabled={isActive}
                >
                  <DeleteIcon fontSize={isMobile ? 'small' : 'medium'} />
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
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
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
                <TimeIcon fontSize="small" color="primary" sx={{ mr: 0.5 }} />
                <Typography variant="body2" color="text.secondary">
                  {game.questions.reduce(
                    (acc, q) => acc + (q.timeLimit / 60 || 0),
                    0
                  )}{' '}
                  minutes
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
              {isActive ? (
                <Chip
                  label="Active Session"
                  size="small"
                  color="success"
                  sx={{
                    fontWeight: 'bold',
                    animation: 'pulse 1.5s infinite',
                    '@keyframes pulse': {
                      '0%': { boxShadow: '0 0 0 0 rgba(76, 175, 80, 0.4)' },
                      '70%': { boxShadow: '0 0 0 10px rgba(76, 175, 80, 0)' },
                      '100%': { boxShadow: '0 0 0 0 rgba(76, 175, 80, 0)' },
                    },
                  }}
                />
              ) : (
                <Chip
                  label="Inactive"
                  size="small"
                  color="default"
                  variant="outlined"
                />
              )}
              <Chip
                label={
                  new Date(game.createAt || '').toLocaleDateString() ||
                  'No date'
                }
                size="small"
                variant="outlined"
              />
            </Box>

            {isActive && (
              <Box sx={{ mt: 1, mb: 1 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontWeight: 'medium' }}
                >
                  Session ID:{' '}
                  <Typography
                    component="span"
                    variant="body2"
                    color="success.main"
                    fontWeight="bold"
                  >
                    {game.active}
                  </Typography>
                </Typography>
              </Box>
            )}
          </CardContent>

          <Divider />
          <Box sx={{ p: 2 }}>
            <Button
              variant="contained"
              color={isActive ? 'success' : 'primary'}
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
              disabled={false}
            >
              {isActive ? 'View Active Session' : 'Start Game'}
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
  onStart: PropTypes.func.isRequired,
};

export default GameCard;
