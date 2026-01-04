import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Container,
  Typography,
  Paper,
  Avatar,
  CircularProgress,
  Button,
  Divider,
} from '@mui/material';
import { Person as PersonIcon, Email as EmailIcon, Phone as PhoneIcon } from '@mui/icons-material';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import Footer from '@/components/Footer';

export default function Profile() {
  const { isAuthenticated, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/v1/current/user');
        setUser(response.data.user);
      } catch (error) {
        console.error('Error fetching user:', error);
        setError('Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchUser();
    }
  }, [isAuthenticated]);

  if (authLoading || loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Head>
        <title>User Profile - StreamSphere</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: '#000',
          pt: { xs: 4, md: 8 },
          pb: 8,
        }}
      >
        <Container maxWidth="md">
          <Paper
            elevation={3}
            sx={{
              p: { xs: 3, md: 5 },
              backgroundColor: '#1a1a1a',
              color: '#fff',
              borderRadius: 2,
            }}
          >
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 3 }}>
              <Avatar
                sx={{
                  width: { xs: 80, md: 100 },
                  height: { xs: 80, md: 100 },
                  backgroundColor: '#ffd700',
                  color: '#000',
                  fontSize: { xs: '2rem', md: '2.5rem' },
                }}
              >
                {user?.name?.charAt(0)?.toUpperCase() || <PersonIcon />}
              </Avatar>
              <Box>
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{
                    fontWeight: 600,
                    color: '#ffd700',
                    mb: 1,
                  }}
                >
                  {user?.name || 'User'}
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Profile Information
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', mb: 4 }} />

            {/* User Details */}
            {error ? (
              <Typography color="error" sx={{ mb: 2 }}>
                {error}
              </Typography>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Email */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <EmailIcon sx={{ color: '#ffd700', fontSize: 28 }} />
                  <Box>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 0.5 }}>
                      Email
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#fff' }}>
                      {user?.email || 'Not provided'}
                    </Typography>
                  </Box>
                </Box>

                {/* Phone */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <PhoneIcon sx={{ color: '#ffd700', fontSize: 28 }} />
                  <Box>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 0.5 }}>
                      Phone
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#fff' }}>
                      {user?.phone || 'Not provided'}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}

            <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', my: 4 }} />

            {/* Actions */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => router.push('/')}
                sx={{
                  color: '#fff',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  '&:hover': {
                    borderColor: '#ffd700',
                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                  },
                }}
              >
                Back to Home
              </Button>
              <Button
                variant="contained"
                onClick={logout}
                sx={{
                  backgroundColor: '#d32f2f',
                  '&:hover': {
                    backgroundColor: '#b71c1c',
                  },
                }}
              >
                Logout
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
      <Footer />
    </>
  );
}

