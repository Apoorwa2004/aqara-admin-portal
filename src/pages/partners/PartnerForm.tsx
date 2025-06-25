import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  FormControl,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  Radio,
  Alert,
} from '@mui/material';
import { usePartners } from '../../context/PartnerContext';

interface Partner {
  id?: string;
  firstName: string;
  email: string;
  phone: string;
  address: string;
  type: 'normal' | 'special';
  designation?: string;
  reffered?: string;
  companyName?: string;
  companyAddress?: string;
  companyWebsite?: string;
  city?: string;
  companyemail?: string;
  companyphone?: string;
  country?: string;
  businessphone?: string;
  expertise?: string;
  industries?: string;
  directorName?: string;
  directorEmail?: string;
  directorPhone?: string;
  directorWPhone?: string;
}

const PartnerForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { addPartner, updatePartner, getPartner } = usePartners();

  const [formError, setFormError] = useState<string | null>(null);
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState<Partner>({
    firstName: '',
    email: '',
    phone: '',
    address: '',
    type: 'normal'
  });

  useEffect(() => {
    if (isEditMode && id) {
      const partner = getPartner(id);
      if (partner) {
        setFormData(partner);
      } else {
        navigate('/partners');
      }
    }
  }, [id, isEditMode, getPartner, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) return setFormError('Partner name is required'), false;
    if (!formData.email.trim()) return setFormError('Email is required'), false;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return setFormError('Enter a valid email'), false;
    if (!formData.phone.trim()) return setFormError('Phone number is required'), false;
    if (!formData.address.trim()) return setFormError('Company name is required'), false;
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!validateForm()) return;

    try {
      if (isEditMode && id) {
        updatePartner(id, { ...formData, id });
      } else {
        addPartner(formData);
      }

      navigate('/partners');
    } catch (error) {
      setFormError('An error occurred while saving the partner');
      console.error(error);
    }
  };

  const fieldLabels: Record<string, string> = {
    firstName: 'Partner Name',
    email: 'Email',
    phone: 'Phone',
    address: 'partner address',
    designation: 'Designation',
    reffered: 'Referred By',
    companyName: 'Company Name',
    companyAddress: 'Company Address',
    companyWebsite: 'Company Website',
    city: 'City',
    companyemail: 'Company Email',
    companyphone: 'Company Phone',
    country: 'Country',
    businessphone: 'Business WhatsApp',
    expertise: 'Expertise',
    industries: 'Industries',
    directorName: 'Director Name',
    directorEmail: 'Director Email',
    directorPhone: 'Director Phone',
    directorWPhone: 'Director WhatsApp',
  };

  return (
    <Box sx={{ width: '100%', backgroundColor: '#0b1727', minHeight: '100vh', py: 4 }}>
      <Paper
        sx={{
          p: 4,
          maxWidth: 900,
          margin: 'auto',
          backgroundColor: '#162a45',
          color: '#ffffff',
          boxShadow: '0 0 20px rgba(0,0,0,0.4)',
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ color: '#90caf9' }}>
          {isEditMode ? 'Edit Partner' : 'Add New Partner'}
        </Typography>

        {formError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {formError}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'grid', gap: 2 }}>
          {Object.entries(fieldLabels).map(([key, label]) => (
            <TextField
              key={key}
              label={label}
              name={key}
              fullWidth
              value={(formData as any)[key] || ''}
              onChange={handleChange}
              InputLabelProps={{ style: { color: '#ccc' } }}
              InputProps={{ style: { color: '#fff' } }}
            />
          ))}

          <FormControl>
            <FormLabel sx={{ color: '#90caf9' }}>Partner Type</FormLabel>
            <RadioGroup row name="type" value={formData.type} onChange={handleChange}>
              <FormControlLabel value="normal" control={<Radio sx={{ color: '#90caf9' }} />} label="Normal Partner" />
              <FormControlLabel value="special" control={<Radio sx={{ color: '#90caf9' }} />} label="Special Partner" />
            </RadioGroup>
          </FormControl>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button variant="outlined" onClick={() => navigate('/partners')} color="inherit">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              {isEditMode ? 'Update Partner' : 'Add Partner'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default PartnerForm;
