import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button } from '@mui/material';
import { useProducts } from '../../context/ProductContext';
import { useAuth } from '../../context/AuthContext';

const UpdateQuantityPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isStoreUser = user?.role === 'store';

  const { getProduct, updateProductQuantity } = useProducts();
  const product = getProduct(id || '');

  const [quantity, setQuantity] = useState(product?.quantity || 0);

  useEffect(() => {
    if (!isStoreUser) {
      navigate('/products'); // redirect non-store users
    }
  }, [isStoreUser]);

  useEffect(() => {
    if (product) setQuantity(product.quantity);
  }, [product]);

  const handleUpdate = async () => {
    if (isNaN(quantity) || quantity < 0) {
      alert("Quantity must be a non-negative number.");
      return;
    }

    await updateProductQuantity(product?.id || '', quantity);
    navigate('/products');
  };

  if (!product) {
    return (
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h6">Product not found</Typography>
        <Button onClick={() => navigate('/products')} sx={{ mt: 2 }}>
          Back to Products
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Update Quantity for {product.name}
      </Typography>
      <TextField
        fullWidth
        label="Quantity"
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        sx={{ mt: 2 }}
      />
      <Button variant="contained" onClick={handleUpdate} sx={{ mt: 2 }}>
        Update
      </Button>
    </Box>
  );
};

export default UpdateQuantityPage;
