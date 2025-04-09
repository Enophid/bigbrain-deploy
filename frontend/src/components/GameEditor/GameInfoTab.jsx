import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button,
  Grid 
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import PropTypes from 'prop-types';

const GameInfoTab = ({ game, onEditMetadata }) => {
  return (
    <Grid container spacing={3}>
      <Grid container spacing={3}>
        <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
          <Card sx={{ borderRadius: 3, bgcolor: 'rgba(255, 255, 255, 0.9)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Game Details
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Name
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {game?.name}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Number of Questions
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {game?.questions.length}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Total Duration
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {game?.questions?.reduce(
                    (acc, q) => acc + (q.timeLimit || 0),
                    0
                  ) || 0}{' '}
                  seconds
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Total Points
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {game?.questions?.reduce(
                    (acc, q) => acc + (q.points || 0),
                    0
                  ) || 0}{' '}
                  points
                </Typography>
              </Box>

              <Box sx={{ mt: 4 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<EditIcon />}
                  onClick={onEditMetadata}
                  fullWidth
                  sx={{
                    borderRadius: 2,
                    py: 1,
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  Edit Game Details
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
          <Card sx={{ borderRadius: 3, bgcolor: 'rgba(255, 255, 255, 0.9)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Game Thumbnail
              </Typography>

              {game?.thumbnail ? (
                <Box
                  sx={{
                    borderRadius: 2,
                    overflow: 'hidden',
                    width: '100%',
                    height: 200,
                    mb: 3,
                  }}
                >
                  <img
                    src={game.thumbnail}
                    alt={`${game.name} Thumbnail`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </Box>
              ) : (
                <Box
                  sx={{
                    borderRadius: 2,
                    bgcolor: 'rgba(0, 0, 0, 0.05)',
                    width: '100%',
                    height: 200,
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="body1" color="text.secondary">
                    No thumbnail
                  </Typography>
                </Box>
              )}

              <Button
                variant="contained"
                color="primary"
                startIcon={<EditIcon />}
                onClick={onEditMetadata}
                fullWidth
                sx={{
                  borderRadius: 2,
                  py: 1,
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Change Thumbnail
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default GameInfoTab; 

GameInfoTab.propTypes = {
  game: PropTypes.object.isRequired,
  onEditMetadata: PropTypes.func.isRequired
}; 