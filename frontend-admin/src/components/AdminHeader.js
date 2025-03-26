import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
  Tooltip,
  Badge,
  InputBase,
  alpha,
  styled,
  keyframes
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";

// Animation keyframes
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const gradient = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Styled components
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const AnimatedAvatar = styled(Avatar)({
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.2)',
    boxShadow: '0 0 10px rgba(255,255,255,0.5)'
  }
});

const AdminHeader = ({
  title = "Admin Dashboard",
  userName = "John Doe",
  userRole = "System Administrator",
  onMenuToggle
}) => {
  const [notificationCount] = useState(3);

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        background: 'linear-gradient(45deg, #4a8c5e 0%, #74bf54 100%)',
        backgroundSize: '200% 200%',
        animation: `${gradient} 10s ease infinite`,
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        transition: 'all 0.3s ease',
      }}
    >
      <Toolbar>
        {/* Mobile menu button */}
        <IconButton
          color="inherit"
          edge="start"
          onClick={onMenuToggle}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        {/* Dashboard Title */}
        <Typography 
          variant="h6" 
          noWrap 
          component="div" 
          sx={{ 
            flexGrow: 1,
            fontWeight: 700,
            letterSpacing: '0.5px',
            textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
          }}
        >
          {title}
        </Typography>

        {/* Search */}
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search..."
            inputProps={{ 'aria-label': 'search' }}
          />
        </Search>

        {/* Header Action Icons */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton 
              color="inherit"
              sx={{
                animation: notificationCount > 0 ? `${pulse} 2s infinite` : 'none'
              }}
            >
              <Badge 
                badgeContent={notificationCount} 
                color="error"
                overlap="circular"
              >
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* User Profile */}
          <Tooltip title={`${userName} (${userRole})`}>
            <Box sx={{ 
              display: "flex", 
              alignItems: "center", 
              gap: 1,
              cursor: 'pointer',
              p: 1,
              borderRadius: 1,
              '&:hover': {
                backgroundColor: ' bg-gradient-to-t from-lime-100 via-lime-200 to-lime-300',
              }
            }}>
              <AnimatedAvatar
                alt={userName}
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: 'primary.dark',
                }}
              >
                {userName.charAt(0).toUpperCase()}
              </AnimatedAvatar>
              <Box sx={{ display: { xs: "none", md: "block" } }}>
                <Typography variant="subtitle2" color="inherit" sx={{ fontWeight: 600 }}>
                  {userName}
                </Typography>
                <Typography
                  variant="caption"
                  color="inherit"
                  sx={{ 
                    opacity: 0.9,
                    display: 'block',
                    lineHeight: 1
                  }}
                >
                  {userRole}
                </Typography>
              </Box>
            </Box>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AdminHeader;