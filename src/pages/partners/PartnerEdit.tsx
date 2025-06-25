import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Button, TextField, Typography, Paper, FormControl,
  FormControlLabel, FormLabel, RadioGroup, Radio, Alert
} from '@mui/material';
import { usePartners } from '../../context/PartnerContext';
import API_BASE_URL from '../../config/api'

const fieldLabels: Record<string, string> = {
  firstName: 'Partner Name',
  email: 'Email',
  phone: 'Phone',
  address: 'Company Name',
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

const PartnerEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPartner, updatePartner } = usePartners();
  const [formData, setFormData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPartner = async () => {
      const localPartner = getPartner(id!);
      if (localPartner) {
        setFormData(normalizeFromBackend(localPartner));
      } else {
        try {
          const res = await fetch(`${API_BASE_URL}/api/partner-form/submissions/${id}`);
          if (!res.ok) throw new Error('Failed to fetch from API');
          const data = await res.json();
          setFormData(normalizeFromBackend(data));
        } catch (err) {
          setError('Failed to load partner');
          console.error(err);
        }
      }
    };

    if (id) loadPartner();
  }, [id, getPartner]);

  const normalizeFromBackend = (data: any) => ({
    ...data,
    expertise: Array.isArray(data.expertise)
      ? data.expertise
      : data.expertise?.split(',') || [],
    industries: Array.isArray(data.industries)
      ? data.industries
      : data.industries?.split(',') || [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !formData) return;

    try {
      const payload = {
        ...formData,
        expertise: Array.isArray(formData.expertise)
          ? formData.expertise.join(',')
          : formData.expertise,
        industries: Array.isArray(formData.industries)
          ? formData.industries.join(',')
          : formData.industries,
      };

      await updatePartner(id, payload);
      navigate('/partners');
    } catch (err) {
      console.error(err);
      setError('Failed to update partner');
    }
  };

  if (!formData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <Typography variant="h6" color="textSecondary">Loading partner data...</Typography>
      </Box>
    );
  }

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
          Edit Partner
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'grid', gap: 2 }}>
          {Object.entries(fieldLabels).map(([key, label]) => (
            <TextField
              key={key}
              label={label}
              name={key}
              fullWidth
              value={
                Array.isArray(formData[key])
                  ? formData[key].join(', ')
                  : formData[key] || ''
              }
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
              Update Partner
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default PartnerEdit;
