import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Container, CircularProgress, Paper, Typography } from '@mui/material';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import Footer from '@/components/Footer';
import ProfileHeader from '@/components/profile/ProfileHeader';
import PlansPanel from '@/components/profile/PlansPanel';

export default function Plans() {
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

  const handlePlanUpdate = async (updatedData) => {
    try {
      // Update local user state
      setUser({ ...user, ...updatedData });
      // Optionally call API to update user
      // await api.put(`/api/v1/update/user/${user._id}`, updatedData);
    } catch (error) {
      console.error('Error updating plan:', error);
      setError('Failed to update plan');
    }
  };

  if (authLoading || loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000',
        }}
      >
        <CircularProgress sx={{ color: '#ffd700' }} />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Subscription Plans - StreamSphere</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: '#000',
          pt: { xs: 10, md: 12 },
          pb: 8,
          position: 'relative',
          backgroundImage: 'url("/hero_bg.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            zIndex: 0,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <ProfileHeader user={user} />

          {/* Centered Subscription Container */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mb: 4,
            }}
          >
            <Paper
              elevation={0}
              sx={{
                backgroundColor: '#2a2a2a',
                p: { xs: 2, md: 2.5 },
                borderRadius: 2,
                border: 'none',
                maxWidth: { xs: '100%', sm: '700px', md: '800px' },
                width: '100%',
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  color: '#fff',
                  mb: 0.5,
                  fontSize: { xs: '1.25rem', md: '1.5rem' },
                  textAlign: 'center',
                }}
              >
                Subscription Plans
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  mb: 3,
                  fontSize: '0.8rem',
                  textAlign: 'center',
                }}
              >
                Choose and buy a subscription to enjoy unlimited streaming
              </Typography>

              <PlansPanel user={user} onPlanUpdate={handlePlanUpdate} />
            </Paper>
          </Box>
        </Container>
      </Box>
      <Footer />
    </>
  );
}

