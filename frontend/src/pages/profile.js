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
  Tabs,
  Tab,
  TextField,
  Alert,
} from '@mui/material';
import { Person as PersonIcon, Email as EmailIcon, Phone as PhoneIcon, Payment as PaymentIcon } from '@mui/icons-material';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import Footer from '@/components/Footer';

export default function Profile() {
  const { isAuthenticated, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [paymentData, setPaymentData] = useState({
    amount: '',
    description: '',
    name: '',
    email: '',
    phone: '',
  });
  const [paymentError, setPaymentError] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);

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
        // Pre-fill payment form with user data
        setPaymentData(prev => ({
          ...prev,
          name: response.data.user?.name || '',
          email: response.data.user?.email || '',
          phone: response.data.user?.phone || '',
        }));
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

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setPaymentError('');
  };

  const handlePaymentInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({
      ...prev,
      [name]: value,
    }));
    setPaymentError('');
  };

  const handleRazorpayPayment = async () => {
    // Validate form
    if (!paymentData.amount || parseFloat(paymentData.amount) <= 0) {
      setPaymentError('Please enter a valid amount');
      return;
    }
    if (!paymentData.name || !paymentData.email || !paymentData.phone) {
      setPaymentError('Please fill in all required fields');
      return;
    }

    setPaymentLoading(true);
    setPaymentError('');

    try {
      // Create order on backend (you'll need to create this endpoint)
      // For now, we'll use a mock order creation
      const orderData = {
        amount: parseFloat(paymentData.amount) * 100, // Convert to paise
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
        notes: {
          description: paymentData.description || 'Payment',
          name: paymentData.name,
          email: paymentData.email,
          phone: paymentData.phone,
        },
      };

      // Call your backend API to create order
      // const response = await api.post('/api/v1/payments/create-order', orderData);
      // const { orderId, amount, currency } = response.data;

      // For demo purposes, using mock data
      // In production, replace this with actual API call
      const mockOrderId = `order_${Date.now()}`;
      const amount = orderData.amount;
      const currency = orderData.currency;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_1DP5mmOlF5G5ag', // Replace with your Razorpay key
        amount: amount,
        currency: currency,
        name: 'StreamSphere',
        description: paymentData.description || 'Payment for StreamSphere',
        order_id: mockOrderId, // In production, use actual order_id from backend
        handler: function (response) {
          // Handle successful payment
          console.log('Payment successful:', response);
          alert('Payment successful! Payment ID: ' + response.razorpay_payment_id);
          // You can call your backend to verify payment
          // api.post('/api/v1/payments/verify', { ...response, orderId: mockOrderId });
        },
        prefill: {
          name: paymentData.name,
          email: paymentData.email,
          contact: paymentData.phone,
        },
        theme: {
          color: '#ffd700',
        },
        modal: {
          ondismiss: function() {
            setPaymentLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', function (response) {
        console.error('Payment failed:', response);
        setPaymentError(response.error.description || 'Payment failed. Please try again.');
        setPaymentLoading(false);
      });
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentError(error.response?.data?.message || 'Failed to initiate payment. Please try again.');
      setPaymentLoading(false);
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

            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'rgba(255, 255, 255, 0.1)', mb: 4 }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                sx={{
                  '& .MuiTab-root': {
                    color: 'rgba(255, 255, 255, 0.6)',
                    '&.Mui-selected': {
                      color: '#ffd700',
                    },
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: '#ffd700',
                  },
                }}
              >
                <Tab icon={<PersonIcon />} iconPosition="start" label="Profile" />
                <Tab icon={<PaymentIcon />} iconPosition="start" label="Payments" />
              </Tabs>
            </Box>

            {/* Tab Content */}
            {tabValue === 0 && (
              <>
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
              </>
            )}

            {tabValue === 1 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Typography variant="h6" sx={{ color: '#ffd700', mb: 2 }}>
                  Make a Payment
                </Typography>

                {paymentError && (
                  <Alert severity="error" sx={{ mb: 2, backgroundColor: 'rgba(211, 47, 47, 0.1)', color: '#ff5252' }}>
                    {paymentError}
                  </Alert>
                )}

                <TextField
                  fullWidth
                  label="Amount (₹)"
                  name="amount"
                  type="number"
                  value={paymentData.amount}
                  onChange={handlePaymentInputChange}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: '#fff',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: '#ffd700',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#ffd700',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.6)',
                      '&.Mui-focused': {
                        color: '#ffd700',
                      },
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={paymentData.description}
                  onChange={handlePaymentInputChange}
                  placeholder="e.g., Subscription payment"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: '#fff',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: '#ffd700',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#ffd700',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.6)',
                      '&.Mui-focused': {
                        color: '#ffd700',
                      },
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={paymentData.name}
                  onChange={handlePaymentInputChange}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: '#fff',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: '#ffd700',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#ffd700',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.6)',
                      '&.Mui-focused': {
                        color: '#ffd700',
                      },
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={paymentData.email}
                  onChange={handlePaymentInputChange}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: '#fff',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: '#ffd700',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#ffd700',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.6)',
                      '&.Mui-focused': {
                        color: '#ffd700',
                      },
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  type="tel"
                  value={paymentData.phone}
                  onChange={handlePaymentInputChange}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: '#fff',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: '#ffd700',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#ffd700',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.6)',
                      '&.Mui-focused': {
                        color: '#ffd700',
                      },
                    },
                  }}
                />

                <Button
                  variant="contained"
                  onClick={handleRazorpayPayment}
                  disabled={paymentLoading}
                  fullWidth
                  sx={{
                    mt: 2,
                    py: 1.5,
                    backgroundColor: '#ffd700',
                    color: '#000',
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: '#ffed4e',
                    },
                    '&:disabled': {
                      backgroundColor: 'rgba(255, 215, 0, 0.5)',
                      color: 'rgba(0, 0, 0, 0.5)',
                    },
                  }}
                >
                  {paymentLoading ? 'Processing...' : 'Proceed to Payment'}
                </Button>
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

