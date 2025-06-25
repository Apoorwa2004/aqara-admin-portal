import React, { useEffect, useState } from 'react';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Chip, Alert
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import IconButton from '@mui/material/IconButton';
import API_BASE_URL from '../config/api'

interface QuotationItem {
  productId?: string | number;
  title: string;
  quantity: number;
  price: string | number;
  model?: string;
}

type Quotation = {
  id: number;
  name: string;
  userType: 'customer' | 'normal' | 'special';
  phone: string;
  company?: string;
  partner?: {
    company?: string;
    address?: string;
  };
  customer?: {
    address?: string;
  };
  items: QuotationItem[];
  quotationPdfPath?: string; // ✅ Added this field
};

const QuotationList: React.FC = () => {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuotations = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/api/quotations`);
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        console.log('Fetched quotations:', data);
        setQuotations(data);
        setError(null);
      } catch (err) {
        console.error('Failed to load quotations', err);
        setError('Failed to load quotations. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuotations();
  }, []);

  const handleViewPDF = (quotation: Quotation) => {
    if (!quotation.quotationPdfPath) {
      alert('⚠️ PDF not available for this quotation.');
      return;
    }

    try {
      // Open PDF in new tab
      const pdfUrl = `${API_BASE_URL}/${quotation.quotationPdfPath}`;
      window.open(pdfUrl, '_blank');
    } catch (err) {
      console.error('Error opening PDF:', err);
      alert('❌ Failed to open PDF. Please try again.');
    }
  };

  const handleDownloadPDF = async (quotation: Quotation) => {
    if (!quotation.quotationPdfPath) {
      alert('⚠️ PDF not available for this quotation.');
      return;
    }

    try {
      const pdfUrl = `${API_BASE_URL}/${quotation.quotationPdfPath}`;
      
      // Create a temporary link element for download
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `quotation_${quotation.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error downloading PDF:', err);
      alert('❌ Failed to download PDF. Please try again.');
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <p style={{ color: '#00bfff' }}>Loading quotations...</p>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, color: '#00bfff' }}>
      <TableContainer component={Paper} sx={{ backgroundColor: '#1e1e1e' }}>
        <Table sx={{ minWidth: 750 }} aria-label="quotation table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: '#00bfff' }}>ID</TableCell>
              <TableCell sx={{ color: '#00bfff' }}>Name</TableCell>
              <TableCell sx={{ color: '#00bfff' }}>User Type</TableCell>
              <TableCell sx={{ color: '#00bfff' }}>Phone</TableCell>
              <TableCell sx={{ color: '#00bfff' }}>Company</TableCell>
              <TableCell sx={{ color: '#00bfff' }}>PDF Status</TableCell>
              <TableCell sx={{ color: '#00bfff' }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {quotations.length > 0 ? (
              quotations.map((q) => (
                <TableRow key={q.id}>
                  <TableCell sx={{ color: '#e0e0e0' }}>{q.id}</TableCell>
                  <TableCell sx={{ color: '#e0e0e0' }}>{q.name}</TableCell>
                  <TableCell>
                    <Chip
                      label={
                        q.userType === 'normal'
                          ? 'Normal Partner'
                          : q.userType === 'special'
                            ? 'Special Partner'
                            : 'Customer'
                      }
                      sx={{
                        backgroundColor:
                          q.userType === 'special'
                            ? '#d32f2f'
                            : q.userType === 'normal'
                              ? '#0288d1'
                              : '#7cb342',
                        color: '#fff',
                        fontWeight: 'bold'
                      }}
                      size="small"
                    />
                  </TableCell>
                  <TableCell sx={{ color: '#e0e0e0' }}>{q.phone}</TableCell>
                  <TableCell sx={{ color: '#e0e0e0' }}>{q.company || '-'}</TableCell>
                  <TableCell>
                    <Chip
                      label={q.quotationPdfPath ? 'Available' : 'Not Generated'}
                      sx={{
                        backgroundColor: q.quotationPdfPath ? '#4caf50' : '#f44336',
                        color: '#fff',
                        fontSize: '0.75rem'
                      }}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      onClick={() => handleViewPDF(q)}
                      sx={{
                        color: q.quotationPdfPath ? '#2196f3' : '#90a4ae', // blue or greyed out
                        '&:hover': {
                          color: q.quotationPdfPath ? '#1976d2' : '#90a4ae'
                        }
                      }}
                      disabled={!q.quotationPdfPath}
                      title={q.quotationPdfPath ? 'View PDF' : 'PDF not available'}
                    >
                      <VisibilityIcon />
                    </IconButton>

                    <IconButton
                      onClick={() => handleDownloadPDF(q)}
                      sx={{
                        color: q.quotationPdfPath ? '#2196f3' : '#90a4ae', // same blue or greyed out
                        '&:hover': {
                          color: q.quotationPdfPath ? '#1565c0' : '#90a4ae'
                        }
                      }}
                      disabled={!q.quotationPdfPath}
                      title={q.quotationPdfPath ? 'Download PDF' : 'PDF not available'}
                    >
                      <DownloadIcon />
                    </IconButton>

                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ color: '#aaa' }}>
                  No quotations found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default QuotationList;