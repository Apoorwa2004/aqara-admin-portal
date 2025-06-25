import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Inventory as ProductIcon,
  People as PartnerIcon,
  ContactMail as ContactIcon,
  RequestQuote as QuotationIcon,
  Category as CategoryIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material'
import { useAuth } from '../../context/AuthContext'

const drawerWidth = 240

const menuItems = [
  { text: 'Home', icon: <HomeIcon />, path: '/', roles: ['admin'] },
  { text: 'Products', icon: <ProductIcon />, path: '/products', roles: ['admin', 'store'] },
  { text: 'Categories', icon: <CategoryIcon />, path: '/categories', roles: ['admin'] },
  { text: 'Partners', icon: <PartnerIcon />, path: '/partners', roles: ['admin'] },
  { text: 'Contact Us', icon: <ContactIcon />, path: '/contact-us', roles: ['admin'] },
  { text: 'Quotations', icon: <QuotationIcon />, path: '/quotations', roles: ['admin'] },
  
]

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const theme = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [mobileOpen, setMobileOpen] = useState(false)
  const { logout, user } = useAuth()

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const drawer = (
    <Box
      sx={{
        backgroundColor: '#162a45',
        height: '100%',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {/* Top - Logo and Menu */}
      <Box>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Aqara Web Portal
          </Typography>
        </Toolbar>
        <Divider sx={{ borderColor: '#333' }} />
        <List>
          {user &&
            menuItems
              .filter((item) => item.roles.includes(user.role))
              .map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => {
                  navigate(item.path)
                  if (isMobile) setMobileOpen(false)
                }}
                sx={{
                  color: '#ccc',
                  '&.Mui-selected': {
                    backgroundColor: '#333',
                    color: '#90caf9',
                  },
                  '&:hover': {
                    backgroundColor: '#2c2c2c',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Bottom - Logout */}
      <Box sx={{ p: 2 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              logout()
              navigate('/login')
            }}
            sx={{
              color: '#ccc',
              '&:hover': {
                backgroundColor: '#2c2c2c',
                color: '#f44336',
              },
            }}
          >
            <ListItemIcon sx={{ color: 'inherit' }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </Box>
    </Box>
  )

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: '#2c2c2c',
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          color: '#fff',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              mr: 2,
              display: { sm: 'none' },
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            {menuItems.find((item) => item.path === location.pathname)?.text || 'Dashboard'}
          </Typography>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              backgroundColor: '#1e1e1e',
              color: '#fff',
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              backgroundColor: '#1e1e1e',
              color: '#fff',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: '64px',
          backgroundColor: '#121212',
          minHeight: '100vh',
          color: '#fff',
        }}
      >
        {children}
      </Box>
    </>
  )
}

export default Layout
