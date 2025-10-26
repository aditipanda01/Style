import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const EnhancedAuth = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [userType, setUserType] = useState('individual');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    // Individual fields
    firstName: '',
    lastName: '',
    username: '',
    bio: '',
    location: '',
    // Company fields
    companyName: '',
    companyAddress: {
      street: '',
      city: '',
      state: '',
      country: '',
      zipCode: ''
    },
    companyDescription: '',
    website: '',
    establishedYear: ''
  });

  const { login, register, loading, error } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('companyAddress.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        companyAddress: {
          ...prev.companyAddress,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSignup) {
      // Validation for signup
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }

      if (formData.password.length < 6) {
        toast.error('Password must be at least 6 characters');
        return;
      }

      if (!formData.phone.startsWith('+')) {
        toast.error('Phone number must include country code (e.g., +1234567890)');
        return;
      }

      // Prepare registration data
      const registrationData = {
        userType,
        email: formData.email,
        password: formData.password,
        phone: formData.phone
      };

      if (userType === 'individual') {
        registrationData.firstName = formData.firstName;
        registrationData.lastName = formData.lastName;
        registrationData.username = formData.username;
        if (formData.bio) registrationData.bio = formData.bio;
        if (formData.location) registrationData.location = formData.location;
      } else {
        registrationData.companyName = formData.companyName;
        registrationData.companyAddress = formData.companyAddress;
        if (formData.companyDescription) registrationData.companyDescription = formData.companyDescription;
        if (formData.website) registrationData.website = formData.website;
        if (formData.establishedYear) registrationData.establishedYear = parseInt(formData.establishedYear);
      }

      const result = await register(registrationData);
      if (result.success) {
        toast.success('Registration successful! Welcome to The Runway!');
      } else {
        toast.error(result.error);
      }
    } else {
      // Login
      const result = await login(formData.email, formData.password);
      if (result.success) {
        toast.success('Login successful!');
      } else {
        toast.error(result.error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      firstName: '',
      lastName: '',
      username: '',
      bio: '',
      location: '',
      companyName: '',
      companyAddress: {
        street: '',
        city: '',
        state: '',
        country: '',
        zipCode: ''
      },
      companyDescription: '',
      website: '',
      establishedYear: ''
    });
  };

  const toggleMode = () => {
    setIsSignup(!isSignup);
    resetForm();
    setUserType('individual');
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#181818', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{ 
        background: '#fff', 
        borderRadius: 12, 
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)', 
        padding: '2.5rem', 
        minWidth: 400,
        maxWidth: 600,
        width: '100%',
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center' 
      }}>
        <h2 style={{ 
          marginBottom: '2rem', 
          fontSize: '2rem', 
          fontWeight: 700,
          color: '#181818',
          textAlign: 'center'
        }}>
          {isSignup ? 'Join The Runway' : 'Welcome Back'}
        </h2>

        {isSignup && (
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            marginBottom: '2rem',
            width: '100%',
            justifyContent: 'center'
          }}>
            <button
              type="button"
              onClick={() => setUserType('individual')}
              style={{
                padding: '1rem 2rem',
                border: userType === 'individual' ? '2px solid #181818' : '2px solid #ddd',
                borderRadius: 8,
                background: userType === 'individual' ? '#181818' : '#fff',
                color: userType === 'individual' ? '#fff' : '#181818',
                cursor: 'pointer',
                fontWeight: 600,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                minWidth: 120
              }}
            >
              <span style={{ fontSize: '2rem' }}>👤</span>
              Individual
            </button>
            <button
              type="button"
              onClick={() => setUserType('company')}
              style={{
                padding: '1rem 2rem',
                border: userType === 'company' ? '2px solid #181818' : '2px solid #ddd',
                borderRadius: 8,
                background: userType === 'company' ? '#181818' : '#fff',
                color: userType === 'company' ? '#fff' : '#181818',
                cursor: 'pointer',
                fontWeight: 600,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                minWidth: 120
              }}
            >
              <span style={{ fontSize: '2rem' }}>🏢</span>
              Company
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          {/* Common fields */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            style={{ 
              marginBottom: '1rem', 
              padding: '0.75rem', 
              width: '100%', 
              borderRadius: 8, 
              border: '2px solid #ddd',
              fontSize: '1rem',
              boxSizing: 'border-box'
            }}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            style={{ 
              marginBottom: '1rem', 
              padding: '0.75rem', 
              width: '100%', 
              borderRadius: 8, 
              border: '2px solid #ddd',
              fontSize: '1rem',
              boxSizing: 'border-box'
            }}
            required
          />

          {isSignup && (
            <>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                style={{ 
                  marginBottom: '1rem', 
                  padding: '0.75rem', 
                  width: '100%', 
                  borderRadius: 8, 
                  border: '2px solid #ddd',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
                required
              />

              <input
                type="tel"
                name="phone"
                placeholder="Phone (with country code, e.g., +1234567890)"
                value={formData.phone}
                onChange={handleInputChange}
                style={{ 
                  marginBottom: '1rem', 
                  padding: '0.75rem', 
                  width: '100%', 
                  borderRadius: 8, 
                  border: '2px solid #ddd',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
                required
              />

              {/* Individual fields */}
              {userType === 'individual' && (
                <>
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      style={{ 
                        padding: '0.75rem', 
                        flex: 1, 
                        borderRadius: 8, 
                        border: '2px solid #ddd',
                        fontSize: '1rem'
                      }}
                      required
                    />
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      style={{ 
                        padding: '0.75rem', 
                        flex: 1, 
                        borderRadius: 8, 
                        border: '2px solid #ddd',
                        fontSize: '1rem'
                      }}
                      required
                    />
                  </div>

                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleInputChange}
                    style={{ 
                      marginBottom: '1rem', 
                      padding: '0.75rem', 
                      width: '100%', 
                      borderRadius: 8, 
                      border: '2px solid #ddd',
                      fontSize: '1rem',
                      boxSizing: 'border-box'
                    }}
                    required
                  />

                  <textarea
                    name="bio"
                    placeholder="Bio (optional)"
                    value={formData.bio}
                    onChange={handleInputChange}
                    style={{ 
                      marginBottom: '1rem', 
                      padding: '0.75rem', 
                      width: '100%', 
                      borderRadius: 8, 
                      border: '2px solid #ddd',
                      fontSize: '1rem',
                      boxSizing: 'border-box',
                      minHeight: '80px',
                      resize: 'vertical'
                    }}
                  />
                </>
              )}

              {/* Company fields */}
              {userType === 'company' && (
                <>
                  <input
                    type="text"
                    name="companyName"
                    placeholder="Company Name"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    style={{ 
                      marginBottom: '1rem', 
                      padding: '0.75rem', 
                      width: '100%', 
                      borderRadius: 8, 
                      border: '2px solid #ddd',
                      fontSize: '1rem',
                      boxSizing: 'border-box'
                    }}
                    required
                  />

                  <input
                    type="text"
                    name="companyAddress.street"
                    placeholder="Street Address"
                    value={formData.companyAddress.street}
                    onChange={handleInputChange}
                    style={{ 
                      marginBottom: '1rem', 
                      padding: '0.75rem', 
                      width: '100%', 
                      borderRadius: 8, 
                      border: '2px solid #ddd',
                      fontSize: '1rem',
                      boxSizing: 'border-box'
                    }}
                    required
                  />

                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <input
                      type="text"
                      name="companyAddress.city"
                      placeholder="City"
                      value={formData.companyAddress.city}
                      onChange={handleInputChange}
                      style={{ 
                        padding: '0.75rem', 
                        flex: 1, 
                        borderRadius: 8, 
                        border: '2px solid #ddd',
                        fontSize: '1rem'
                      }}
                      required
                    />
                    <input
                      type="text"
                      name="companyAddress.state"
                      placeholder="State"
                      value={formData.companyAddress.state}
                      onChange={handleInputChange}
                      style={{ 
                        padding: '0.75rem', 
                        flex: 1, 
                        borderRadius: 8, 
                        border: '2px solid #ddd',
                        fontSize: '1rem'
                      }}
                      required
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <input
                      type="text"
                      name="companyAddress.country"
                      placeholder="Country"
                      value={formData.companyAddress.country}
                      onChange={handleInputChange}
                      style={{ 
                        padding: '0.75rem', 
                        flex: 1, 
                        borderRadius: 8, 
                        border: '2px solid #ddd',
                        fontSize: '1rem'
                      }}
                      required
                    />
                    <input
                      type="text"
                      name="companyAddress.zipCode"
                      placeholder="ZIP Code"
                      value={formData.companyAddress.zipCode}
                      onChange={handleInputChange}
                      style={{ 
                        padding: '0.75rem', 
                        flex: 1, 
                        borderRadius: 8, 
                        border: '2px solid #ddd',
                        fontSize: '1rem'
                      }}
                      required
                    />
                  </div>

                  <textarea
                    name="companyDescription"
                    placeholder="Company Description (optional)"
                    value={formData.companyDescription}
                    onChange={handleInputChange}
                    style={{ 
                      marginBottom: '1rem', 
                      padding: '0.75rem', 
                      width: '100%', 
                      borderRadius: 8, 
                      border: '2px solid #ddd',
                      fontSize: '1rem',
                      boxSizing: 'border-box',
                      minHeight: '80px',
                      resize: 'vertical'
                    }}
                  />

                  <input
                    type="url"
                    name="website"
                    placeholder="Website (optional)"
                    value={formData.website}
                    onChange={handleInputChange}
                    style={{ 
                      marginBottom: '1rem', 
                      padding: '0.75rem', 
                      width: '100%', 
                      borderRadius: 8, 
                      border: '2px solid #ddd',
                      fontSize: '1rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </>
              )}
            </>
          )}

          {error && (
            <div style={{ 
              color: '#dc3545', 
              marginBottom: '1rem', 
              padding: '0.5rem',
              background: '#f8d7da',
              border: '1px solid #f5c6cb',
              borderRadius: 4,
              fontSize: '0.9rem'
            }}>
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              background: loading ? '#ccc' : '#181818', 
              color: '#fff', 
              border: 'none', 
              borderRadius: 8, 
              padding: '1rem 2rem', 
              fontWeight: 600, 
              fontSize: '1.1rem', 
              cursor: loading ? 'not-allowed' : 'pointer', 
              width: '100%',
              marginBottom: '1rem'
            }}
          >
            {loading ? 'Please wait...' : (isSignup ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        <div style={{ fontSize: '0.9rem', color: '#666', textAlign: 'center' }}>
          {isSignup ? 'Already have an account?' : "Don't have an account?"}
          <button 
            onClick={toggleMode} 
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#007bff', 
              marginLeft: '0.5rem', 
              cursor: 'pointer', 
              textDecoration: 'underline',
              fontSize: '0.9rem'
            }}
          >
            {isSignup ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedAuth;