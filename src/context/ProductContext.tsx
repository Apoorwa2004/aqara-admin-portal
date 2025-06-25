import axios from 'axios';
import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import API_BASE_URL from '../config/api'


export interface Product {
  id: string;
  name: string;
  model: string;
  description: string;
  about?: string;
  categoryId: string;
  price1: number;
  price2: number;
  price3: number;
  quantity: number;
  status: 'active' | 'inactive';
  specifications?: { label: string; value: string }[];
  photo?: string | null;
  galleryPhotos?: string[];
  videos?: string[];
  createdAt: Date;
}

interface ProductContextType {
  products: Product[];
  fetchProducts: () => void;
  addProduct: (formData: FormData) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateProductQuantity: (id: string, quantity: number) => void;
  getProduct: (id: string) => Product | undefined;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

interface ProductProviderProps {
  
  children: ReactNode;
}

export const ProductProvider: React.FC<ProductProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const isStore = user?.role === 'store';

  const [products, setProducts] = useState<Product[]>([]);
  
  const fetchProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/products`);
    const dbProducts = response.data.map((p: any) => {
      const parseJsonField = (field: any, fallback: any) => {
        if (!field) return fallback;
        try {
          return typeof field === 'string' ? JSON.parse(field) : field;
        } catch {
          return fallback;
        }
      };

      const imageUrls = parseJsonField(p.imageUrls, []);
      const videoUrls = parseJsonField(p.videoUrls, []);
      const specifications = parseJsonField(p.specifications, []);

      return {
        id: p.id.toString(),
        name: p.title || '',
        model: p.titleSub || '',
        description: p.description || '',
        about: p.about || '',
        price1: p.price1 || 0,
        price2: p.price2 || 0,
        price3: p.price3 || 0,
        quantity: p.quantity || 0,
        status: p.status || 'inactive',
        categoryId: p.categoryId?.toString() || '',
        photo: p.mainPhoto ? `${API_BASE_URL}/uploads/${p.mainPhoto}` : null,
        galleryPhotos: imageUrls.map((f: string) => `${API_BASE_URL}/uploads/${f}`),
        videos: videoUrls.map((f: string) => `${API_BASE_URL}/uploads/${f}`),
        specifications,
        createdAt: new Date(p.createdAt),
      };
    });

    setProducts(dbProducts);
  } catch (error) {
    console.error('❌ Error fetching products:', error);
  }
};


  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = async (formData: FormData) => {
    try {
      await axios.post(`${API_BASE_URL}/api/products`, formData, {
        withCredentials: true 
      });
      await fetchProducts();
      console.log('✅ Product added and list refreshed');
    } catch (error) {
      console.error('❌ Error adding product:', error);
    }
  };

  const updateProduct = async (id: string, updatedData: Partial<Product>) => {
  const keys = Object.keys(updatedData);
  const isStoreTryingToUpdateStatus = keys.includes('status');
  const isStoreTryingToUpdateMoreThanQuantity = keys.some(k => k !== 'quantity');

  if (isStore && (isStoreTryingToUpdateStatus || isStoreTryingToUpdateMoreThanQuantity)) {
    console.warn('❌ Store users are not allowed to update status or other fields.');
    return;
  }

  try {
    await axios.put(`${API_BASE_URL}/api/products/${id}`, updatedData, {  withCredentials: true ,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    await fetchProducts();
    console.log('✅ Product updated');
  } catch (error) {
    console.error('❌ Error updating product:', error);
  }
};


  const deleteProduct = async (id: string) => {
  if (isStore) {
    console.warn('❌ Store users are not allowed to delete products.');
    return;
  }

  try {
    await axios.delete(`${API_BASE_URL}/api/products/${id}`, {withCredentials: true ,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    await fetchProducts();
    console.log('✅ Product deleted');
  } catch (error) {
    console.error('❌ Error deleting product:', error);
  }
};

  const updateProductQuantity = async (id: string, quantity: number) => {
  await axios.put(`${API_BASE_URL}/api/products/${id}/quantity`, { quantity }, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
};



  const getProduct = (id: string) => {
    return products.find((product) => product.id === id);
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        fetchProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        getProduct,
        updateProductQuantity,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
