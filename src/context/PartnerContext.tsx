import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api'
import { useAuth } from './AuthContext';


export type PartnerType = 'normal' | 'special';

export interface Partner {
  id: string;
  firstName: string;
  email: string;
  phone: string;
  address: string;
  companyAddress?: string;
  type: PartnerType;
  verified?: boolean;
  [key: string]: any;
}

interface PartnerContextType {
  partners: Partner[];
  fetchPartners: () => void;
  deletePartner: (id: string) => void;
  getPartner: (id: string) => Partner | undefined;
  updatePartnerType: (id: string, type: PartnerType) => Promise<void>;
  addPartner: (partner: Omit<Partner, 'id'>) => Promise<void>;
  updatePartner: (id: string, partner: Partner) => Promise<void>;
}

const PartnerContext = createContext<PartnerContextType | undefined>(undefined);

export const usePartners = () => {
  const context = useContext(PartnerContext);
  if (!context) {
    throw new Error('usePartners must be used within a PartnerProvider');
  }
  return context;
};

interface PartnerProviderProps {
  children: ReactNode;
}

export const PartnerProvider: React.FC<PartnerProviderProps> = ({ children }) => {
  const [partners, setPartners] = useState<Partner[]>([]);

  const fetchPartners = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/partner-form/submissions`);
      setPartners(response.data);
    } catch (err) {
      console.error('Failed to fetch partners:', err);
    }
  };

  const deletePartner = async (id: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/partner-form/submissions/${id}`);
      fetchPartners();
    } catch (err) {
      console.error('Failed to delete partner:', err);
    }
  };

  const getPartner = (id: string) => partners.find(p => p.id === id);

  const updatePartnerType = async (id: string, type: PartnerType) => {
    try {
      await axios.patch(`${API_BASE_URL}/api/partner-form/submissions/${id}/type`, { type });
      fetchPartners();
    } catch (error) {
      console.error("Failed to update partner type:", error);
      throw error;
    }
  };

  const addPartner = async (newPartner: Omit<Partner, 'id'>) => {
  try {
    await axios.post(`${API_BASE_URL}/api/partner-form/admin-submit`, newPartner);
    fetchPartners(); // refresh list
  } catch (err) {
    console.error('Failed to add partner:', err);
  }
};

 const updatePartner = async (id: string, partner: Partner) => {
  try {
    await axios.put(`${API_BASE_URL}/api/partner-form/submissions/${id}`, partner);
    fetchPartners(); // Refresh the list
  } catch (error) {
    console.error('Failed to update partner:', error);
  }
};

const { isAuthenticated } = useAuth();
  useEffect(() => {
  if (isAuthenticated) {
    fetchPartners();
  }
}, [isAuthenticated]);


  return (
    <PartnerContext.Provider
      value={{
        partners,
        fetchPartners,
        deletePartner,
        getPartner,
        updatePartnerType,
        addPartner,
        updatePartner,
      }}
    >
      {children}
    </PartnerContext.Provider>
  );
};
