import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from '@mui/material';
import API_BASE_URL from '../config/api'

// ✅ Define the type for each contact submission
interface ContactSubmission {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  comment: string;
  submissionDate: string;
}

const ContactUsAdmin: React.FC = () => {
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/contact`) // 🔁 Update this if hosted remotely
      .then((res) => {
        setContactSubmissions(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('❌ Failed to fetch contact submissions:', err);
        setLoading(false);
      });
  }, []);

  return (
    <Box sx={{ width: '100%', color: '#00bfff' }}>
      <Typography variant="h5" gutterBottom sx={{ color: '#00bfff', mb: 3 }}>
        Contact Submissions
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ backgroundColor: '#1e1e1e' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#00bfff' }}>First Name</TableCell>
                <TableCell sx={{ color: '#00bfff' }}>Last Name</TableCell>
                <TableCell sx={{ color: '#00bfff' }}>Email</TableCell>
                <TableCell sx={{ color: '#00bfff' }}>Phone</TableCell>
                <TableCell sx={{ color: '#00bfff' }}>Company</TableCell>
                <TableCell sx={{ color: '#00bfff' }}>Message</TableCell>
                <TableCell sx={{ color: '#00bfff' }}>Submitted At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contactSubmissions.map((entry, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ color: '#e0e0e0' }}>{entry.firstName}</TableCell>
                  <TableCell sx={{ color: '#e0e0e0' }}>{entry.lastName}</TableCell>
                  <TableCell sx={{ color: '#e0e0e0' }}>{entry.email}</TableCell>
                  <TableCell sx={{ color: '#e0e0e0' }}>{entry.phone || 'N/A'}</TableCell>
                  <TableCell sx={{ color: '#e0e0e0' }}>{entry.company || 'N/A'}</TableCell>
                  <TableCell sx={{ color: '#e0e0e0' }}>{entry.comment}</TableCell>
                  <TableCell sx={{ color: '#e0e0e0' }}>
                    {new Date(entry.submissionDate).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default ContactUsAdmin;
