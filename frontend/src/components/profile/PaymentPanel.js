import { useEffect, useState } from 'react';
import { Box, Paper, Typography, TextField, Alert, Button } from '@mui/material';
 
const inputSX = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#1a1a1a',
    color: '#fff',
    '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
    '&:hover fieldset, &.Mui-focused fieldset': { borderColor: '#ffd700' },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255,255,255,0.6)',
    '&.Mui-focused': { color: '#ffd700' },
  },
};
 
export default function PaymentPanel({ user }) {
  const [data, setData] = useState({
    amount: '',
    description: '',
    name: '',
    email: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
 
  useEffect(() => {
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.async = true;
    document.body.appendChild(s);
    return () => document.body.removeChild(s);
  }, []);
 
  useEffect(() => {
    if (user) setData(d => ({ ...d, name: user.name, email: user.email, phone: user.phone }));
  }, [user]);
 
  const onChange = e => setData({ ...data, [e.target.name]: e.target.value });
 
  const pay = () => {
    if (!data.amount || !data.name || !data.email || !data.phone)
      return setError('All fields are required');
 
    setLoading(true);
    setError('');
 
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: data.amount * 100,
      currency: 'INR',
      name: 'StreamSphere',
      description: data.description || 'Subscription Payment',
      handler: () => {
        alert('Payment Successful');
        setLoading(false);
      },
      prefill: data,
      theme: { color: '#ffd700' },
      modal: { ondismiss: () => setLoading(false) },
    };
 
    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', e => {
      setError(e.error.description);
      setLoading(false);
    });
    rzp.open();
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
    <Paper sx={{ p: 4, backgroundColor: '#2a2a2a', borderRadius: 2 }}>
      <Typography variant="h5" sx={{ color: '#ffd700', mb: 3 }}>
        Add Plans
      </Typography>
 
      {error && <Alert severity="error">{error}</Alert>}
 
      <Box sx={{ display: 'grid', gap: 3 }}>
        {['amount', 'description', 'name', 'email', 'phone'].map(field => (
          <TextField
            key={field}
            name={field}
            label={field.charAt(0).toUpperCase() + field.slice(1)}
            type={field === 'amount' ? 'number' : 'text'}
            value={data[field]}
            onChange={onChange}
            sx={inputSX}
            fullWidth
          />
        ))}
 
        <Button
          fullWidth
          onClick={pay}
          disabled={loading}
          sx={{ py: 1.5, fontWeight: 600, bgcolor: '#ffd700', color: '#000' }}
        >
          {loading ? 'Processing...' : 'Proceed to Payment'}
        </Button>
      </Box>
    </Paper>
  );
}
 

