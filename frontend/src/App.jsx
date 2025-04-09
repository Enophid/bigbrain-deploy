import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/register';
import Login from './components/login';
import Dashboard from './components/dashboard';
import GlobalStyles from './theme/globalStyles';
import { Box } from '@mui/material';

function App() {
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <GlobalStyles />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/game/:gameId" element={<Dashboard />} /> {/* Placeholder until game editor is created */}
          {/* Add other authenticated routes here */}

          {/* Redirect to login for any other paths */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </Box>
  );
}

export default App;
