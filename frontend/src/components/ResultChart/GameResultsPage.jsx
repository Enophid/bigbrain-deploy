import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Button,
  ThemeProvider,
  CssBaseline,
  Breadcrumbs,
  Link,
} from '@mui/material';
import { ArrowBack, Home, BarChart } from '@mui/icons-material';
import bigBrainTheme from '../../theme/bigBrainTheme';
import GameResultsCharts from './GameResultsCharts';

/**
 * Page component to display game results charts
 */
const GameResultsPage = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <ThemeProvider theme={bigBrainTheme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ pt: 4, pb: 8 }}>
        {/* Header with navigation */}
        <Box
          sx={{
            mb: 4,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Breadcrumbs aria-label="breadcrumb navigation" sx={{ mb: 1 }}>
              <Link
                component="button"
                underline="hover"
                color="inherit"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
                onClick={() => navigate('/dashboard')}
                aria-label="Go to Dashboard"
              >
                <Home sx={{ mr: 0.5 }} fontSize="small" />
                Dashboard
              </Link>
              <Typography
                color="text.primary"
                sx={{ display: 'flex', alignItems: 'center' }}
                aria-current="page"
              >
                <BarChart sx={{ mr: 0.5 }} fontSize="small" />
                Game Results
              </Typography>
            </Breadcrumbs>
            <Typography variant="h4" component="h1" gutterBottom>
              Game Session Results
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              View performance metrics and statistics for session #{sessionId}
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={handleBackToDashboard}
            sx={{ mt: { xs: 2, sm: 0 } }}
            aria-label="Back to Dashboard"
          >
            Back to Dashboard
          </Button>
        </Box>

        {/* Game Results Charts */}
        <GameResultsCharts sessionId={sessionId} />
      </Container>
    </ThemeProvider>
  );
};

export default GameResultsPage;
