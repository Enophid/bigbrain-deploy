import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/register';
import Login from './components/login';
import Dashboard from './components/dashboard';
import GameEditor from './components/GameEditor';
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

          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/game/:gameId' element={<GameEditor />} />
          <Route
            path='/game/:gameId/question/:questionId'
            element={<QuestionEditor />}
          />
          {/* Add other authenticated routes here */}

          {/* Redirect to login for any other paths */}
          <Route path='*' element={<Navigate to='/login' replace />} />
        </Routes>
      </BrowserRouter>
    </Box>
  );
}

export default App;
