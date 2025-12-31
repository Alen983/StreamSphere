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
import { useAuth } from '@/context/AuthContext';

export default function OTPForm({ email, onBack, onOTPVerified, setError, setMessage, error, message }) {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      console.log('Verifying OTP for email:', email);
      const response = await api.post('/api/v1/verify/otp/email', { email, otp });
      console.log('Verify OTP Response:', response.data);

      if (response.data.token) {
        // Store token first
        await login(response.data.token);
        
        // Call callback with verification result
        onOTPVerified({
          email,
          token: response.data.token,
          isNewUser: response.data.isNewUser || false,
        });
      } else {
        setError(response.data.message || 'Login failed. No token received.');
      }
    } catch (error) {
      console.error('OTP Verify Error:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        setError('Cannot connect to server. Please ensure the backend server is running on port 5001.');
      } else {
        setError(error.response?.data?.message || error.message || 'Invalid OTP. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleVerifyOTP}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* OTP Field */}
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
            Enter OTP
          </Typography>
          <TextField
            fullWidth
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            required
            placeholder="000000"
            inputProps={{
              maxLength: 6,
              style: {
                textAlign: 'center',
                fontSize: '1.5rem',
                letterSpacing: '0.5rem',
              },
            }}
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
          <Typography
            variant="caption"
            sx={{
              mt: 1,
              color: '#666',
              display: 'block',
            }}
          >
            OTP sent to <strong>{email}</strong>
          </Typography>
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

        {/* Buttons */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            type="button"
            variant="outlined"
            onClick={() => {
              onBack();
              setOtp('');
              setError('');
              setMessage('');
            }}
            fullWidth
            sx={{
              borderColor: '#d32f2f',
              color: '#d32f2f',
              py: 1.5,
              borderRadius: 0,
              textTransform: 'none',
              fontSize: '1rem',
              '&:hover': {
                borderColor: '#b71c1c',
                backgroundColor: 'rgba(211, 47, 47, 0.04)',
              },
            }}
          >
            Back
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || otp.length !== 6}
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
            {loading ? 'Verifying...' : 'Verify OTP'}
          </Button>
        </Box>
      </Box>
    </form>
  );
}

