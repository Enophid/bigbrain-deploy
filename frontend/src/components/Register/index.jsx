import { ThemeProvider, Box, Container, Paper } from '@mui/material';
import bigBrainTheme from '../../theme/bigBrainTheme';
import RegisterHeader from './components/RegisterHeader';
import RegisterForm from './components/RegisterForm';
import LoginLink from './components/LoginLink';

export default function Register() {
  return (
    <ThemeProvider theme={bigBrainTheme}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
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
        <Container maxWidth="sm" sx={{ width: '100%' }}>
          <Paper
            elevation={8}
            sx={{
              p: { xs: 2, sm: 3, md: 5 },
              borderRadius: { xs: 3, sm: 4 },
              textAlign: 'center',
              background: 'white',
              width: '100%',
              maxWidth: '100%',
              mx: 'auto',
            }}
          >
            <RegisterHeader />
            <RegisterForm />
            <LoginLink />
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
