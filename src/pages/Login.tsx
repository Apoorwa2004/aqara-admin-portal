import React, { useState } from 'react'
import { useNavigate, useLocation, Navigate } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Alert,
} from '@mui/material'
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { useAuth } from '../context/AuthContext';


const Login: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isAuthenticated } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false);
  const from = location.state?.from?.pathname || '/'

  if (isAuthenticated) {
    return <Navigate to={from} replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const success = await login(email, password)
      if (success) {
        navigate(from, { replace: true })
      } else {
        setError('Invalid email or password')
      }
    } catch {
      setError('An error occurred during login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        backgroundColor: '#0b1727',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Left Side: Image and Welcome Text */}
      <Box
        sx={{
          flex: 1,
          color: '#fff',
          textAlign: 'center',
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/295/295128.png"
          alt="Login Visual"
          style={{ width: '150px', marginBottom: '2rem' }}
        />
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, color: '#00bfff' }}>
          Welcome to Aqara Portal
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: 400, color: '#ccc' }}>
          Manage products, categories, partners, and more in one secure place.
        </Typography>
      </Box>

      {/* Right Side: Login Form */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: 4,
          width: '100%',
        }}
      >
        <Paper
          elevation={5}
          sx={{
            p: 4,
            width: '100%',
            maxWidth: 400,
            backgroundColor: '#162a45',
            color: '#fff',
            borderRadius: 3,
          }}
        >
          <Typography
            component="h1"
            variant="h5"
            align="center"
            gutterBottom
            sx={{ color: '#00bfff', fontWeight: 'bold' }}
          >
            Aqara Portal Login
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              fullWidth
              required
              label="Email Address"
              margin="normal"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputLabelProps={{ style: { color: '#ccc' } }}
              InputProps={{
                style: { color: '#fff' },
                sx: {
                  '&:-webkit-autofill': {
                    boxShadow: '0 0 0 1000px #162a45 inset',
                    WebkitTextFillColor: '#fff',
                  },
                },
              }}
            />

            <TextField
              fullWidth
              required
              label="Password"
              margin="normal"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputLabelProps={{ style: { color: '#ccc' } }}
              InputProps={{
                style: { color: '#fff' },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                      sx={{ color: '#00bfff' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  '&:-webkit-autofill': {
                    boxShadow: '0 0 0 1000px #162a45 inset',
                    WebkitTextFillColor: '#fff',
                  },
                },
              }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  sx={{ color: '#00bfff' }}
                />
              }
              label="Remember me"
              sx={{ color: '#ccc' }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                backgroundColor: '#00bfff',
                '&:hover': { backgroundColor: '#009ee0' },
              }}
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </Box>

          <Typography variant="body2" align="center" sx={{ mt: 2, color: '#aaa' }}>
            Demo credentials: <strong>admin@example.com / password</strong>
          </Typography>
        </Paper>
      </Box>
    </Box>
  )
}

export default Login
