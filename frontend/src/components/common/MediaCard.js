import { Card, CardMedia, CardContent, Typography, Box, Chip } from '@mui/material';
import { Star } from '@mui/icons-material';

export default function MediaCard({ media }) {
  return (
    <Card
      sx={{
        minWidth: 180,
        maxWidth: 180,
        borderRadius: 2,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        backgroundColor: '#1a1a1a',
        color: '#fff',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 24px rgba(0, 0, 0, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },
        '&:hover .card-overlay': {
          opacity: 1,
        },
      }}
    >
      {/* Poster Image */}
      <CardMedia
        component="img"
        height="270"
        image={media.posterUrl}
        alt={media.name}
        sx={{
          objectFit: 'cover',
        }}
      />

      {/* Rating Badge on Image */}
      <Box
        sx={{
          position: 'absolute',
          top: 10,
          right: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)',
          padding: '4px 8px',
          borderRadius: 1.5,
        }}
      >
        <Star sx={{ fontSize: 14, color: '#ffc107' }} />
        <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.8rem' }}>
          {media.rating || 'N/A'}
        </Typography>
      </Box>

      {/* Type Badge on Image */}
      <Chip
        label={media.type.toUpperCase()}
        size="small"
        sx={{
          position: 'absolute',
          top: 10,
          left: 10,
          fontSize: '0.65rem',
          height: 22,
          fontWeight: 700,
          backgroundColor: media.type === 'movie' ? 'rgba(255, 0, 0, 0.9)' : 'rgba(156, 39, 176, 0.9)',
          color: '#fff',
          backdropFilter: 'blur(10px)',
        }}
      />

      {/* Overlay Content - Shows on Hover */}
      <CardContent
        className="card-overlay"
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          p: 2,
          background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.8) 70%, transparent 100%)',
          opacity: 0,
          transition: 'opacity 0.3s ease',
        }}
      >
        {/* Title */}
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontWeight: 700,
            fontSize: '0.9rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            mb: 0.5,
            color: '#fff',
            lineHeight: 1.3,
          }}
        >
          {media.name}
        </Typography>

        {/* Genres */}
        <Typography
          variant="body2"
          sx={{
            fontSize: '0.75rem',
            color: 'rgba(255, 255, 255, 0.7)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {media.genres.join(', ')}
        </Typography>
      </CardContent>
    </Card>
  );
}