import { AppBar, Toolbar, Box, IconButton } from '@mui/material';
import MovieIcon from '@mui/icons-material/Movie';
import Link from 'next/link';
import Button from '@/components/common/Button';
export default function Navbar() {
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

        {/* CTA Button */}
        {/* <Button
          variant="contained"
          sx={{
            backgroundColor: '#fff',
            color: '#000',
            textTransform: 'none',
            fontSize: '14px',
            fontWeight: 500,
            px: 3,
            borderRadius: '4px',
            '&:hover': {
              backgroundColor: '#ffd700'
            }
          }}
        >
          Start Streaming
        </Button> */}
        <Button variant="primary" size="small" borderRadius='20px' textSize="12px">Start Streaming</Button>
      </Toolbar>
    </AppBar>
  );
}