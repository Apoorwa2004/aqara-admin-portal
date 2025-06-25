import React from 'react';
import {
  Typography,
  Card,
  CardContent,
  Box,
  Paper,
  Button,
} from '@mui/material';
import {
  Inventory as ProductIcon,
  People as PartnerIcon,
  RequestQuote as QuotationIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { usePartners } from '../context/PartnerContext';
import { useQuotations } from '../context/QuotationContext';
import { useAuth } from '../context/AuthContext'; // <-- import auth context

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { products } = useProducts();
  const { partners } = usePartners();
  const { quotations } = useQuotations();
  const { user } = useAuth(); // <-- get current user

  // Full list of stat cards
  const allStatCards = [
    {
      title: 'Products',
      count: products.length,
      icon: <ProductIcon sx={{ fontSize: 32 }} />,
      color: '#1976d2',
      path: '/products',
      roles: ['admin', 'stores'],
    },
    {
      title: 'Partners',
      count: partners.length,
      icon: <PartnerIcon sx={{ fontSize: 32 }} />,
      color: '#2e7d32',
      path: '/partners',
      roles: ['admin'],
    },
    {
      title: 'Quotations',
      count: quotations.length,
      icon: <QuotationIcon sx={{ fontSize: 32 }} />,
      color: '#ed6c02',
      path: '/quotations',
      roles: ['admin'],
    },
  ];

  // Filter cards based on user role
  const statCards = allStatCards.filter(card => card.roles.includes(user?.role || ''));

  return (
    <Box sx={{ width: '100%', backgroundColor: '#0b1727', minHeight: '100vh', py: 4 }}>
      <Paper
        sx={{
          p: 4,
          mb: 4,
          backgroundColor: '#162a45',
          color: '#ffffff',
          boxShadow: '0 0 15px rgba(0,0,0,0.4)',
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ color: '#90caf9' }}>
          Welcome to Business Portal
        </Typography>
        <Typography variant="body1" color="#ccc">
          Manage your products, partners, quotations, and orders efficiently
          with our comprehensive portal.
        </Typography>
      </Paper>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 7,
          justifyContent: { xs: 'center', md: 'flex-start' },
        }}
      >
        {statCards.map((card) => (
          <Box
            key={card.title}
            sx={{
              width: {
                xs: '100%',
                sm: '48%',
                md: '23%',
              },
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Card
              sx={{
                height: '100%',
                flex: 1,
                backgroundColor: '#1e1e1e',
                color: '#ffffff',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: `0 8px 20px ${card.color}`,
                },
              }}
            >
              <CardContent
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">{card.title}</Typography>
                  <Box
                    sx={{
                      backgroundColor: card.color,
                      borderRadius: '50%',
                      width: 50,
                      height: 50,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                    }}
                  >
                    {card.icon}
                  </Box>
                </Box>
                <Typography variant="h3" sx={{ mb: 2, fontWeight: 'bold', color: '#00bfff' }}>
                  {card.count}
                </Typography>
                <Box sx={{ mt: 'auto' }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => navigate(card.path)}
                    sx={{
                      borderColor: '#90caf9',
                      color: '#90caf9',
                      '&:hover': {
                        backgroundColor: '#90caf9',
                        color: '#0b1727',
                      },
                    }}
                  >
                    View {card.title}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default HomePage;
