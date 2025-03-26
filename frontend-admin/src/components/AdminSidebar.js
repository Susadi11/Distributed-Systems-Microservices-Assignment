import React from 'react';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Toolbar, 
  Typography, 
  Divider, 
  Button, 
  Box,
  Grow,
  Slide,
  useTheme
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  RestaurantMenu as RestaurantIcon,
  Person as UserIcon,
  AttachMoney as FinanceIcon,
  Security as SecurityIcon,
  Report as ReportIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { keyframes } from '@mui/system';

// Animation keyframes
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const highlight = keyframes`
  0% { background-color: rgba(255,255,255,0); }
  50% { background-color: rgba(255,255,255,0.1); }
  100% { background-color: rgba(255,255,255,0); }
`;

// Styled components
const AnimatedListItem = styled(ListItem)(({ theme }) => ({
  transition: 'all 0.3s ease',
  borderRadius: theme.shape.borderRadius,
  margin: theme.spacing(0, 1),
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.15)',
    transform: 'translateX(5px)',
    '& .MuiListItemIcon-root': {
      transform: 'scale(1.2)',
      color: theme.palette.secondary.light
    }
  },
  '&.Mui-selected': {
    backgroundColor: 'rgba(255,255,255,0.2)',
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.25)',
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: 0,
      height: '100%',
      width: '4px',
      backgroundColor: theme.palette.secondary.main,
      animation: `${highlight} 2s infinite`
    }
  }
}));

const StyledListItemIcon = styled(ListItemIcon)({
  transition: 'all 0.3s ease',
  minWidth: '40px !important'
});

const AnimatedButton = styled(Button)({
  animation: `${pulse} 4s infinite`,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.02)'
  }
});

const AdminSidebar = ({ 
  selectedMenu, 
  onMenuSelect, 
  onLogout, 
  title = 'Admin Dashboard' 
}) => {
  const theme = useTheme();
  const menuItems = [
    { 
      icon: <DashboardIcon />, 
      text: 'Dashboard', 
      value: 'dashboard' 
    },
    { 
      icon: <RestaurantIcon />, 
      text: 'Restaurant Management', 
      value: 'restaurants' 
    },
    { 
      icon: <UserIcon />, 
      text: 'User Management', 
      value: 'users' 
    },
    { 
      icon: <FinanceIcon />, 
      text: 'Financial Transactions', 
      value: 'finance' 
    },
    { 
      icon: <SecurityIcon />, 
      text: 'Security', 
      value: 'security' 
    },
    { 
      icon: <ReportIcon />, 
      text: 'Reports', 
      value: 'reports' 
    },
    { 
      icon: <SettingsIcon />, 
      text: 'System Settings', 
      value: 'settings' 
    }
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 260,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 260,
          boxSizing: 'border-box',
          backgroundColor: '#1a1a2e',
          color: 'white',
          background: `linear-gradient(45deg, #4a8c5e 0%, #74bf54 100%)`,
          borderRight: 'none',
          boxShadow: theme.shadows[8]
        }
      }}
    >
      <Toolbar sx={{ minHeight: '80px !important' }}>
        <Slide direction="down" in timeout={500}>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'white',
              fontWeight: 700,
              background: `linear-gradient(45deg, ${theme.palette.secondary.main} 30%, ${theme.palette.primary.light} 90%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            {title}
          </Typography>
        </Slide>
      </Toolbar>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
      
      <List sx={{ pt: 2 }}>
        {menuItems.map((item, index) => (
          <Grow in timeout={index * 100 + 500} key={item.value}>
            <AnimatedListItem 
              button 
              selected={selectedMenu === item.value}
              onClick={() => onMenuSelect(item.value)}
            >
              <StyledListItemIcon>
                {item.icon}
              </StyledListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ 
                  variant: 'subtitle2',
                  fontWeight: selectedMenu === item.value ? 600 : 500
                }}
              />
            </AnimatedListItem>
          </Grow>
        ))}
      </List>
      
      <Box sx={{ mt: 'auto', p: 3 }}>
        <Slide direction="up" in timeout={1000}>
          <AnimatedButton 
            variant="contained" 
            color="error" 
            fullWidth 
            startIcon={<LogoutIcon />}
            onClick={onLogout}
            sx={{
              borderRadius: '8px',
              py: 1.5,
              fontWeight: 600,
              boxShadow: theme.shadows[4]
            }}
          >
            Logout
          </AnimatedButton>
        </Slide>
      </Box>
    </Drawer>
  );
};

export default AdminSidebar;