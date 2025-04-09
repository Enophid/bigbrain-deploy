import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/register';
import Login from './components/login';
import GlobalStyles from './theme/globalStyles';
import { Box } from '@mui/material';
import AuthLayout from './components/AuthLayout';

function App() {
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <GlobalStyles />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          
          {/* Protected routes wrapped with AuthLayout */}
          <Route element={<AuthLayout />}>
            <Route path="/dashboard" element={<h1>Dashboard</h1>} />
            {/* Add other authenticated routes here */}
          </Route>
          
          {/* Redirect to login for any other paths */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </Box>
  );
}

export default App;
