import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  TablePagination,
  Switch,
  FormControlLabel,
  Avatar,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useProducts } from '../../context/ProductContext';
import SearchBar from '../../components/UI/SearchBar';
import ConfirmDialog from '../../components/UI/ConfirmDialog';
import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const ProductList: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isStore = user?.role === 'store';
  const { products, deleteProduct, updateProduct, fetchProducts } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(0);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteClick = (id: string) => {
    setProductToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (productToDelete) {
      console.log('🧪 Deleting product:', productToDelete);
      await deleteProduct(productToDelete);
      await fetchProducts();
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const handleStatusChange = async (id: string, currentStatus: 'active' | 'inactive') => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      console.log('🧪 Updating status for:', id, '->', newStatus);

      await updateProduct(id, { status: newStatus }); // Ensure this sends `PATCH` or `PUT`
      await fetchProducts(); // ✅ Refresh the list

      console.log('✅ Status updated successfully');
    } catch (error) {
      console.error('❌ Failed to update status:', error);
    }
  };


  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const displayedProducts = filteredProducts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <Box sx={{ width: '100%', color: '#00bfff' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h1" sx={{ color: '#00bfff' }}>
          Products
        </Typography>
        {!isStore && (
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => navigate('/products/add')}
            sx={{ color: '#00bfff', borderColor: 'white', '&:hover': { backgroundColor: '#9370db', color: 'white' } }}
          >
            Add Product
          </Button>
        )}
      </Box>

      <SearchBar onSearch={handleSearch} placeholder="Search products..." />

      <Box sx={{ width: '100%', overflowX: 'auto' }}>
        <TableContainer component={Paper} sx={{ backgroundColor: '#1e1e1e' }}>
          <Table sx={{ minWidth: 750 }} aria-label="product table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#00bfff', fontSize: { xs: '12px', sm: '14px' }, px: { xs: 1, sm: 2 } }}>Image</TableCell>
                <TableCell sx={{ color: '#00bfff', fontSize: { xs: '12px', sm: '14px' }, px: { xs: 1, sm: 2 } }}>Name</TableCell>
                <TableCell sx={{ color: '#00bfff', fontSize: { xs: '12px', sm: '14px' }, px: { xs: 1, sm: 2 } }}>Model No</TableCell>
                <TableCell sx={{ color: '#00bfff', fontSize: { xs: '12px', sm: '14px' }, px: { xs: 1, sm: 2 } }}>Category</TableCell>
                <TableCell sx={{ color: '#00bfff', fontSize: { xs: '12px', sm: '14px' }, px: { xs: 1, sm: 2 } }}>Customer Price ($)</TableCell>
                <TableCell sx={{ color: '#00bfff', fontSize: { xs: '12px', sm: '14px' }, px: { xs: 1, sm: 2 } }}>Partner Price ($)</TableCell>
                <TableCell sx={{ color: '#00bfff', fontSize: { xs: '12px', sm: '14px' }, px: { xs: 1, sm: 2 } }}>SP Price ($)</TableCell>
                <TableCell sx={{ color: '#00bfff', fontSize: { xs: '12px', sm: '14px' }, px: { xs: 1, sm: 2 } }}>Status</TableCell>
                <TableCell sx={{ color: '#00bfff', fontSize: { xs: '12px', sm: '14px' }, px: { xs: 1, sm: 2 } }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedProducts.length > 0 ? (
                displayedProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Avatar
                        variant="rounded"
                        src={typeof product.photo === 'string' ? product.photo : undefined}
                        alt={product.name}
                        sx={{ width: 56, height: 56 }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: '#e0e0e0' }}>{product.name}</TableCell>
                    <TableCell sx={{ color: '#e0e0e0' }}>{product.model}</TableCell>
                    <TableCell sx={{ color: '#e0e0e0' }}>{product.categoryId || 'N/A'}</TableCell>
                    <TableCell align="right" sx={{ color: '#e0e0e0' }}>{product.price1.toFixed(0)}</TableCell>
                    <TableCell align="right" sx={{ color: '#e0e0e0' }}>{product.price2.toFixed(0)}</TableCell>
                    <TableCell align="right" sx={{ color: '#e0e0e0' }}>{product.price3.toFixed(0)}</TableCell>
                    <TableCell>
                      {user?.role === 'admin' ? (
                        <FormControlLabel
                          control={
                            <Switch
                              checked={product.status === 'active'}
                              onChange={() => handleStatusChange(product.id, product.status)}
                              color="success"
                            />
                          }
                          label={
                            <Chip
                              label={product.status}
                              sx={{
                                backgroundColor: product.status === 'active' ? '#43a047' : '#555',
                                color: '#fff'
                              }}
                              size="small"
                            />
                          }
                        />
                      ) : (
                        <Chip
                          label={product.status}
                          sx={{
                            backgroundColor: product.status === 'active' ? '#43a047' : '#555',
                            color: '#fff'
                          }}
                          size="small"
                        />
                      )}
                    </TableCell>


                    <TableCell align="center">
                      <IconButton
                        onClick={() => {
                          if (isStore) {
                            navigate(`/products/update-quantity/${product.id}`);
                          } else {
                            navigate(`/products/edit/${product.id}`);
                          }
                        }}
                        sx={{ color: '#90caf9' }}
                      >
                        <EditIcon />
                      </IconButton>

                      {user?.role === 'admin' && (
                        <IconButton
                          onClick={() => handleDeleteClick(product.id)}
                          sx={{ color: '#ef5350' }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ color: '#aaa' }}>
                    No products found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredProducts.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ color: '#f5f5f5' }}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </Box>
  );
};

export default ProductList;
