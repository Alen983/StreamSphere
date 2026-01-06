import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Container, CircularProgress } from '@mui/material';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import Footer from '@/components/Footer';
import ProfileHeader from '@/components/profile/ProfileHeader';
import SubscriptionPlansPanel from '@/components/profile/SubscriptionPlansPanel';

export default function Subscription() {
  const { isAuthenticated, loading: authLoading } = useAuth();
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

  const handleSubscriptionUpdate = async () => {
    // Refresh user data after subscription update
    try {
      const response = await api.get('/api/v1/current/user');
      setUser(response.data.user);
    } catch (error) {
      console.error('Error refreshing user:', error);
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

          <SubscriptionPlansPanel user={user} />
        </Container>
      </Box>
      <Footer />
    </>
  );
}

