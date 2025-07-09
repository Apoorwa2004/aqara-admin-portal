import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'
import React from 'react'


// Pages & Components
import Layout from './components/Layout/Layout'
import HomePage from './pages/Home'
import ProductList from './pages/products/ProductList'
import ProductForm from './pages/products/ProductForm'
import PartnerList from './pages/partners/PartnerList'
import PartnerForm from './pages/partners/PartnerForm'
import ContactUs from './pages/ContactUs'
import Quotations from './pages/Quotations'
import Orders from './pages/Orders'
import Categories from './pages/Categories'
import Login from './pages/Login'
import EditPartner from './pages/partners/PartnerEdit'
import UpdateQuantityPage from './pages/products/UpdateQuantityPage';


// Context Providers
import { ProductProvider } from './context/ProductContext'
import { PartnerProvider } from './context/PartnerContext'
import { CategoryProvider } from './context/CategoryContext'
import { AuthProvider, useAuth } from './context/AuthContext' 
import { QuotationProvider } from './context/QuotationContext'


const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
    background: { default: '#f5f5f5' },
  },
})

// ✅ Authenticated Layout wrapper using `useAuth`
const AuthenticatedLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Layout>{children}</Layout>
}

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <CategoryProvider>
          <ProductProvider>
            <PartnerProvider>
              <QuotationProvider>
              <BrowserRouter>
                <Box sx={{ display: 'flex', minHeight: '100vh' }}>
                  <Routes>
                    {/* Public Route */}
                    <Route path="/login" element={<Login />} />

                    {/* Protected Routes */}
                    <Route
                      path="/"
                      element={
                        <AuthenticatedLayout>
                          <HomePage />
                        </AuthenticatedLayout>
                      }
                    />
                    <Route
                      path="/products"
                      element={
                        <AuthenticatedLayout>
                          <ProductList />
                        </AuthenticatedLayout>
                      }
                    />
                    <Route
                      path="/products/add"
                      element={
                        <AuthenticatedLayout>
                          <ProductForm />
                        </AuthenticatedLayout>
                      }
                    />
                    <Route
                      path="/products/edit/:id"
                      element={
                        <AuthenticatedLayout>
                          <ProductForm />
                        </AuthenticatedLayout>
                      }
                    />
                    <Route
                      path="/partners"
                      element={
                        <AuthenticatedLayout>
                          <PartnerList />
                        </AuthenticatedLayout>
                      }
                    />
                    <Route
                      path="/partners/add"
                      element={
                        <AuthenticatedLayout>
                          <PartnerForm />
                        </AuthenticatedLayout>
                      }
                    />
                    <Route
                      path="/partners/edit/:id"
                      element={
                        <AuthenticatedLayout>
                          <EditPartner />
                        </AuthenticatedLayout>
                      }
                    />
                    <Route
                      path="/products/update-quantity/:id"
                      element={
                        <AuthenticatedLayout>
                          <UpdateQuantityPage />
                        </AuthenticatedLayout>
                      }
                    />
                    <Route
                      path="/contact-us"
                      element={
                        <AuthenticatedLayout>
                          <ContactUs />
                        </AuthenticatedLayout>
                      }
                    />
                    <Route
                      path="/quotations"
                      element={
                        <AuthenticatedLayout>
                          <Quotations />
                        </AuthenticatedLayout>
                      }
                    />
                    <Route
                      path="/orders"
                      element={
                        <AuthenticatedLayout>
                          <Orders />
                        </AuthenticatedLayout>
                      }
                    />
                    <Route
                      path="/categories"
                      element={
                        <AuthenticatedLayout>
                          <Categories />
                        </AuthenticatedLayout>
                      }
                    />

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Box>
              </BrowserRouter>
              </QuotationProvider>
            </PartnerProvider>
          </ProductProvider>
        </CategoryProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
