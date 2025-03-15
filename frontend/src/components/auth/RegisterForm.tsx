'use client'
import { api } from '@/lib/api';
import { LockOutlined } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Link as MuiLink,
  Paper,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
 const [errors, setErrors] = useState({
  username: false as boolean | undefined,
  email: false as boolean | undefined,
  password: false as boolean | undefined,
});

  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password: string) => {
    return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    const newErrors = {
      username: formData.username.trim() === '',
      email: !validateEmail(formData.email),
      password: !validatePassword(formData.password),
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.register(formData);
    
      // Store token
      localStorage.setItem('token', response.accessToken);

      // Store user details
      const userData = {
        userId: response.userId,
        username: response.username,
        email: response.email
      };
      localStorage.setItem('user', JSON.stringify(userData));
      router.push('/dashboard');
    } catch (error) {
      setErrorMessage('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Box sx={{ bgcolor: 'primary.main', p: 2, borderRadius: '50%', mb: 1 }}>
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
                error={errors.username}
                helperText={errors.username ? 'Username is required' : ''}
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
                error={errors.email}
                helperText={errors.email ? "Enter a valid email (e.g., user@example.com)" : ""}
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
                error={errors.password}
                helperText={
                  errors.password
                    ? "Password must be at least 8 characters, contain letters and numbers (e.g., P@ssw0rd1)"
                    : ""
                }
              />

              {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                sx={{ mt: 2, py: 1.5, fontSize: '1rem' }}
              >
                {isLoading ? 'Creating Account...' : 'Register'}
                {isLoading && <CircularProgress size={24} sx={{ color: 'white', ml: 1 }} />}
              </Button>

              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Link href="/login" legacyBehavior>
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
