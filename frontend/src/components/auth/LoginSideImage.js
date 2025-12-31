import { Paper } from '@mui/material';

const SIDE_IMAGE_URL = '/cinephile.png';

export default function LoginSideImage() {
  return (
    <Paper
      sx={{
        width: '50%',
        display: { xs: 'none', md: 'block' },
        backgroundImage: `url(${SIDE_IMAGE_URL})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: 0,
      }}
    />
  );
}

