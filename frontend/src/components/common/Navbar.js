import { AppBar, Toolbar, Box, IconButton, Avatar, Typography, Menu, MenuItem } from '@mui/material';
import MovieIcon from '@mui/icons-material/Movie';
import PersonIcon from '@mui/icons-material/Person';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Button from '@/components/common/Button';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    const fetchUser = async () => {
      if (isAuthenticated) {
        try {
          const response = await api.get('/api/v1/current/user');
          setUser(response.data.user);
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      }
    };
    fetchUser();
  }, [isAuthenticated]);

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    router.push('/profile');
    handleClose();
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };
  return (
    <AppBar 
      position="fixed"
      color="#000000"
      sx={{  
        //backgroundColor: 'rgba(0, 0, 0, 0)', // Semi-transparent black
        background: "rgba(0, 0, 0, 0)",
        backdropFilter: 'blur(0px)', // Blur effect
        boxShadow: 'none',
        //borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
        
        {/* Logo Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <MovieIcon sx={{ fontSize: 32, color: '#fff' }} />
          <Box
            component="span"
            sx={{
              fontSize: '24px',
              fontWeight: 400,
              color: '#fff',
              fontFamily: 'serif'
            }}
          >
            StreamSphere
          </Box>
        </Box>

        {/* Navigation Links */}
        <Box sx={{ display: 'flex', gap: 4 }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Box
              component="span"
              sx={{
                color: '#fff',
                fontSize: '16px',
                cursor: 'pointer',
                '&:hover': { color: '#ffd700' }
              }}
            >
              Home
            </Box>
          </Link>
          
          <Link href="/movies" style={{ textDecoration: 'none' }}>
            <Box
              component="span"
              sx={{
                color: '#fff',
                fontSize: '16px',
                cursor: 'pointer',
                '&:hover': { color: '#ffd700' }
              }}
            >
              Movies
            </Box>
          </Link>
          
          <Link href="/series" style={{ textDecoration: 'none' }}>
            <Box
              component="span"
              sx={{
                color: '#fff',
                fontSize: '16px',
                cursor: 'pointer',
                '&:hover': { color: '#ffd700' }
              }}
            >
              Series
            </Box>
          </Link>
          
          <Link href="/about" style={{ textDecoration: 'none' }}>
            <Box
              component="span"
              sx={{
                color: '#fff',
                fontSize: '16px',
                cursor: 'pointer',
                '&:hover': { color: '#ffd700' }
              }}
            >
              About
            </Box>
          </Link>
        </Box>

        {/* CTA Button or User Profile */}
        {isAuthenticated ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }} onClick={handleProfileClick}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                backgroundColor: '#ffd700',
                color: '#000',
                fontSize: '0.875rem',
              }}
            >
              {user?.name?.charAt(0)?.toUpperCase() || <PersonIcon />}
            </Avatar>
            <Typography
              sx={{
                color: '#fff',
                fontSize: '14px',
                display: { xs: 'none', md: 'block' },
              }}
            >
              {user?.name || 'User'}
            </Typography>
            <ArrowDropDownIcon sx={{ color: '#fff', fontSize: '20px' }} />
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              PaperProps={{
                sx: {
                  backgroundColor: '#1a1a1a',
                  color: '#fff',
                  mt: 1,
                },
              }}
            >
              <MenuItem onClick={handleProfile} sx={{ color: '#fff', '&:hover': { backgroundColor: '#333' } }}>
                <PersonIcon sx={{ mr: 1, fontSize: '20px' }} />
                Profile
              </MenuItem>
              <MenuItem onClick={handleLogout} sx={{ color: '#fff', '&:hover': { backgroundColor: '#333' } }}>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <Button 
            variant="primary" 
            size="small" 
            borderRadius='20px' 
            textSize="12px"
            onClick={() => {
              // This will be handled by Hero component's login modal
              // For now, we can navigate to home where the login modal can be triggered
              router.push('/');
            }}
          >
            Start Streaming
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}