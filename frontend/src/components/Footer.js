import { Box, Container, Typography, IconButton, Button } from '@mui/material';
import { Twitter, Instagram, Facebook, LinkedIn, ArrowOutward } from '@mui/icons-material';
import Link from 'next/link';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#000',
        color: '#fff',
        pt: 1,
        pb: 4,
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: 4,
          }}
        >
          {/* Left Section - Brand and Contact */}
          <Box sx={{ flex: '1 1 300px' }}>
            <Typography
              variant="h3"
              sx={{
                fontFamily: '"Playfair Display", serif',
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                fontWeight: 400,
                mb: 4,
                letterSpacing: '-0.02em',
              }}
            >
              StreamSphere
            </Typography>

            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontSize: '1rem',
                  mb: 2,
                  fontWeight: 500,
                }}
              >
                Contact
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.95rem',
                  lineHeight: 1.8,
                  color: 'rgba(255, 255, 255, 0.8)',
                }}
              >
                123 Innovation Drive, Global City
                <br />
                phone: +1 (800) 555-0199
                <br />
                email: support@novacapitalfinance.co
              </Typography>
            </Box>
          </Box>

          {/* Center Section - Socials */}
          <Box sx={{ flex: '0 1 auto' }}>
            <Typography
              variant="h6"
              sx={{
                fontSize: '1rem',
                mb: 2,
                fontWeight: 500,
              }}
            >
              Socials
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&:hover': {
                    color: '#fff',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <Twitter />
              </IconButton>
              <IconButton
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&:hover': {
                    color: '#fff',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <Instagram />
              </IconButton>
              <IconButton
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&:hover': {
                    color: '#fff',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <Facebook />
              </IconButton>
              <IconButton
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&:hover': {
                    color: '#fff',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <LinkedIn />
              </IconButton>
            </Box>
          </Box>

          {/* Right Section - Explore More */}
          <Box sx={{ flex: '0 1 auto' }}>
            <Typography
              variant="h6"
              sx={{
                fontSize: '1rem',
                mb: 2,
                fontWeight: 500,
              }}
            >
              Explore More
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Link href="/movies" passHref legacyBehavior>
                <Button
                  component="a"
                  endIcon={<ArrowOutward sx={{ fontSize: '1rem' }} />}
                  sx={{
                    justifyContent: 'space-between',
                    color: '#fff',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '50px',
                    px: 3,
                    py: 1,
                    textTransform: 'none',
                    fontSize: '1rem',
                    width: '180px',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                    },
                  }}
                >
                  Movies
                </Button>
              </Link>
              <Link href="/series" passHref legacyBehavior>
                <Button
                  component="a"
                  endIcon={<ArrowOutward sx={{ fontSize: '1rem' }} />}
                  sx={{
                    justifyContent: 'space-between',
                    color: '#fff',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '50px',
                    px: 3,
                    py: 1,
                    textTransform: 'none',
                    fontSize: '1rem',
                    width: '180px',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                    },
                  }}
                >
                  Series
                </Button>
              </Link>
              <Link href="/about" passHref legacyBehavior>
                <Button
                  component="a"
                  endIcon={<ArrowOutward sx={{ fontSize: '1rem' }} />}
                  sx={{
                    justifyContent: 'space-between',
                    color: '#fff',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '50px',
                    px: 3,
                    py: 1,
                    textTransform: 'none',
                    fontSize: '1rem',
                    width: '180px',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                    },
                  }}
                >
                  About
                </Button>
              </Link>
            </Box>
          </Box>
        </Box>

        {/* Bottom Copyright */}
        <Box
          sx={{
            mt: 6,
            pt: 3,
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: '0.875rem',
            }}
          >
            © {new Date().getFullYear()} StreamSphere. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}