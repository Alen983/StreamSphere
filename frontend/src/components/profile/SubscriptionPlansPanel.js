import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Avatar,
  GlobalStyles,
} from '@mui/material';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import api from '@/lib/api';

export default function SubscriptionPlansPanel({ user }) {
  const router = useRouter();
  const [paymentLoading, setPaymentLoading] = useState(false);
  const isPremium = user?.subscriptionType === 'premium' || user?.subscriptionType === 'Premium';
  const isFree = !isPremium;

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

  const handleUpgradeToPremium = async () => {
    // Check if Razorpay is loaded
    if (!window.Razorpay) {
      alert('Payment gateway is loading. Please wait a moment and try again.');
      return;
    }

    setPaymentLoading(true);

    try {
      const premiumPrice = 499; // ₹499 per month
      const amount = premiumPrice * 100; // Convert to paise

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_1DP5mmOlF5G5ag',
        amount: amount,
        currency: 'INR',
        name: 'StreamSphere',
        description: 'Premium Subscription - Monthly Plan',
        image: '/favicon.ico', // Optional: Add your logo
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phone || '',
        },
        theme: {
          color: '#ffd700',
        },
        handler: async function (response) {
          console.log('Payment successful:', response);
          
          try {
            // Update user subscription to Premium
            if (user?._id) {
              try {
                await api.put(`/api/v1/update/user/${user._id}`, { 
                  subscriptionType: 'premium' 
                });
              } catch (apiError) {
                console.warn('API update failed, updating locally:', apiError);
              }
            }
            
            // Show success message and redirect
            alert('Payment successful! Your subscription has been upgraded to Premium.');
            router.push('/profile');
          } catch (error) {
            console.error('Error updating subscription:', error);
            alert('Payment successful but failed to update subscription. Please contact support.');
          } finally {
            setPaymentLoading(false);
          }
        },
        modal: {
          ondismiss: function() {
            setPaymentLoading(false);
          },
        },
        notes: {
          subscription: 'Premium',
          plan: 'Monthly',
        },
      };

      const razorpay = new window.Razorpay(options);
      
      razorpay.on('payment.failed', function (response) {
        console.error('Payment failed:', response);
        alert(`Payment failed: ${response.error.description || 'Please try again.'}`);
        setPaymentLoading(false);
      });

      // Open Razorpay checkout
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Failed to initiate payment. Please try again.');
      setPaymentLoading(false);
    }
  };

  return (
    <>
      <GlobalStyles
        styles={{
          '@keyframes gradientShift': {
            '0%': {
              backgroundPosition: '0% 50%',
            },
            '50%': {
              backgroundPosition: '100% 50%',
            },
            '100%': {
              backgroundPosition: '0% 50%',
            },
          },
          '@keyframes glowPulse': {
            '0%, 100%': {
              boxShadow: '0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.2)',
            },
            '50%': {
              boxShadow: '0 0 30px rgba(255, 215, 0, 0.5), 0 0 60px rgba(255, 215, 0, 0.3)',
            },
          },
          '@keyframes borderGlow': {
            '0%, 100%': {
              borderColor: 'rgba(255, 255, 255, 0.3)',
            },
            '50%': {
              borderColor: 'rgba(255, 255, 255, 0.8)',
            },
          },
          '@keyframes shine': {
            '0%': {
              backgroundPosition: '-200% center',
            },
            '100%': {
              backgroundPosition: '200% center',
            },
          },
          '@keyframes buttonGlow': {
            '0%, 100%': {
              boxShadow: '0 4px 15px rgba(255, 255, 255, 0.2)',
            },
            '50%': {
              boxShadow: '0 6px 25px rgba(255, 255, 255, 0.4)',
            },
          },
        }}
      />
      <Box
        sx={{
          mb: 4,
          position: 'relative',
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: '#fff',
              mb: 1.5,
              fontSize: { xs: '1.5rem', md: '2rem' },
            }}
          >
            Subscription Plans
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: { xs: '0.875rem', md: '1rem' },
            }}
          >
            Choose and buy a subscription to enjoy unlimited streaming
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
        {/* Free Plan */}
        <Grid item xs={12} sm={11} md={5.8} lg={5.5}>
          <Paper
            component="div"
            tabIndex={0}
            elevation={0}
            sx={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 58, 138, 0.9) 30%, rgba(37, 99, 235, 0.85) 70%, rgba(59, 130, 246, 0.9) 100%)',
              backdropFilter: 'blur(15px) saturate(180%)',
              backgroundSize: '200% 200%',
              animation: 'gradientShift 3s ease infinite',
              boxShadow: '0 8px 32px rgba(30, 58, 138, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              p: { xs: 2.5, md: 3 },
              borderRadius: 3,
              border: '1px solid rgba(96, 165, 250, 0.4)',
              width: '100%',
              height: '100%',
              minHeight: { xs: 'auto', md: '360px' },
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: 'scale(1)',
              overflow: 'hidden',
              justifyContent: 'space-between',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                transition: 'left 0.5s',
              },
              '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: '0 16px 32px rgba(30, 58, 138, 0.6), 0 0 50px rgba(37, 99, 235, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                borderColor: 'rgba(96, 165, 250, 0.8)',
                backdropFilter: 'blur(20px) saturate(200%)',
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 58, 138, 0.95) 30%, rgba(37, 99, 235, 0.9) 70%, rgba(59, 130, 246, 0.95) 100%)',
                '&::before': {
                  left: '100%',
                },
              },
              '&:focus': {
                outline: 'none',
                transform: 'scale(1.02)',
                boxShadow: '0 16px 32px rgba(30, 58, 138, 0.6), 0 0 50px rgba(37, 99, 235, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                borderColor: '#ffd700',
                animation: 'glowPulse 2s ease-in-out infinite',
                backdropFilter: 'blur(20px) saturate(200%)',
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 58, 138, 0.95) 30%, rgba(37, 99, 235, 0.9) 70%, rgba(59, 130, 246, 0.95) 100%)',
                '&::before': {
                  left: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.4), transparent)',
                },
              },
              '&:focus-visible': {
                outline: 'none',
                transform: 'scale(1.02)',
                boxShadow: '0 16px 32px rgba(30, 58, 138, 0.6), 0 0 50px rgba(37, 99, 235, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                borderColor: '#ffd700',
                animation: 'glowPulse 2s ease-in-out infinite',
                backdropFilter: 'blur(20px) saturate(200%)',
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 58, 138, 0.95) 30%, rgba(37, 99, 235, 0.9) 70%, rgba(59, 130, 246, 0.95) 100%)',
                '&::before': {
                  left: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.4), transparent)',
                },
              },
            }}
          >
            {/* Icon */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  mr: 2,
                }}
              >
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    backgroundColor: '#fff',
                  }}
                />
              </Avatar>
            </Box>

            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: '#fff',
                mb: 2,
                fontSize: '1.25rem',
                position: 'relative',
                zIndex: 1,
              }}
            >
              Free Plan
            </Typography>

            <Box sx={{ mb: 3, position: 'relative', zIndex: 1 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: '#fff',
                  fontSize: '2rem',
                  mb: 0.5,
                }}
              >
                ₹0
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(255, 255, 255, 0.9)',
                }}
              >
                Free
              </Typography>
            </Box>

            <Box sx={{ mb: 2, position: 'relative', zIndex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                <CheckCircleIcon sx={{ color: '#fff', mr: 1, fontSize: '1rem', mt: 0.25 }} />
                <Typography
                  variant="body2"
                  sx={{
                    color: '#fff',
                    fontSize: '0.875rem',
                  }}
                >
                  Limited content access
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                <CheckCircleIcon sx={{ color: '#fff', mr: 1, fontSize: '1rem', mt: 0.25 }} />
                <Typography
                  variant="body2"
                  sx={{
                    color: '#fff',
                    fontSize: '0.875rem',
                  }}
                >
                  Ads enabled
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <CheckCircleIcon sx={{ color: '#fff', mr: 1, fontSize: '1rem', mt: 0.25 }} />
                <Typography
                  variant="body2"
                  sx={{
                    color: '#fff',
                    fontSize: '0.875rem',
                  }}
                >
                  No downloads
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mt: 'auto', pt: 2 }}>
              {isFree ? (
                <Typography
                  variant="body2"
                  sx={{
                    color: '#fff',
                    textAlign: 'center',
                    py: 1.5,
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  Current plan
                </Typography>
              ) : (
                <Button
                  variant="contained"
                  fullWidth
                  disabled
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.3) 100%)',
                    backgroundSize: '200% 200%',
                    color: '#fff',
                    py: 1.5,
                    textTransform: 'none',
                    fontWeight: 600,
                    position: 'relative',
                    zIndex: 1,
                    transition: 'all 0.3s ease',
                    '&:disabled': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: '#fff',
                    },
                  }}
                >
                  Upgrade plan
                </Button>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Premium Plan */}
        <Grid item xs={12} sm={11} md={5.8} lg={5.5}>
          <Paper
            component="div"
            tabIndex={0}
            elevation={0}
            sx={{
              background: 'linear-gradient(135deg, rgba(6, 20, 14, 0.95) 0%, rgba(20, 83, 45, 0.9) 30%, rgba(34, 197, 94, 0.85) 70%, rgba(74, 222, 128, 0.9) 100%)',
              backdropFilter: 'blur(15px) saturate(180%)',
              backgroundSize: '200% 200%',
              animation: 'gradientShift 3s ease infinite',
              p: { xs: 2.5, md: 3 },
              borderRadius: 3,
              border: isPremium 
                ? '2px solid #ffd700' 
                : '1px solid rgba(74, 222, 128, 0.4)',
              width: '100%',
              height: '100%',
              minHeight: { xs: 'auto', md: '360px' },
              boxShadow: '0 8px 32px rgba(20, 83, 45, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: 'scale(1)',
              overflow: 'hidden',
              justifyContent: 'space-between',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                transition: 'left 0.5s',
              },
              '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: '0 16px 32px rgba(20, 83, 45, 0.6), 0 0 50px rgba(34, 197, 94, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                borderColor: 'rgba(74, 222, 128, 0.8)',
                backdropFilter: 'blur(20px) saturate(200%)',
                background: 'linear-gradient(135deg, rgba(6, 20, 14, 0.98) 0%, rgba(20, 83, 45, 0.95) 30%, rgba(34, 197, 94, 0.9) 70%, rgba(74, 222, 128, 0.95) 100%)',
                '&::before': {
                  left: '100%',
                },
              },
              '&:focus': {
                outline: 'none',
                transform: 'scale(1.02)',
                boxShadow: '0 16px 32px rgba(20, 83, 45, 0.6), 0 0 50px rgba(34, 197, 94, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                borderColor: '#ffd700',
                animation: 'glowPulse 2s ease-in-out infinite',
                backdropFilter: 'blur(20px) saturate(200%)',
                background: 'linear-gradient(135deg, rgba(6, 20, 14, 0.98) 0%, rgba(20, 83, 45, 0.95) 30%, rgba(34, 197, 94, 0.9) 70%, rgba(74, 222, 128, 0.95) 100%)',
                '&::before': {
                  left: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.4), transparent)',
                },
              },
              '&:focus-visible': {
                outline: 'none',
                transform: 'scale(1.02)',
                boxShadow: '0 16px 32px rgba(20, 83, 45, 0.6), 0 0 50px rgba(34, 197, 94, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                borderColor: '#ffd700',
                animation: 'glowPulse 2s ease-in-out infinite',
                backdropFilter: 'blur(20px) saturate(200%)',
                background: 'linear-gradient(135deg, rgba(6, 20, 14, 0.98) 0%, rgba(20, 83, 45, 0.95) 30%, rgba(34, 197, 94, 0.9) 70%, rgba(74, 222, 128, 0.95) 100%)',
                '&::before': {
                  left: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.4), transparent)',
                },
              },
            }}
          >
            {/* Icon */}
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 1.5,
                position: 'relative',
                zIndex: 1,
              }}
            >
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  mr: 1.5,
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.1) rotate(5deg)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    backgroundColor: '#fff',
                  }}
                />
              </Avatar>
            </Box>

            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: '#fff',
                mb: 1.5,
                fontSize: '1.125rem',
                position: 'relative',
                zIndex: 1,
              }}
            >
              Premium Plan
            </Typography>

            <Box sx={{ mb: 2, position: 'relative', zIndex: 1 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: '#fff',
                  fontSize: '2rem',
                  mb: 0.5,
                }}
              >
                ₹499
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(255, 255, 255, 0.9)',
                }}
              >
                per month
              </Typography>
            </Box>

            <Box sx={{ mb: 2, position: 'relative', zIndex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                <CheckCircleIcon sx={{ color: '#fff', mr: 1, fontSize: '1rem', mt: 0.25 }} />
                <Typography
                  variant="body2"
                  sx={{
                    color: '#fff',
                    fontSize: '0.875rem',
                  }}
                >
                  Full content access
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                <CheckCircleIcon sx={{ color: '#fff', mr: 1, fontSize: '1rem', mt: 0.25 }} />
                <Typography
                  variant="body2"
                  sx={{
                    color: '#fff',
                    fontSize: '0.875rem',
                  }}
                >
                  No ads
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <CheckCircleIcon sx={{ color: '#fff', mr: 1, fontSize: '1rem', mt: 0.25 }} />
                <Typography
                  variant="body2"
                  sx={{
                    color: '#fff',
                    fontSize: '0.875rem',
                  }}
                >
                  HD/4K streaming
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mt: 'auto', pt: 2 }}>
              <Button
                variant="contained"
                fullWidth
                onClick={handleUpgradeToPremium}
                disabled={paymentLoading}
                sx={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.3) 100%)',
                  backgroundSize: '200% 200%',
                  color: '#fff',
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 600,
                  position: 'relative',
                  zIndex: 1,
                  transition: 'all 0.3s ease',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                    transition: 'left 0.5s',
                  },
                  '&:hover': {
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.4) 100%)',
                    backgroundSize: '200% 200%',
                    animation: 'buttonGlow 1.5s ease-in-out infinite',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(255, 255, 255, 0.3)',
                    '&::before': {
                      left: '100%',
                    },
                  },
                  '&:focus': {
                    outline: 'none',
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.4) 100%)',
                    animation: 'buttonGlow 1.5s ease-in-out infinite',
                    boxShadow: '0 6px 20px rgba(255, 255, 255, 0.3)',
                  },
                  '&:active': {
                    transform: 'translateY(0)',
                  },
                  '&:disabled': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: 'rgba(255, 255, 255, 0.5)',
                    animation: 'none',
                  },
                }}
              >
                {paymentLoading ? 'Processing...' : 'Upgrade to Premium'}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      </Box>
    </>
  );
}

