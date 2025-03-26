import React from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Link, 
  Divider,
  Button,
  IconButton,
  useTheme,
  styled,
  keyframes,
  alpha,
  InputBase
} from '@mui/material';
import { 
  GitHub as GitHubIcon, 
  LinkedIn as LinkedInIcon, 
  Twitter as TwitterIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  ArrowUpward as ArrowUpwardIcon
} from '@mui/icons-material';

// Animation keyframes
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0px); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// Styled components
const AnimatedIconButton = styled(IconButton)(({ theme }) => ({
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-3px)',
    color: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.1)
  }
}));

const BackToTopButton = styled(Button)({
  animation: `${pulse} 4s infinite`,
  position: 'fixed',
  bottom: 20,
  right: 20,
  zIndex: 1000,
  borderRadius: '50%',
  minWidth: 0,
  width: 56,
  height: 56,
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
});

const AdminFooter = () => {
  const theme = useTheme();
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: theme.palette.background.paper,
        py: 6,
        borderTop: `1px solid ${theme.palette.divider}`,
        position: 'relative'
      }}
    >
      <BackToTopButton 
        color="primary" 
        variant="contained"
        onClick={scrollToTop}
        aria-label="scroll back to top"
      >
        <ArrowUpwardIcon />
      </BackToTopButton>

      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} md={4}>
            <Typography 
              variant="h6" 
              color="text.primary" 
              gutterBottom
              sx={{ fontWeight: 700 }}
            >
              <Box 
                component="span" 
                sx={{ 
                  color: theme.palette.primary.main,
                  animation: `${float} 6s ease-in-out infinite`
                }}
              >
                Food
              </Box> Platform Admin
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Empowering restaurant management with cutting-edge technology.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              <Button 
                variant="outlined" 
                startIcon={<EmailIcon />}
                size="small"
                sx={{ 
                  textTransform: 'none',
                  borderRadius: 2
                }}
              >
                Contact Us
              </Button>
              <Button 
                variant="outlined" 
                startIcon={<PhoneIcon />}
                size="small"
                sx={{ 
                  textTransform: 'none',
                  borderRadius: 2
                }}
              >
                Support
              </Button>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={6} md={2}>
            <Typography 
              variant="subtitle1" 
              color="text.primary" 
              gutterBottom
              sx={{ fontWeight: 600 }}
            >
              Resources
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Link 
                href="#" 
                color="text.secondary" 
                underline="hover" 
                sx={{ 
                  mb: 1,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: theme.palette.primary.main,
                    transform: 'translateX(3px)'
                  }
                }}
              >
                Documentation
              </Link>
              <Link 
                href="#" 
                color="text.secondary" 
                underline="hover" 
                sx={{ 
                  mb: 1,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: theme.palette.primary.main,
                    transform: 'translateX(3px)'
                  }
                }}
              >
                API Reference
              </Link>
              <Link 
                href="#" 
                color="text.secondary" 
                underline="hover" 
                sx={{ 
                  mb: 1,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: theme.palette.primary.main,
                    transform: 'translateX(3px)'
                  }
                }}
              >
                Tutorials
              </Link>
              <Link 
                href="#" 
                color="text.secondary" 
                underline="hover" 
                sx={{ 
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: theme.palette.primary.main,
                    transform: 'translateX(3px)'
                  }
                }}
              >
                Blog
              </Link>
            </Box>
          </Grid>

          <Grid item xs={6} md={2}>
            <Typography 
              variant="subtitle1" 
              color="text.primary" 
              gutterBottom
              sx={{ fontWeight: 600 }}
            >
              Legal
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Link 
                href="#" 
                color="text.secondary" 
                underline="hover" 
                sx={{ 
                  mb: 1,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: theme.palette.primary.main,
                    transform: 'translateX(3px)'
                  }
                }}
              >
                Privacy Policy
              </Link>
              <Link 
                href="#" 
                color="text.secondary" 
                underline="hover" 
                sx={{ 
                  mb: 1,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: theme.palette.primary.main,
                    transform: 'translateX(3px)'
                  }
                }}
              >
                Terms of Service
              </Link>
              <Link 
                href="#" 
                color="text.secondary" 
                underline="hover" 
                sx={{ 
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: theme.palette.primary.main,
                    transform: 'translateX(3px)'
                  }
                }}
              >
                Cookie Policy
              </Link>
            </Box>
          </Grid>

          {/* Contact & Social */}
          <Grid item xs={12} md={4}>
            <Typography 
              variant="subtitle1" 
              color="text.primary" 
              gutterBottom
              sx={{ fontWeight: 600 }}
            >
              Connect With Us
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <AnimatedIconButton 
                href="#" 
                aria-label="GitHub"
                sx={{ 
                  backgroundColor: alpha(theme.palette.text.secondary, 0.1),
                  '&:hover': { backgroundColor: alpha('#333', 0.2) }
                }}
              >
                <GitHubIcon />
              </AnimatedIconButton>
              <AnimatedIconButton 
                href="#" 
                aria-label="LinkedIn"
                sx={{ 
                  backgroundColor: alpha(theme.palette.text.secondary, 0.1),
                  '&:hover': { backgroundColor: alpha('#0077B5', 0.2) }
                }}
              >
                <LinkedInIcon />
              </AnimatedIconButton>
              <AnimatedIconButton 
                href="#" 
                aria-label="Twitter"
                sx={{ 
                  backgroundColor: alpha(theme.palette.text.secondary, 0.1),
                  '&:hover': { backgroundColor: alpha('#1DA1F2', 0.2) }
                }}
              >
                <TwitterIcon />
              </AnimatedIconButton>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Subscribe to our newsletter for updates
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <InputBase
                placeholder="Your email"
                sx={{
                  flex: 1,
                  px: 2,
                  py: 1,
                  backgroundColor: alpha(theme.palette.text.secondary, 0.05),
                  borderRadius: 1,
                  border: `1px solid ${theme.palette.divider}`
                }}
              />
              <Button 
                variant="contained" 
                color="primary"
                sx={{ 
                  borderRadius: 1,
                  textTransform: 'none'
                }}
              >
                Subscribe
              </Button>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: alpha(theme.palette.divider, 0.5) }} />

        {/* Additional Footer Info */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ mb: { xs: 1, sm: 0 } }}
          >
            © {new Date().getFullYear()} Food Platform. All Rights Reserved.
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              gap: 0.5
            }}
          >
            <Box component="span" sx={{ animation: `${pulse} 3s infinite` }}>
              ❤️
            </Box>
            Powered by Advanced Admin Technologies
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default AdminFooter;