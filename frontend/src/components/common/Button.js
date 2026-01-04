import React from 'react';
import { Button as MuiButton } from '@mui/material';

const Button = ({ 
  variant = 'primary', 
  children, 
  fullWidth = false,
  size = 'medium',
  disabled = false,
  onClick,
  startIcon,
  endIcon,
  borderRadius = '4px',
  textSize,
  ...props 
}) => {
  
  const variantStyles = {
    primary: {
      backgroundColor: '#fff',
      color: '#000',
      textTransform: 'none',
      fontSize: '14px',
      fontWeight: 500,
      px: 3,
      py: 1.5,
      borderRadius: '4px',
      '&:hover': {
        backgroundColor: '#ffd700',
      },
      '&:disabled': {
        backgroundColor: '#e0e0e0',
        color: '#9e9e9e',
      }
    },
    secondary: {
      backgroundColor: '#1976d2',
      color: '#fff',
      textTransform: 'none',
      fontSize: '14px',
      fontWeight: 500,
      px: 3,
      py: 1.5,
      borderRadius: '4px',
      '&:hover': {
        backgroundColor: '#1565c0',
      },
      '&:disabled': {
        backgroundColor: '#e0e0e0',
        color: '#9e9e9e',
      }
    },
    outlined: {
      backgroundColor: 'transparent',
      color: '#fff',
      border: '2px solid #fff',
      textTransform: 'none',
      fontSize: '14px',
      fontWeight: 500,
      px: 3,
      py: 1.5,
      borderRadius: '4px',
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderColor: '#ffd700',
        color: '#ffd700',
      },
      '&:disabled': {
        borderColor: '#9e9e9e',
        color: '#9e9e9e',
      }
    },
    text: {
      backgroundColor: 'transparent',
      color: '#fff',
      textTransform: 'none',
      fontSize: '14px',
      fontWeight: 500,
      px: 2,
      py: 1,
      borderRadius: '4px',
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        color: '#ffd700',
      },
      '&:disabled': {
        color: '#9e9e9e',
      }
    },
    dark: {
      backgroundColor: '#000',
      color: '#fff',
      textTransform: 'none',
      fontSize: '14px',
      fontWeight: 500,
      px: 3,
      py: 1.5,
      borderRadius: '4px',
      '&:hover': {
        backgroundColor: '#333',
      },
      '&:disabled': {
        backgroundColor: '#e0e0e0',
        color: '#9e9e9e',
      }
    },
    success: {
      backgroundColor: '#4caf50',
      color: '#fff',
      textTransform: 'none',
      fontSize: '14px',
      fontWeight: 500,
      px: 3,
      py: 1.5,
      borderRadius: '4px',
      '&:hover': {
        backgroundColor: '#45a049',
      },
      '&:disabled': {
        backgroundColor: '#e0e0e0',
        color: '#9e9e9e',
      }
    },
    danger: {
      backgroundColor: '#f44336',
      color: '#fff',
      textTransform: 'none',
      fontSize: '14px',
      fontWeight: 500,
      px: 3,
      py: 1.5,
      borderRadius: '4px',
      '&:hover': {
        backgroundColor: '#d32f2f',
      },
      '&:disabled': {
        backgroundColor: '#e0e0e0',
        color: '#9e9e9e',
      }
    }
  };

  const sizeStyles = {
    small: {
      fontSize: '12px',
      px: 2,
      py: 0.75,
      borderRadius: '4px',
    },
    medium: {
      fontSize: '14px',
      px: 3,
      py: 1.5,
      borderRadius: '4px',
    },
    large: {
      fontSize: '16px',
      px: 4,
      py: 2,
      borderRadius: '4px',
    }
  };

  return (
    <MuiButton
      variant="contained"
      fullWidth={fullWidth}
      disabled={disabled}
      onClick={onClick}
      startIcon={startIcon}
      endIcon={endIcon}
      sx={{
        ...variantStyles[variant],
        ...sizeStyles[size],
        borderRadius: borderRadius,
        ...(textSize && { fontSize: textSize }),
        ...props.sx,
      }}
      {...props}
    >
      {children}
    </MuiButton>
  );
};

export default Button;

/* 
USAGE EXAMPLES:

import Button from './Button';
import { PlayArrow, Download } from '@mui/icons-material';

// Primary variant (your original style)
<Button variant="primary">
  Start Streaming
</Button>

// Secondary variant
<Button variant="secondary">
  Learn More
</Button>

// Outlined variant
<Button variant="outlined">
  Watch Trailer
</Button>

// Text variant
<Button variant="text">
  Skip
</Button>

// Dark variant
<Button variant="dark">
  Subscribe Now
</Button>

// Success variant
<Button variant="success">
  Confirm
</Button>

// Danger variant
<Button variant="danger">
  Delete
</Button>

// With size props
<Button variant="primary" size="small">
  Small Button
</Button>

<Button variant="primary" size="large">
  Large Button
</Button>

// With icons
<Button variant="primary" startIcon={<PlayArrow />}>
  Play Now
</Button>

<Button variant="secondary" endIcon={<Download />}>
  Download
</Button>

// Full width
<Button variant="primary" fullWidth>
  Full Width Button
</Button>

// Disabled
<Button variant="primary" disabled>
  Disabled Button
</Button>

// With custom onClick
<Button variant="primary" onClick={() => console.log('Clicked!')}>
  Click Me
</Button>

// With custom styles override
<Button 
  variant="primary" 
  sx={{ borderRadius: '20px' }}
>
  Rounded Button
</Button>

// With custom borderRadius prop
<Button variant="primary" borderRadius="20px">
  Pill Button
</Button>

<Button variant="secondary" borderRadius="0">
  Square Button
</Button>

<Button variant="outlined" borderRadius="50%">
  Circle Button
</Button>

// With custom textSize prop
<Button variant="primary" textSize="18px">
  Large Text
</Button>

<Button variant="secondary" textSize="12px">
  Small Text
</Button>

<Button variant="dark" textSize="1rem">
  Custom Size
</Button>

// Combining multiple props
<Button 
  variant="primary" 
  size="large" 
  borderRadius="12px" 
  textSize="20px"
>
  Custom Everything
</Button>
*/