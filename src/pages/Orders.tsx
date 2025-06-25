import React from 'react';
import {
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';

// Mocked sample orders (replace this with fetched or context-based orders)
const mockOrders = [
  {
    id: '1',
    productName: 'Smart Switch',
    quantity: 2,
    date: '2024-04-10',
    customerType: 'Customer',
  },
  {
    id: '2',
    productName: 'WiFi Door Sensor',
    quantity: 5,
    date: '2024-04-09',
    customerType: 'Normal Partner',
  },
  {
    id: '3',
    productName: 'Smart Lock',
    quantity: 1,
    date: '2024-04-08',
    customerType: 'Special Partner',
  },
];

const Orders: React.FC = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h5" component="h1" gutterBottom sx={{ color: '#00bfff' }}>
        Orders
      </Typography>

      <Paper sx={{ p: 3, backgroundColor: '#1e1e1e' }}>
        <Typography variant="h6" gutterBottom sx={{ color: '#90caf9' }}>
          Order Details
        </Typography>

        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#00bfff' }}>Product Name</TableCell>
                <TableCell sx={{ color: '#00bfff' }}>Quantity</TableCell>
                <TableCell sx={{ color: '#00bfff' }}>Order Date</TableCell>
                <TableCell sx={{ color: '#00bfff' }}>Customer Type</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell sx={{ color: '#fff' }}>{order.productName}</TableCell>
                  <TableCell sx={{ color: '#fff' }}>{order.quantity}</TableCell>
                  <TableCell sx={{ color: '#fff' }}>{order.date}</TableCell>
                  <TableCell>
                    <Chip
                      label={order.customerType}
                      color={
                        order.customerType === 'Special Partner'
                          ? 'primary'
                          : order.customerType === 'Normal Partner'
                          ? 'info'
                          : 'default'
                      }
                      sx={{ color: '#fff' }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default Orders;
