import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
        <div>
          <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/dashboard' element={<Dashboard />} />
          </Routes>
        </div>
      </BrowserRouter>
    </Box>
  );
}

export default App;
