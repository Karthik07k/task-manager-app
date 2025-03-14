'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Paper,
  Alert,
  Stack,
  Link as MuiLink
} from '@mui/material';
import Link from 'next/link';
import { LockOutlined } from '@mui/icons-material';
import { api } from '@/lib/api';

export default function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    category: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await api.register(formData);
      localStorage.setItem('token', response.token);
      router.push('/dashboard');
    } catch (error) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            borderRadius: 2,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 3,
            }}
          >
            <Box
              sx={{
                bgcolor: 'primary.main',
                p: 2,
                borderRadius: '50%',
                mb: 1,
              }}
            >
              <LockOutlined sx={{ color: 'white' }} />
            </Box>
            <Typography component="h1" variant="h5" fontWeight="bold">
              Create Account
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
                variant="outlined"
              />

              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                variant="outlined"
              />

              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                variant="outlined"
              />

            
            

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                sx={{
                  mt: 2,
                  py: 1.5,
                  fontSize: '1rem',
                }}
              >
                {isLoading ? 'Creating Account...' : 'Register'}
              </Button>

              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Link href="/login" passHref>
                  <MuiLink variant="body2" underline="hover">
                    Already have an account? Sign in
                  </MuiLink>
                </Link>
              </Box>
            </Stack>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}