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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { usePartners } from '../../context/PartnerContext';
import SearchBar from '../../components/UI/SearchBar';
import ConfirmDialog from '../../components/UI/ConfirmDialog';
import axios from 'axios';
import API_BASE_URL from '../../config/api'

const PartnerList: React.FC = () => {
  const navigate = useNavigate();
  const { partners, deletePartner, updatePartnerType, fetchPartners } = usePartners();
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [partnerToDelete, setPartnerToDelete] = useState<string | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<any>(null);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(0);
  };

  const handleChangePage = (_event: any, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteClick = (id: string) => {
    setPartnerToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
  if (partnerToDelete) {
    await deletePartner(partnerToDelete);
    fetchPartners(); // ✅ refresh list after deletion
    setDeleteDialogOpen(false);
    setPartnerToDelete(null);
  }
};


const handleVerifyPartner = async (partnerId: string) => {
  try {
    await axios.post(`${API_BASE_URL}/api/partner-form/verify-submission/${partnerId}`);
    alert('Partner verified and email sent!');
    window.location.reload(); // or call fetchPartners()
  } catch (err) {
    console.error('Verification failed:', err);
    alert('Verification failed');
  }
};
  const handlePartnerTypeChange = async (partnerId: string, newType: 'normal' | 'special') => {
    try {
      await updatePartnerType(partnerId, newType);
    } catch (err) {
      console.error('Failed to update partner type:', err);
      alert('Failed to update partner type.');
    }
  };

  const openDetailsDialog = async (partner: any) => {
    try {
      console.log("Fetching details for ID:", partner.id);
      const res = await axios.get(`${API_BASE_URL}/api/partner-form/submissions/${partner.id}`);
      setSelectedPartner(res.data);
      setDetailsDialogOpen(true);
    } catch (err: any) {
      console.error('❌ Failed to load full partner details:', err);
      alert('Full partner record not found. It may not have been submitted yet.');
    }
  };

  const filteredPartners = partners.filter((partner: any) =>
    (partner?.firstName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (partner?.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (partner?.phone || '').includes(searchQuery) ||
    (partner?.companyName || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedPartners = filteredPartners.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const fieldLabels: Record<string, string> = {
    firstName: 'Name',
    email: 'Email',
    phone: 'Phone',
    address: 'Address',
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
    directorWPhone: 'Director WhatsApp'
  };

  return (
    <Box sx={{ width: '100%', color: '#00bfff' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h1" sx={{ color: '#00bfff' }}>
          Partners
        </Typography>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => navigate('/partners/add')}
          sx={{ color: '#00bfff', borderColor: 'white', '&:hover': { backgroundColor: '#9370db', color: 'white' } }}
        >
          Add Partner
        </Button>
      </Box>

      <SearchBar onSearch={handleSearch} placeholder="Search partners..." />

      <TableContainer component={Paper} sx={{ backgroundColor: '#1e1e1e' }}>
        <Table sx={{ minWidth: 750 }} aria-label="partner table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: '#00bfff' }}>Name</TableCell>
              <TableCell sx={{ color: '#00bfff' }}>Email</TableCell>
              <TableCell sx={{ color: '#00bfff' }}>Phone</TableCell>
              <TableCell sx={{ color: '#00bfff' }}>Company Name</TableCell>
              <TableCell sx={{ color: '#00bfff' }}>Partner Type</TableCell>
              <TableCell sx={{ color: '#00bfff' }}>Status</TableCell>
              <TableCell sx={{ color: '#00bfff' }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedPartners.length > 0 ? (
              displayedPartners.map((partner: any) => (
                <TableRow key={partner.id}>
                  <TableCell sx={{ color: '#e0e0e0' }}>{partner.firstName}</TableCell>
                  <TableCell sx={{ color: '#e0e0e0' }}>{partner.email}</TableCell>
                  <TableCell sx={{ color: '#e0e0e0' }}>{partner.phone}</TableCell>
                  <TableCell sx={{ color: '#e0e0e0' }}>{partner.companyName}</TableCell>
                  <TableCell>
                    <FormControl variant="outlined" size="small" fullWidth>
                      <Select
                        value={partner.type || 'normal'}
                        onChange={(e) => handlePartnerTypeChange(partner.id, e.target.value as 'normal' | 'special')}
                        sx={{ 
                          color: '#fff',
                          '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#00bfff' },
                        }}
                      >
                        <MenuItem value="normal">Normal</MenuItem>
                        <MenuItem value="special">Special</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell align="center">
                    {partner.verified ? (
                      <Chip label="Verified" color="success" size="small" />
                    ) : (
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleVerifyPartner(partner.id)}
                        sx={{ color: '#4caf50', borderColor: '#4caf50' }}
                      >
                        Verify
                      </Button>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => openDetailsDialog(partner)} sx={{ color: '#00bcd4' }}>
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton onClick={() => navigate(`/partners/edit/${partner.id}`)} sx={{ color: '#90caf9' }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteClick(partner.id)} sx={{ color: '#ef5350' }}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ color: '#aaa' }}>
                  No partners found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredPartners.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ color: '#f5f5f5' }}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Partner"
        message="Are you sure you want to delete this partner? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialogOpen(false)}
      />

      <Dialog open={detailsDialogOpen} onClose={() => setDetailsDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: '#1e1e1e', color: '#00bfff' }}>Partner Details</DialogTitle>
        <DialogContent dividers sx={{ bgcolor: '#1e1e1e' }}>
          {selectedPartner && (
            <Box sx={{ color: '#e0e0e0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              {Object.entries(fieldLabels).map(([key, label]) => (
                <Typography key={key} sx={{ mb: 1 }}>
                  <Box component="span" fontWeight="bold" sx={{ color: '#90caf9' }}>{label}: </Box>
                  {Array.isArray(selectedPartner[key]) || (typeof selectedPartner[key] === 'string' && selectedPartner[key].includes(','))
                    ? (Array.isArray(selectedPartner[key]) ? selectedPartner[key] : selectedPartner[key].split(',')).join(', ')
                    : selectedPartner[key] ?? '-'}
                </Typography>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ bgcolor: '#1e1e1e' }}>
          <Button 
            onClick={() => setDetailsDialogOpen(false)}
            sx={{ color: '#00bfff' }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PartnerList;