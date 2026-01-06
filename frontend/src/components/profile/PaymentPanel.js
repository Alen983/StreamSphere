import { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Alert,
  Button,
} from '@mui/material';
import api from '@/lib/api';

export default function PaymentPanel({ user }) {
  const [paymentData, setPaymentData] = useState({
    amount: '',
    description: '',
    name: '',
    email: '',
    phone: '',
  });
  const [paymentError, setPaymentError] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Pre-fill payment form with user data
  useEffect(() => {
    if (user) {
      setPaymentData(prev => ({
        ...prev,
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
      }));
    }
  }, [user]);

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
      // Check if Razorpay script is loaded
      if (!window.Razorpay) {
        setPaymentError('Razorpay script is still loading. Please wait a moment and try again.');
        setPaymentLoading(false);
        return;
      }

      // Call backend API to create order
      const response = await api.post('/api/v1/user/pay', {
        amount: parseFloat(paymentData.amount),
        description: paymentData.description || 'Payment for StreamSphere',
        name: paymentData.name,
        email: paymentData.email,
        phone: paymentData.phone,
      });

      if (!response.data.success || !response.data.orderId) {
        throw new Error(response.data.message || 'Failed to create payment order');
      }

      const orderId = response.data.orderId;
      const amount = parseFloat(paymentData.amount) * 100; // Convert to paise
      const currency = 'INR';

      // Get Razorpay key from environment variable
      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (!razorpayKey) {
        throw new Error('Razorpay key is not configured. Please set NEXT_PUBLIC_RAZORPAY_KEY_ID in your environment variables.');
      }

      const options = {
        key: razorpayKey,
        amount: amount,
        currency: currency,
        name: 'StreamSphere',
        description: paymentData.description || 'Payment for StreamSphere',
        order_id: orderId,
        handler: async function (response) {
          // Handle successful payment
          console.log('Payment successful:', response);
          try {
            // Verify payment on backend
            const verifyResponse = await api.post('/api/v1/user/payment/verify', {
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
            });

            if (verifyResponse.data.success) {
              alert('Payment successful! Your payment has been verified.');
              // Reset form
              setPaymentData({
                amount: '',
                description: '',
                name: paymentData.name,
                email: paymentData.email,
                phone: paymentData.phone,
              });
            } else {
              setPaymentError('Payment verification failed. Please contact support.');
            }
          } catch (verifyError) {
            console.error('Payment verification error:', verifyError);
            setPaymentError(verifyError.response?.data?.error || 'Payment verification failed. Please contact support.');
          }
          setPaymentLoading(false);
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
        setPaymentError(response.error?.description || 'Payment failed. Please try again.');
        setPaymentLoading(false);
      });
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentError(error.response?.data?.error || error.message || 'Failed to initiate payment. Please try again.');
      setPaymentLoading(false);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        backgroundColor: '#2a2a2a',
        p: { xs: 3, md: 4 },
        mb: 4,
        borderRadius: 2,
        border: 'none',
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: 600,
          color: '#ffd700',
          mb: 3,
          fontSize: { xs: '1.25rem', md: '1.5rem' },
        }}
      >
        Add Plans
      </Typography>

      {paymentError && (
        <Alert severity="error" sx={{ mb: 2, backgroundColor: 'rgba(211, 47, 47, 0.1)', color: '#ff5252' }}>
          {paymentError}
        </Alert>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
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
              backgroundColor: '#1a1a1a',
              color: '#fff',
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.2)',
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
              backgroundColor: '#1a1a1a',
              color: '#fff',
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.2)',
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
              backgroundColor: '#1a1a1a',
              color: '#fff',
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.2)',
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
              backgroundColor: '#1a1a1a',
              color: '#fff',
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.2)',
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
              backgroundColor: '#1a1a1a',
              color: '#fff',
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.2)',
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
    </Paper>
  );
}

