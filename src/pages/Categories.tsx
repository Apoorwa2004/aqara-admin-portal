import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { useCategories } from '../context/CategoryContext';
import { useProducts } from '../context/ProductContext';
import { Category } from '../context/CategoryContext';
import { Product } from '../context/ProductContext';

const Categories: React.FC = () => {
  const { categories, addCategory } = useCategories();
  const { products } = useProducts();

  const [newCategory, setNewCategory] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleAddCategory = () => {
    const trimmed = newCategory.trim();
    if (!trimmed) {
      setError('Category name is required');
      return;
    }

    const exists = categories.some(
      (cat: Category) => cat.name.toLowerCase() === trimmed.toLowerCase()
    );

    if (exists) {
      setError('Category already exists');
      return;
    }

    addCategory(newCategory)
    setNewCategory('');
    setError(null);
  };

  return (
    <Box sx={{ width: '100%', color: '#00bfff' }}>
      <Typography variant="h5" component="h1" gutterBottom>
        Product Categories
      </Typography>

      {/* Add Category Section */}
      <Paper sx={{ p: 3, mb: 4, backgroundColor: '#1e1e1e' }}>
        <Typography variant="h6" gutterBottom sx={{ color: '#00bfff' }}>
          Add New Category
        </Typography>
        <TextField
          label="Category Name"
          fullWidth
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          sx={{ my: 2 }}
          InputProps={{ style: { color: '#fff' } }}
          InputLabelProps={{ style: { color: '#ccc' } }}
        />
        {error && (
          <Typography variant="body2" color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <Button variant="contained" onClick={handleAddCategory}>
          Add Category
        </Button>
      </Paper>

      {/* List of Categories */}
      <Paper sx={{ p: 3, backgroundColor: '#1e1e1e' }}>
        <Typography variant="h6" gutterBottom sx={{ color: '#00bfff' }}>
          All Categories
        </Typography>
        <List>
          {categories.length === 0 ? (
            <Typography variant="body1">No categories added yet.</Typography>
          ) : (
            categories.map((cat: Category) => {
              const productCount = products.filter(
                (product: Product) => product.categoryId === cat.name
              ).length;

              return (
                <React.Fragment key={cat.id}>
                  <ListItem>
                    <ListItemText
                      primary={cat.name}
                      secondary={`Products: ${productCount}`}
                      primaryTypographyProps={{ sx: { color: '#fff' } }}
                      secondaryTypographyProps={{ sx: { color: '#aaa' } }}
                    />
                  </ListItem>
                  <Divider sx={{ borderColor: '#333' }} />
                </React.Fragment>
              );
            })
          )}
        </List>
      </Paper>
    </Box>
  );
};

export default Categories;
