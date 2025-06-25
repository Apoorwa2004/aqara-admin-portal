import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Typography, Box, TextField, Button, Paper,
  FormControl, FormControlLabel, FormLabel,
  RadioGroup, Radio, Alert, InputLabel, IconButton, Select, MenuItem, 
  Divider, Chip
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Close as CloseIcon, Edit as EditIcon } from '@mui/icons-material';
import { useProducts } from '../../context/ProductContext';
import { useCategories } from '../../context/CategoryContext';
import AboutEditor from './AboutEditor';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import API_BASE_URL from '../../config/api'

const ProductForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { addProduct } = useProducts();
  const { categories } = useCategories();
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const userRole = user?.role;
  const isEditMode = Boolean(id);
  
  // Enhanced permission checks
  const canAddProduct = userRole === 'admin';
  const isStoreUser = userRole === 'store';

  // Early return for unauthorized access
  if (!isEditMode && !canAddProduct) {
    return (
      <Box sx={{ py: 4, textAlign: 'center', color: 'white', backgroundColor: '#0b1727', minHeight: '100vh' }}>
        <Paper sx={{ p: 4, maxWidth: 400, margin: 'auto', backgroundColor: '#162a45' }}>
          <Typography variant="h6" color="error" gutterBottom>
            Access Denied
          </Typography>
          <Typography variant="body1" sx={{ color: '#fff', mb: 2 }}>
            Store users can only update product quantities, not create new products.
          </Typography>
          <Button variant="contained" onClick={() => navigate('/products')}>
            Back to Products
          </Button>
        </Paper>
      </Box>
    );
  }

  const [formData, setFormData] = useState({
    name: '',
    model: '',
    description: '',
    about: '',
    categoryId: '',
    price1: '',
    price2: '',
    price3: '',
    quantity: '',
    status: 'active',
    photo: null as File | null,
    galleryPhotos: [] as File[],
    videos: [] as File[],
    specifications: [{ label: '', value: '' }],
    photoUrl: '' as string,
    galleryPhotoUrls: [] as string[],
    videoUrls: [] as string[],
    imagesToRemove: [] as string[],
    videosToRemove: [] as string[],
    mainPhotoRemoved: false,
  });

  useEffect(() => {
    if (isEditMode && id) {
      const fetchProduct = async () => {
        setLoading(true);
        try {
          // const token = localStorage.getItem('token');
          const response = await axios.get(`${API_BASE_URL}/api/products/${id}`, 
           
            { withCredentials: true }
          );
          const product = response.data;
          console.log('product'+product);
          
          setFormData({
            name: product.title || '',
            model: product.titleSub || '',
            description: product.description || '',
            about: product.about || '',
            categoryId: product.categoryId?.toString() || '',
            price1: product.price1?.toString() || '',
            price2: product.price2?.toString() || '',
            price3: product.price3?.toString() || '',
            quantity: product.quantity?.toString() || '',
            status: product.status || 'active',
            photo: null,
            galleryPhotos: [],
            videos: [],
            specifications: product.specifications || [{ label: '', value: '' }],
            photoUrl: product.mainPhoto ? `${API_BASE_URL}/uploads/${product.mainPhoto}` : '',
            galleryPhotoUrls: (product.imageUrls || []).map((filename: string) => 
              `${API_BASE_URL}/uploads/${filename}`
            ),
            videoUrls: (product.videoUrls || []).map((filename: string) => 
              `${API_BASE_URL}/uploads/${filename}`
            ),
            imagesToRemove: [],
            videosToRemove: [],
            mainPhotoRemoved: false, 
          });
        } catch (error) {
          console.error('Error fetching product:', error);
          setFormError('Failed to load product data');
          navigate('/products');
        } finally {
          setLoading(false);
        }
      };
      
      fetchProduct();
    }
  }, [id, isEditMode, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSpecificationChange = (index: number, field: 'label' | 'value', value: string) => {
    const updated = [...formData.specifications];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, specifications: updated }));
  };

  const addSpecification = () => {
    setFormData((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { label: '', value: '' }]
    }));
  };

  const removeSpecification = (index: number) => {
    const updated = formData.specifications.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, specifications: updated }));
  };

  const removeExistingImage = (imageUrl: string) => {
    const filename = imageUrl.split('/').pop() || '';
    setFormData(prev => ({
      ...prev,
      galleryPhotoUrls: prev.galleryPhotoUrls.filter(url => url !== imageUrl),
      imagesToRemove: [...prev.imagesToRemove, filename]
    }));
  };

  const removeNewImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      galleryPhotos: prev.galleryPhotos.filter((_, i) => i !== index)
    }));
  };

  const removeExistingVideo = (videoUrl: string) => {
    const filename = videoUrl.split('/').pop() || '';
    setFormData(prev => ({
      ...prev,
      videoUrls: prev.videoUrls.filter(url => url !== videoUrl),
      videosToRemove: [...prev.videosToRemove, filename]
    }));
  };

  const removeNewVideo = (index: number) => {
    setFormData(prev => ({
      ...prev,
      videos: prev.videos.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    // For store users, only validate quantity
    if (isStoreUser) {
      const quantity = parseInt(formData.quantity);
      if (isNaN(quantity) || quantity < 0) {
        setFormError('Quantity must be a non-negative number');
        return false;
      }
      return true;
    }

    // Full validation for admin users
    if (!formData.name.trim()) return setFormError('Product name is required'), false;
    if (!formData.model.trim()) return setFormError('Model number is required'), false;
    if (!formData.description.trim()) return setFormError('Description is required'), false;
    if (!formData.categoryId.trim()) return setFormError('Category is required'), false;

    const price1 = parseFloat(formData.price1);
    const price2 = parseFloat(formData.price2);
    const price3 = parseFloat(formData.price3);
    const quantity = parseInt(formData.quantity);

    if (isNaN(price1) || price1 <= 0) return setFormError('Customer Price must be positive'), false;
    if (isNaN(price2) || price2 <= 0) return setFormError('Partner Price must be positive'), false;
    if (isNaN(price3) || price3 <= 0) return setFormError('Special Price must be positive'), false;
    if (isNaN(quantity) || quantity < 0) return setFormError('Quantity must be non-negative'), false;

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      // const token = localStorage.getItem('token');
      
      // Handle store user quantity update
      if (isStoreUser && isEditMode) {
        await axios.put(
          `${API_BASE_URL}/api/products/${id}/quantity`,
          { quantity: parseInt(formData.quantity) },
           { withCredentials: true } 
        );
        navigate('/products');
        return;
      }

      // Handle admin full product operations
      const productData = {
        title: formData.name,
        titleSub: formData.model,
        description: formData.description,
        about: formData.about,
        categoryId: formData.categoryId,
        price1: parseFloat(formData.price1),
        price2: parseFloat(formData.price2),
        price3: parseFloat(formData.price3),
        quantity: parseInt(formData.quantity),
        status: formData.status,
        specifications: JSON.stringify(formData.specifications),
      };

      const payload = new FormData();
      Object.entries(productData).forEach(([key, value]) => {
        payload.append(key, String(value));
      });

      if (formData.photo) payload.append('mainPhoto', formData.photo);
      formData.galleryPhotos.forEach((file) => payload.append('galleryPhotos', file));
      formData.videos.forEach((file) => payload.append('videos', file));

      if (isEditMode) {
        if (formData.imagesToRemove.length > 0) {
          payload.append('removeImages', JSON.stringify(formData.imagesToRemove));
        }
        if (formData.videosToRemove.length > 0) {
          payload.append('removeVideos', JSON.stringify(formData.videosToRemove));
        }
        
        await axios.put(`${API_BASE_URL}/api/products/${id}`, payload, { withCredentials: true ,
          headers: { 
            'Content-Type': 'multipart/form-data',
           
          },
        });
      } else {
        await addProduct(payload);
      }

      navigate('/products');
    } catch (err: any) {
      setFormError(err.response?.data?.error || err.message || 'Failed to submit form');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ width: '100%', backgroundColor: '#0b1727', minHeight: '100vh', py: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6" sx={{ color: '#fff' }}>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', backgroundColor: '#0b1727', minHeight: '100vh', py: 4 }}>
      <Paper sx={{ p: 4, maxWidth: 800, margin: 'auto', backgroundColor: '#162a45', color: '#ffffff' }}>
        {/* Header with role indicator */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ color: '#90caf9' }}>
            {isEditMode ? 'Edit Product' : 'Add New Product'}
          </Typography>
          <Chip 
            label={`Logged in as: ${userRole?.toUpperCase()}`} 
            color={userRole === 'admin' ? 'primary' : 'secondary'}
            icon={<EditIcon />}
          />
        </Box>

        {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Store User - Quantity Only */}
          { userRole !=='admin' ? (
            <>
              <Alert severity="info" sx={{ mb: 2 }}>
                As a store user, you can only update the product quantity.
              </Alert>

              <Box sx={{ mb: 2, p: 2, backgroundColor: '#1a3a5c', borderRadius: 1 }}>
                <Typography variant="h6" gutterBottom>Product Information</Typography>
                <Typography variant="body2">Name: {formData.name}</Typography>
                <Typography variant="body2">Model: {formData.model}</Typography>
                <Typography variant="body2">Current Quantity: {formData.quantity}</Typography>
              </Box>

              <TextField
                required
                name="quantity"
                label="Update Quantity"
                type="number"
                value={formData.quantity}
                onChange={handleChange}
                InputLabelProps={{ style: { color: '#fff' } }}
                InputProps={{ style: { color: '#fff' } }}
                helperText="Enter the new quantity for this product"
                sx={{ '& .MuiFormHelperText-root': { color: '#90caf9' } }}
              />
            </>
          ) : (
          <>
              <TextField 
                required 
                name="name" 
                label="Product Name" 
                value={formData.name} 
                onChange={handleChange} 
                InputLabelProps={{ style: { color: '#fff' } }}
                InputProps={{ style: { color: '#fff' } }}
              />
              
              <TextField 
                required 
                name="model" 
                label="Model Number" 
                value={formData.model} 
                onChange={handleChange} 
                InputLabelProps={{ style: { color: '#fff' } }}
                InputProps={{ style: { color: '#fff' } }}
              />
              
              <TextField 
                required 
                name="description" 
                label="Description" 
                multiline 
                rows={3} 
                value={formData.description} 
                onChange={handleChange} 
                InputLabelProps={{ style: { color: '#fff' } }}
                InputProps={{ style: { color: '#fff' } }}
              />

              <Box>
                <Typography variant="body1" sx={{ color: '#fff', mb: 1 }}>About This Item</Typography>
                <AboutEditor 
                  value={formData.about} 
                  onChange={(val) => setFormData({ ...formData, about: val })} 
                />
              </Box>

              <FormControl fullWidth>
                <InputLabel sx={{ color: '#fff' }}>Category</InputLabel>
                <Select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={(e) => setFormData((prev) => ({ ...prev, categoryId: e.target.value }))}
                  sx={{ color: '#fff' }}
                  inputProps={{ style: { color: '#fff' } }}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Divider sx={{ my: 2, backgroundColor: '#90caf9' }} />

              {/* Specifications Section */}
              <Box>
                <Typography variant="h6" sx={{ color: '#90caf9', mb: 2 }}>Specifications</Typography>
                {formData.specifications.map((spec, index) => (
                  <Box key={index} display="flex" gap={1} mb={1}>
                    <TextField 
                      label="Field" 
                      value={spec.label} 
                      onChange={(e) => handleSpecificationChange(index, 'label', e.target.value)} 
                      fullWidth 
                      InputLabelProps={{ style: { color: '#fff' } }}
                      InputProps={{ style: { color: '#fff' } }}
                    />
                    <TextField 
                      label="Value" 
                      value={spec.value} 
                      onChange={(e) => handleSpecificationChange(index, 'value', e.target.value)} 
                      fullWidth 
                      InputLabelProps={{ style: { color: '#fff' } }}
                      InputProps={{ style: { color: '#fff' } }}
                    />
                    <IconButton 
                      onClick={() => removeSpecification(index)}
                      sx={{ color: '#ff6b6b' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
                <Button 
                  variant="outlined" 
                  onClick={addSpecification} 
                  startIcon={<AddIcon />}
                  sx={{ mt: 1 }}
                >
                  Add Specification
                </Button>
              </Box>

              <Divider sx={{ my: 2, backgroundColor: '#90caf9' }} />

              {/* Media Upload Sections */}
              <Box>
                <Typography variant="h6" sx={{ color: '#90caf9', mb: 2 }}>Product Media</Typography>
                
                <Box mb={3}>
                  <Typography sx={{ color: '#fff', mb: 1 }}>Main Photo</Typography>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setFormData((prev) => ({ ...prev, photo: file }));
                    }} 
                  />
                  {formData.photoUrl && !formData.mainPhotoRemoved && (
                  <Box mt={1} position="relative" display="inline-block">
                    <Typography color="white" variant="body2" mb={1}>Current Main Photo:</Typography>
                    <img 
                      src={formData.photoUrl} 
                      alt="main" 
                      style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8 }} 
                    />
                    <IconButton
                      size="small"
                      onClick={() => setFormData(prev => ({ ...prev, photoUrl: '', mainPhotoRemoved: true }))}
                      sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        backgroundColor: 'rgba(255,0,0,0.7)',
                        color: 'white',
                        '&:hover': { backgroundColor: 'rgba(255,0,0,0.9)' }
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                )}

                </Box>

                {/* Gallery Photos Section */}
                <Box mb={3}>
                  <Typography sx={{ color: '#fff', mb: 1 }}>Gallery Photos</Typography>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files) {
                        setFormData((prev) => ({
                          ...prev,
                          galleryPhotos: [...prev.galleryPhotos, ...Array.from(files)]
                        }));
                      }
                    }}
                  />
                  
                  {/* Existing gallery photos */}
                  {formData.galleryPhotoUrls.length > 0 && (
                    <Box mt={2}>
                      <Typography color="white" variant="body2">Current Gallery Photos:</Typography>
                      <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                        {formData.galleryPhotoUrls.map((url, i) => (
                          <Box key={`existing-${i}`} position="relative">
                            <img
                              src={url}
                              alt={`existing-${i}`}
                              style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 6 }}
                            />
                            <IconButton
                              size="small"
                              onClick={() => removeExistingImage(url)}
                              sx={{ 
                                position: 'absolute', 
                                top: -5, 
                                right: -5, 
                                backgroundColor: 'rgba(255,0,0,0.7)',
                                color: 'white',
                                '&:hover': { backgroundColor: 'rgba(255,0,0,0.9)' }
                              }}
                            >
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  )}

                  {/* New gallery photos */}
                  {formData.galleryPhotos.length > 0 && (
                    <Box mt={2}>
                      <Typography color="white" variant="body2">New Photos to Upload:</Typography>
                      <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                        {formData.galleryPhotos.map((file, i) => (
                          <Box key={`new-${i}`} position="relative">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`new-${i}`}
                              style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 6 }}
                            />
                            <IconButton
                              size="small"
                              onClick={() => removeNewImage(i)}
                              sx={{ 
                                position: 'absolute', 
                                top: -5, 
                                right: -5, 
                                backgroundColor: 'rgba(255,0,0,0.7)',
                                color: 'white',
                                '&:hover': { backgroundColor: 'rgba(255,0,0,0.9)' }
                              }}
                            >
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  )}
                </Box>

                {/* Videos Section */}
                <Box mb={3}>
                  <Typography sx={{ color: '#fff', mb: 1 }}>Product Videos</Typography>
                  <input
                    type="file"
                    accept="video/*"
                    multiple
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files) setFormData((prev) => ({ ...prev, videos: [...prev.videos, ...Array.from(files)] }));
                    }}
                  />
                  
                  {/* Existing videos */}
                  {formData.videoUrls.length > 0 && (
                    <Box mt={2}>
                      <Typography color="white" variant="body2">Current Videos:</Typography>
                      <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                        {formData.videoUrls.map((url, i) => (
                          <Box key={`existing-video-${i}`} position="relative">
                            <video src={url} controls style={{ width: 150, height: 100, borderRadius: 6 }} />
                            <IconButton
                              size="small"
                              onClick={() => removeExistingVideo(url)}
                              sx={{ 
                                position: 'absolute', 
                                top: -5, 
                                right: -5, 
                                backgroundColor: 'rgba(255,0,0,0.7)',
                                color: 'white',
                                '&:hover': { backgroundColor: 'rgba(255,0,0,0.9)' }
                              }}
                            >
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  )}

                  {/* New videos */}
                  {formData.videos.length > 0 && (
                    <Box mt={2}>
                      <Typography color="white" variant="body2">New Videos to Upload:</Typography>
                      <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                        {formData.videos.map((file, i) => (
                          <Box key={`new-video-${i}`} position="relative">
                            <video src={URL.createObjectURL(file)} controls style={{ width: 150, height: 100, borderRadius: 6 }} />
                            <IconButton
                              size="small"
                              onClick={() => removeNewVideo(i)}
                              sx={{ 
                                position: 'absolute', 
                                top: -5, 
                                right: -5, 
                                backgroundColor: 'rgba(255,0,0,0.7)',
                                color: 'white',
                                '&:hover': { backgroundColor: 'rgba(255,0,0,0.9)' }
                              }}
                            >
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  )}
                </Box>
              </Box>

              <Divider sx={{ my: 2, backgroundColor: '#90caf9' }} />

              {/* Pricing and Inventory */}
              <Box>
                <Typography variant="h6" sx={{ color: '#90caf9', mb: 2 }}>Pricing & Inventory</Typography>
                <Box display="flex" gap={2} flexWrap="wrap">
                  <TextField 
                    required
                    name="price1" 
                    label="Customer Price" 
                    type="number" 
                    value={formData.price1} 
                    onChange={handleChange} 
                    InputLabelProps={{ style: { color: '#fff' } }}
                    InputProps={{ style: { color: '#fff' } }}
                    sx={{ minWidth: 180 }}
                  />
                  <TextField 
                    required
                    name="price2" 
                    label="Partner Price" 
                    type="number" 
                    value={formData.price2} 
                    onChange={handleChange} 
                    InputLabelProps={{ style: { color: '#fff' } }}
                    InputProps={{ style: { color: '#fff' } }}
                    sx={{ minWidth: 180 }}
                  />
                  <TextField 
                    required
                    name="price3" 
                    label="Special Price" 
                    type="number" 
                    value={formData.price3} 
                    onChange={handleChange} 
                    InputLabelProps={{ style: { color: '#fff' } }}
                    InputProps={{ style: { color: '#fff' } }}
                    sx={{ minWidth: 180 }}
                  />
                </Box>
              </Box>
              
              <TextField 
                required
                name="quantity" 
                label="Quantity" 
                type="number" 
                value={formData.quantity} 
                onChange={handleChange} 
                InputLabelProps={{ style: { color: '#fff' } }}
                InputProps={{ style: { color: '#fff' } }}
              />

              <FormControl>
                <FormLabel sx={{ color: '#fff' }}>Status</FormLabel>
                <RadioGroup row name="status" value={formData.status} onChange={handleChange}>
                  <FormControlLabel 
                    value="active" 
                    control={<Radio />} 
                    label="Active"
                    sx={{ color: '#fff' }}
                  />
                  <FormControlLabel 
                    value="inactive" 
                    control={<Radio />} 
                    label="Inactive"
                    sx={{ color: '#fff' }}
                  />
                </RadioGroup>
              </FormControl>
            </>
          )}

          {/* Submit Button */}
          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={loading}
              sx={{ minWidth: 150 }}
            >
              {loading ? 'Processing...' : (isEditMode ? (isStoreUser ? 'Update Quantity' : 'Update Product') : 'Add Product')}
            </Button>
            
            <Button 
              variant="outlined" 
              onClick={() => navigate('/products')}
              disabled={loading}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default ProductForm;