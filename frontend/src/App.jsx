import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/register';
import Login from './components/Login/index.jsx';
import Dashboard from './components/dashboard';
import GameEditor from './components/GameEditor';
import Play from './components/Play';
import GamePlay from './components/GamePlay';
import GameResults from './components/GameResults/index.jsx';
import PlayerGameResults from './components/PlayerGameResults/index.jsx';
import QuestionEditor from './components/QuestionEditor';
import GlobalStyles from './theme/globalStyles';
import { Box } from '@mui/material';

function App() {
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <GlobalStyles />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/play' element={<Play />} />
          <Route path='/play/:sessionId' element={<Play />} />
          <Route path='/gameplay/:playerId' element={<GamePlay />} />
          <Route path='/player-results/:playerId' element={<PlayerGameResults />} />

          {/* Admin routes */}
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/game/:gameId' element={<GameEditor />} />
          <Route
            path='/game/:gameId/question/:questionId'
            element={<QuestionEditor />}
          />
          <Route path='/session/:sessionId' element={<GameResults />} />
          <Route path='/results/:sessionId' element={<GameResults />} />
          {/* Add other authenticated routes here */}

          {/* Redirect to login for any other paths */}
          <Route path='*' element={<Navigate to='/login' replace />} />
        </Routes>
      </BrowserRouter>
    </Box>
  );
}

export default App;
