import { useState } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Grid,
  Button,
} from '@mui/material';
import { Edit as EditIcon, WorkspacePremium as PremiumIcon } from '@mui/icons-material';

export default function AccountInformationPanel({ user, onUpdate }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || 'Las Vegas, US',
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(editedUser);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUser({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      location: user?.location || 'Las Vegas, US',
    });
    setIsEditing(false);
  };

  const handleChange = (field, value) => {
    setEditedUser({ ...editedUser, [field]: value });
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
        position: 'relative',
      }}
    >
      {/* Title and Edit Icon */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            color: '#fff',
            fontSize: { xs: '1.25rem', md: '1.5rem' },
          }}
        >
          Account Information
        </Typography>
        {!isEditing && (
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Button
              variant="contained"
              onClick={() => router.push('/subscription')}
              startIcon={<PremiumIcon />}
              sx={{
                backgroundColor: '#ffd700',
                color: '#000',
                fontWeight: 600,
                textTransform: 'none',
                px: 2,
                py: 0.75,
                '&:hover': {
                  backgroundColor: '#ffed4e',
                },
              }}
            >
              Premium
            </Button>
            <IconButton
              onClick={handleEdit}
              sx={{
                color: '#ffd700',
                '&:hover': {
                  backgroundColor: 'rgba(255, 215, 0, 0.1)',
                },
              }}
            >
              <EditIcon />
            </IconButton>
          </Box>
        )}
      </Box>

      {/* Account Fields Grid */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <AccountField
            label="Full Name"
            value={isEditing ? editedUser.name : user?.name || 'Not provided'}
            isEditing={isEditing}
            onChange={(value) => handleChange('name', value)}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Box>
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255, 255, 255, 0.65)',
                mb: 1.5,
                fontSize: '0.875rem',
                fontWeight: 400,
              }}
            >
              Password
            </Typography>
            <Button
              sx={{
                color: '#ffd700',
                textTransform: 'none',
                fontSize: '1rem',
                p: 0,
                minWidth: 'auto',
                fontWeight: 400,
                '&:hover': {
                  backgroundColor: 'transparent',
                  textDecoration: 'underline',
                },
              }}
            >
              Change Password
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <AccountField
            label="Email Address"
            value={isEditing ? editedUser.email : user?.email || 'Not provided'}
            isEditing={isEditing}
            onChange={(value) => handleChange('email', value)}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <AccountField
            label="Phone Number"
            value={isEditing ? editedUser.phone : user?.phone || 'Not provided'}
            isEditing={isEditing}
            onChange={(value) => handleChange('phone', value)}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <AccountField
            label="Location"
            value={isEditing ? editedUser.location : editedUser.location || 'Las Vegas, US'}
            isEditing={isEditing}
            onChange={(value) => handleChange('location', value)}
          />
        </Grid>
      </Grid>

      {/* Save/Cancel Buttons when Editing */}
      {isEditing && (
        <Box sx={{ display: 'flex', gap: 2, mt: 4, justifyContent: 'flex-end' }}>
          <Button
            onClick={handleCancel}
            sx={{
              color: '#fff',
              borderColor: 'rgba(255, 255, 255, 0.3)',
              '&:hover': {
                borderColor: '#fff',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            sx={{
              backgroundColor: '#ffd700',
              color: '#000',
              '&:hover': {
                backgroundColor: '#ffed4e',
              },
            }}
            variant="contained"
          >
            Save
          </Button>
        </Box>
      )}
    </Paper>
  );
}

function AccountField({ label, value, isEditing, onChange }) {
  return (
    <Box>
      <Typography
        variant="body2"
        sx={{
          color: 'rgba(255, 255, 255, 0.65)',
          mb: 1.5,
          fontSize: '0.875rem',
          fontWeight: 400,
        }}
      >
        {label}
      </Typography>
      {isEditing ? (
        <TextField
          fullWidth
          value={value}
          onChange={(e) => onChange(e.target.value)}
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
          }}
        />
      ) : (
        <Typography variant="body1" sx={{ color: '#fff', fontSize: '1rem', fontWeight: 400 }}>
          {value}
        </Typography>
      )}
    </Box>
  );
}

