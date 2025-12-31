import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import api from '@/lib/api';

export default function LoginForm({ onOTPSent, setError, setMessage, error, message }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      console.log('Sending OTP request to:', `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001'}/api/v1/send/otp/email`);
      console.log('Email:', email);

      const response = await api.post('/api/v1/send/otp/email', { email });
      console.log('OTP Response:', response.data);

      if (response.data.message === 'OTP Sent Successfully') {
        setMessage('OTP sent to your email. Please check your inbox.');
        onOTPSent(email);
      } else {
        setError(response.data.message || 'Unexpected response from server');
      }
    } catch (error) {
      console.error('OTP Send Error:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config,
      });

      if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        setError('Cannot connect to server. Please ensure the backend server is running on port 5001.');
      } else if (error.response?.status === 500) {
        setError('Server error. Please check the backend logs.');
      } else {
        setError(error.response?.data?.message || error.message || 'Failed to send OTP. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Email Field */}
        <Box>
          <Typography
            variant="body2"
            sx={{
              mb: 1,
              color: '#333',
              fontWeight: 500,
              fontSize: '0.875rem',
            }}
          >
            Enter your email
          </Typography>
          <TextField
            fullWidth
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#f5f5f5',
                borderRadius: 0,
                '& fieldset': {
                  borderColor: '#e0e0e0',
                },
                '&:hover fieldset': {
                  borderColor: '#bdbdbd',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#d32f2f',
                },
              },
              '& .MuiInputBase-input': {
                py: 1.5,
              },
            }}
          />
        </Box>

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{ borderRadius: 0 }}>
            {error}
          </Alert>
        )}

        {/* Success Message */}
        {message && (
          <Alert severity="success" sx={{ borderRadius: 0 }}>
            {message}
          </Alert>
        )}

        {/* Sign In Button */}
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          fullWidth
          sx={{
            backgroundColor: '#d32f2f',
            color: '#fff',
            py: 1.5,
            borderRadius: 0,
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 500,
            '&:hover': {
              backgroundColor: '#b71c1c',
            },
            '&:disabled': {
              backgroundColor: '#d32f2f',
              opacity: 0.6,
            },
          }}
          startIcon={
            loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  border: '2px solid #fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ArrowForwardIcon sx={{ fontSize: 16 }} />
              </Box>
            )
          }
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </Button>

        {/* Register Link */}
        <Typography
          variant="body2"
          sx={{
            textAlign: 'center',
            color: '#666',
            mt: 1,
          }}
        >
          Don't have an account?{' '}
          <Typography
            component="span"
            sx={{
              color: '#d32f2f',
              cursor: 'pointer',
              fontWeight: 500,
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
            onClick={() => {
              // You can add registration logic here
              console.log('Register clicked');
            }}
          >
            Register
          </Typography>
        </Typography>
      </Box>
    </form>
  );
}

