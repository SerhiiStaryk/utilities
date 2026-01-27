// src/pages/Auth/LoginPage.tsx
import { useState } from 'react';
import { Box, TextField, Button, Typography, CircularProgress, Card } from '@mui/material';
import { useLogin } from '../../hooks/useLogin';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useLogin();

  const handleLogin = () => {
    login(email, password);
  };

  return (
    <Box
      display='flex'
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
      height='100vh'
      bgcolor="background.default"
    >
      <Card sx={{ p: 4, width: '100%', maxWidth: 400 }}>
        <Typography
          variant='h4'
          mb={3}
          textAlign="center"
          fontWeight="bold"
        >
          Welcome Back
        </Typography>
        <Typography variant="body2" color="textSecondary" textAlign="center" mb={4}>
          Sign in to access your dashboard
        </Typography>

        <Box
          display='flex'
          flexDirection='column'
          gap={3}
        >
          <TextField
            label='Email'
            variant='outlined'
            fullWidth
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <TextField
            label='Password'
            type='password'
            variant='outlined'
            fullWidth
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          {error && (
            <Typography
              color='error'
              variant='body2'
            >
              {error}
            </Typography>
          )}
          <Button
            variant='contained'
            color='primary'
            fullWidth
            size="large"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
          </Button>
        </Box>
      </Card>
    </Box>
  );
};
