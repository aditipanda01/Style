import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      loadUserProfile();
    }
  }, [token]);

  const loadUserProfile = async () => {
    if (!token) return;
    
    try {
      const response = await fetch('http://localhost:5000/api/users/profile', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.data);
      } else {
        console.log('Invalid token, clearing...');
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      console.log('🔐 Attempting login...');
      
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          email: email.trim().toLowerCase(), 
          password 
        })
      });
      
      const data = await response.json();
      console.log('📨 Login response:', data);
      
      if (response.ok && data.success) {
        console.log('✅ Login successful!');
        setToken(data.data.token);
        setUser(data.data.user);
        localStorage.setItem('token', data.data.token);
        return { success: true, user: data.data.user };
      } else {
        console.error('❌ Login failed:', data.error);
        return { 
          success: false, 
          error: data.error?.message || 'Login failed. Please check your credentials.' 
        };
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      return { 
        success: false, 
        error: 'Network error. Please check your connection and try again.' 
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      console.log('📝 Attempting registration...');
      console.log('📤 User data:', userData);
      
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      
      const data = await response.json();
      console.log('📨 Registration response:', data);
      
      if (response.ok && data.success) {
        console.log('✅ Registration successful!');
        setToken(data.data.token);
        setUser(data.data.user);
        localStorage.setItem('token', data.data.token);
        return { success: true, user: data.data.user };
      } else {
        console.error('❌ Registration failed:', data.error);
        
        let errorMessage = 'Registration failed. Please try again.';
        
        if (data.error?.details && Array.isArray(data.error.details)) {
          errorMessage = data.error.details.map(d => d.message).join(', ');
        } else if (data.error?.message) {
          errorMessage = data.error.message;
        }
        
        return { 
          success: false, 
          error: errorMessage 
        };
      }
    } catch (error) {
      console.error('❌ Registration error:', error);
      return { 
        success: false, 
        error: 'Network error. Please check your connection and try again.' 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    console.log('👋 Logging out...');
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setUser(data.data);
        return { success: true, user: data.data };
      } else {
        return { 
          success: false, 
          error: data.error?.message || 'Failed to update profile' 
        };
      }
    } catch (error) {
      console.error('Profile update error:', error);
      return { 
        success: false, 
        error: 'Network error. Please try again.' 
      };
    }
  };

  const refreshProfile = async () => {
    if (token) {
      await loadUserProfile();
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateProfile,
    refreshProfile,
    isAuthenticated: !!user,
    isCompany: user?.userType === 'company',
    isIndividual: user?.userType === 'individual'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;