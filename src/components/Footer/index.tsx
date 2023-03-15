import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function Footer() {
  return (
    <Box sx={{ bgcolor: "var(--primaryColor)", color: '#fff', py: 3 }}>
      <Typography variant="body2" align="center">
        © 2023 mReservas. All rights reserved.
      </Typography>
    </Box>
  );
}

export default Footer;
