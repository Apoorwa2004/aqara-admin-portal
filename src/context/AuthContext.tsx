// import React, { useEffect, useState, createContext, useContext } from 'react'
// import axios from 'axios'
// import API_BASE_URL from '../config/api'

// interface AuthContextType {
//   isAuthenticated: boolean
//   login: (email: string, password: string) => Promise<boolean>
//   logout: () => void
//   user: User | null
// }

// interface User {
//   id: number
//   email: string
//   name: string
//   role: string
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined)

// export const useAuth = () => {
//   const context = useContext(AuthContext)
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider')
//   }
//   return context
// }

// interface AuthProviderProps {
//   children: React.ReactNode
// }

// export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false)
//   const [user, setUser] = useState<User | null>(null)

//   // Load user from localStorage on mount and validate token
//   useEffect(() => {
//     const storedUser = localStorage.getItem('user')
//     const storedToken = localStorage.getItem('token')
    
//     if (storedUser && storedToken) {
//       try {
//         const parsedUser = JSON.parse(storedUser)
//         setUser(parsedUser)
//         setIsAuthenticated(true)
        
//         // Optional: Validate token with backend
//         validateToken(storedToken)
//       } catch (error) {
//         console.error('Error parsing stored user data:', error)
//         // Clear invalid data
//         logout()
//       }
//     }
//   }, [])

//   // Optional: Validate token with backend
//   const validateToken = async (token: string) => {
//     try {
//       await axios.get(`${API_BASE_URL}/api/admin/validate-token`, { withCredentials: true })
//     } catch (error) {
//       console.error('Token validation failed:', error)
//       // Token is invalid, logout user
//       logout()
//     }
//   }

//   const login = async (email: string, password: string): Promise<boolean> => {
//     try {
//       const res = await axios.post(`${API_BASE_URL}/api/admin/login`,
//        { email,
//         password },
//         { withCredentials: true }
//       );

//       const userData = res.data.user;
//       const token = res.data.token;

//       // Save both user and token to localStorage
//       localStorage.setItem('user', JSON.stringify(userData));
//       localStorage.setItem('token', token);

//       setUser(userData);
//       setIsAuthenticated(true);
//       return true;
//     } catch (error) {
//       console.error('Login failed:', error);
//       return false;
//     }
//   };

//   const logout = () => {
//     setUser(null)
//     setIsAuthenticated(false)
//     // ✅ Remove BOTH user and token from localStorage
//     localStorage.removeItem('user')
//     localStorage.removeItem('token')
//   }

//   return (
//     <AuthContext.Provider
//       value={{
//         isAuthenticated,
//         login,
//         logout,
//         user,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   )
// }

import React, { useEffect, useState, createContext, useContext } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  user: User | null;
}

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // ✅ Load user from localStorage and validate session (using cookie)
  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        validateSession(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        logout();
      }
    }
  }, []);

  // ✅ Validate session using cookie
  const validateSession = async (parsedUser: User) => {
    try {
      await axios.get(`${API_BASE_URL}/api/admin/validate-token`, {
        withCredentials: true,
      });
      setUser(parsedUser);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Token/session validation failed:', error);
      logout();
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/admin/login`,
        { email, password },
        { withCredentials: true } // cookie will be automatically set
      );

      const userData = res.data.user;

      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    // Optionally: Tell backend to clear the cookie
    axios.post(`${API_BASE_URL}/api/admin/logout`, {}, { withCredentials: true }).catch(() => {});
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};
