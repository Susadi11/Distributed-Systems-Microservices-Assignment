import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Paper, 
  Button,
  Fade,
  Grow,
  Slide,
  Zoom,
  CssBaseline
} from '@mui/material';
import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';
import AdminFooter from './components/AdminFooter';
import { styled } from '@mui/material/styles';
import { keyframes } from '@mui/system';

// Animation keyframes
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

// Styled components
const AnimatedPaper = styled(Paper)(({ theme }) => ({
  transition: theme.transitions.create(['transform', 'box-shadow'], {
    duration: theme.transitions.duration.standard,
  }),
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
  },
}));

const PulseBox = styled(Box)({
  animation: `${pulse} 3s infinite`,
});

const FloatBox = styled(Box)({
  animation: `${float} 6s ease-in-out infinite`,
});

// Dashboard Components with animations
const FinancialOverview = () => (
  <Fade in timeout={800}>
    <AnimatedPaper elevation={3} sx={{ p: 3, mb: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        Financial Overview
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Grow in timeout={1000}>
            <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', height: '100%' }}>
              <PulseBox>
                <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>$150,000</Typography>
              </PulseBox>
              <Typography color="textSecondary">Total Revenue</Typography>
            </Paper>
          </Grow>
        </Grid>
        <Grid item xs={12} md={4}>
          <Grow in timeout={1200}>
            <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', height: '100%' }}>
              <PulseBox>
                <Typography variant="h4" color="secondary" sx={{ fontWeight: 700 }}>25%</Typography>
              </PulseBox>
              <Typography color="textSecondary">Platform Commission</Typography>
            </Paper>
          </Grow>
        </Grid>
        <Grid item xs={12} md={4}>
          <Grow in timeout={1400}>
            <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', height: '100%' }}>
              <PulseBox>
                <Typography variant="h4" sx={{ color: '#4caf50', fontWeight: 700 }}>$37,500</Typography>
              </PulseBox>
              <Typography color="textSecondary">Pending Payouts</Typography>
            </Paper>
          </Grow>
        </Grid>
      </Grid>
    </AnimatedPaper>
  </Fade>
);

const RestaurantManagement = () => (
  <Slide direction="up" in timeout={800}>
    <AnimatedPaper elevation={3} sx={{ p: 3, mb: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        Restaurant Management
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Zoom in timeout={1000}>
            <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
              <Typography variant="subtitle1">Pending Verifications</Typography>
              <FloatBox>
                <Typography variant="h4" color="error" sx={{ fontWeight: 700 }}>12</Typography>
              </FloatBox>
              <Button 
                variant="contained" 
                color="primary" 
                sx={{ mt: 2 }}
                fullWidth
              >
                Review Restaurants
              </Button>
            </Paper>
          </Zoom>
        </Grid>
        <Grid item xs={12} md={6}>
          <Zoom in timeout={1200}>
            <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
              <Typography variant="subtitle1">Total Restaurants</Typography>
              <FloatBox>
                <Typography variant="h4" sx={{ color: '#9c27b0', fontWeight: 700 }}>250</Typography>
              </FloatBox>
              <Button 
                variant="contained" 
                color="secondary" 
                sx={{ mt: 2 }}
                fullWidth
              >
                Manage Restaurants
              </Button>
            </Paper>
          </Zoom>
        </Grid>
      </Grid>
    </AnimatedPaper>
  </Slide>
);

const UserAndSecurityOverview = () => (
  <Fade in timeout={800}>
    <AnimatedPaper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        User & Security Overview
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Grow in timeout={1000}>
            <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', height: '100%' }}>
              <Typography variant="h4" sx={{ color: '#2196f3', fontWeight: 700 }}>1,500</Typography>
              <Typography color="textSecondary">Total Users</Typography>
            </Paper>
          </Grow>
        </Grid>
        <Grid item xs={12} md={4}>
          <Grow in timeout={1200}>
            <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', height: '100%' }}>
              <Typography variant="h4" sx={{ color: '#ff9800', fontWeight: 700 }}>50</Typography>
              <Typography color="textSecondary">Active Admins</Typography>
            </Paper>
          </Grow>
        </Grid>
        <Grid item xs={12} md={4}>
          <Grow in timeout={1400}>
            <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', height: '100%' }}>
              <Typography variant="h4" color="error" sx={{ fontWeight: 700 }}>3</Typography>
              <Typography color="textSecondary">Security Alerts</Typography>
              <Button 
                variant="outlined" 
                color="error" 
                size="small" 
                sx={{ mt: 1 }}
                fullWidth
              >
                View Alerts
              </Button>
            </Paper>
          </Grow>
        </Grid>
      </Grid>
    </AnimatedPaper>
  </Fade>
);

function SystemAdminDashboard() {
  const [selectedMenu, setSelectedMenu] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleMenuSelect = (menuItem) => {
    setSelectedMenu(menuItem);
  };

  const handleLogout = () => {
    // Implement logout logic here
    console.log('Logging out');
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f7fa' }}>
      <CssBaseline />
      
      {/* Header */}
      <AdminHeader 
        title="Food Platform Admin Dashboard" 
        userName="Admin User" 
        userRole="System Administrator" 
      />
      
      {/* Sidebar */}
      <AdminSidebar 
        selectedMenu={selectedMenu}
        onMenuSelect={handleMenuSelect}
        onLogout={handleLogout}
        title="Admin Dashboard"
      />

      {/* Main Content */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 3,
          pt: { xs: 8, sm: 12 },
          pb: 10,
          backgroundColor: '#f5f7fa',
          minHeight: '100vh'
        }}
      >
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          {!loading && (
            <>
              <Typography 
                variant="h3" 
                sx={{ 
                  mb: 3, 
                  fontWeight: 'bold',
                  background: 'linear-gradient(45deg, #c4a045 30%, #d4b15f 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                System Admin Dashboard
              </Typography>

              {/* Dashboard Content */}
              <Box sx={{ mb: 4 }}>
                <FinancialOverview />
              </Box>
              
              <Box sx={{ mb: 4 }}>
                <RestaurantManagement />
              </Box>
              
              <Box>
                <UserAndSecurityOverview />
              </Box>
            </>
          )}
        </Container>
          {/* Footer */}
      <AdminFooter />
      </Box>
      
    
    </Box>
  );
}

export default SystemAdminDashboard;