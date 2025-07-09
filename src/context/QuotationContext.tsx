import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api'
import { useAuth } from './AuthContext';


// Define quotation type
interface Quotation {
  id: number;
  name: string;
  email: string;
  phone: string;
  userType: string;
  company: string;
  items: any[]; // Replace with a proper item type if you have one
}

// Define context value shape
interface QuotationContextType {
  quotations: Quotation[];
  fetchQuotations: () => Promise<void>;
}

// ✅ Default value for createContext
const QuotationContext = createContext<QuotationContextType>({
  quotations: [],
  fetchQuotations: async () => {},
});

// Custom hook
export const useQuotations = () => useContext(QuotationContext);

// Provider
export const QuotationProvider = ({ children }: { children: ReactNode }) => {
  const [quotations, setQuotations] = useState<Quotation[]>([]);

  const fetchQuotations = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/quotations`);
      setQuotations(res.data);
    } catch (error) {
      console.error('❌ Failed to load quotations', error);
    }
  };

  const { isAuthenticated } = useAuth();

  useEffect(() => {
  if (isAuthenticated) {
    fetchQuotations();
  }
}, [isAuthenticated]);

  return (
    <QuotationContext.Provider value={{ quotations, fetchQuotations }}>
      {children}
    </QuotationContext.Provider>
  );
};
