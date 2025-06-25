import  { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import axios from 'axios'; 
import API_BASE_URL from '../config/api'

export interface Category {
  id: string;
  name: string;
}

interface CategoryContextType {
  categories: Category[];
  addCategory: (name: string) => Promise<void>;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const useCategories = () => {
  const context = useContext(CategoryContext);
  if (!context) throw new Error('useCategories must be used within a CategoryProvider');
  return context;
};

export const CategoryProvider = ({ children }: { children: ReactNode }) => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const addCategory = async (name: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/categories`, { name });
      setCategories(prev => [...prev, response.data]);
    } catch (error) {
      console.error('Failed to add category:', error);
    }
  };

  return (
    <CategoryContext.Provider value={{ categories, addCategory }}>
      {children}
    </CategoryContext.Provider>
  );
};
