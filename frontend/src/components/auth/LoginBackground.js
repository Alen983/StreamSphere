import { Box } from '@mui/material';

export default function LoginBackground() {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '60%',
        height: '100%',
        background: 'linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(26,0,0,0.95) 50%, rgba(0,0,0,0.9) 100%)',
        zIndex: 0,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(51,51,51,0.1) 2px, rgba(51,51,51,0.1) 4px),
            repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(51,51,51,0.05) 2px, rgba(51,51,51,0.05) 4px)
          `,
          opacity: 0.3,
        },
      }}
    >
      {/* Decorative Film Camera Icon */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: '60px',
          height: '60px',
          border: '2px solid rgba(255,255,255,0.1)',
          borderRadius: '8px',
          opacity: 0.2,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '30px',
            height: '30px',
            border: '2px solid rgba(255,255,255,0.1)',
            borderRadius: '50%',
          },
        }}
      />
    </Box>
  );
}

