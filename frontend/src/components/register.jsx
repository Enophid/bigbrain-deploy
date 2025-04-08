import { useEffect, useState } from 'react';
import apiCall from './apiCall';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';

export default function Register() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessages, setErrorMessages] = useState('');
  const [token, setToken] = useState('');
  console.log(name, password, confirmPassword, email);

  useEffect(() => {
    console.log(token);
  }, [token]);

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };
  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword((show) => !show);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  const formValidation = () => {
    let errors = '';
    if (!name.trim()) {
      errors = 'Please enter your name.';
    } else if (!email.trim()) {
      errors = 'Please enter your email.';
    } else if (!password.trim() || !confirmPassword.trim()) {
      errors = 'Please enter your password.';
    } else if (password !== confirmPassword) {
      errors = 'The confirm password does not match your password.';
    }
    setErrorMessages(errors);
    return errors === '';
  };

  const fetchData = async (path, body, method) => {
    try {
      const data = await apiCall(path, body, method); // Call the function
      if (data.error) {
        alert(data.error);
      } else {
        setToken(data.token);
      }
    } catch (error) {
      console.log('Error fetching data:', error);
    }
  };

  const handleRegister = () => {
    if (formValidation()) {
      fetchData('/admin/auth/register', { email, password, name }, 'POST');
    }
  };

  return (
    <>
      <Box sx={{ width: '100%', maxWidth: 500, margin: '7px' }}>
        <Typography variant='h3' gutterBottom>
          Register Here
        </Typography>
      </Box>
      <Box
        component='form'
        sx={{
          '& > :not(style)': { m: 1 },
        }}
        noValidate
        autoComplete='off'
      >
        <FormControl sx={{ m: 1, width: '40ch' }}>
          <InputLabel htmlFor='registerName' required>
            Name
          </InputLabel>
          <OutlinedInput
            type='text'
            id='registerName'
            label='Name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(k) => {
              if (k.key === 'Enter') handleRegister();
            }}
          />
        </FormControl>
        <FormControl sx={{ m: 1, width: '40ch' }}>
          <InputLabel htmlFor='registerEmail' required>
            Email
          </InputLabel>
          <OutlinedInput
            type='email'
            id='registerEmail'
            label='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(k) => {
              if (k.key === 'Enter') handleRegister();
            }}
          />
        </FormControl>
        <FormControl sx={{ m: 1, width: '40ch' }} variant='outlined'>
          <InputLabel htmlFor='registerPassword' required>
            Password
          </InputLabel>
          <OutlinedInput
            id='registerPassword'
            type={showPassword ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position='end'>
                <IconButton
                  aria-label={
                    showPassword ? 'hide the password' : 'display the password'
                  }
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  onMouseUp={handleMouseUpPassword}
                  edge='end'
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(k) => {
              if (k.key === 'Enter') handleRegister();
            }}
          />
        </FormControl>
        <FormControl sx={{ m: 1, width: '40ch' }} variant='outlined'>
          <InputLabel htmlFor='confirmPassword' required>
            Confirm Password
          </InputLabel>
          <OutlinedInput
            id='confirmPassword'
            type={showConfirmPassword ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position='end'>
                <IconButton
                  aria-label={
                    showConfirmPassword
                      ? 'hide the password'
                      : 'display the password'
                  }
                  onClick={handleClickShowConfirmPassword}
                  onMouseDown={handleMouseDownPassword}
                  onMouseUp={handleMouseUpPassword}
                  edge='end'
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label='Confirm Password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyDown={(k) => {
              if (k.key === 'Enter') handleRegister();
            }}
          />
        </FormControl>
      </Box>

      {errorMessages !== '' && (
        <Alert severity='error' sx={{ marginBottom: 1 }}>
          {errorMessages}
        </Alert>
      )}

      <Button
        type='sumbit'
        sx={{ m: '10px' }}
        variant='contained'
        onClick={handleRegister}
      >
        Register Account
      </Button>
    </>
  );
}
