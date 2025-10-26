import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

const LoginSignup = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [userType, setUserType] = useState('individual');
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { login, register, loading } = useAuth();

  const [formData, setFormData] = useState({
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('companyAddress.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        companyAddress: { ...prev.companyAddress, [field]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (isSignup) {
      // Validation
      if (!formData.email || !formData.password) {
        setError('Email and password are required');
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }

      if (!formData.phone) {
        setError('Phone number is required');
        return;
      }

      if (!formData.phone.startsWith('+')) {
        setError('Phone must include country code (e.g., +1234567890)');
        return;
      }

      // Build registration data
      const userData = {
        userType,
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        phone: formData.phone.trim()
      };

      if (userType === 'individual') {
        if (!formData.firstName || !formData.lastName || !formData.username) {
          setError('First name, last name, and username are required');
          return;
        }

        userData.firstName = formData.firstName.trim();
        userData.lastName = formData.lastName.trim();
        userData.username = formData.username.trim().toLowerCase();
        
        if (formData.bio) userData.bio = formData.bio.trim();
        if (formData.location) userData.location = formData.location.trim();
      } else {
        if (!formData.companyName) {
          setError('Company name is required');
          return;
        }

        const addr = formData.companyAddress;
        if (!addr.street || !addr.city || !addr.state || !addr.country || !addr.zipCode) {
          setError('Complete company address is required');
          return;
        }

        userData.companyName = formData.companyName.trim();
        userData.companyAddress = {
          street: addr.street.trim(),
          city: addr.city.trim(),
          state: addr.state.trim(),
          country: addr.country.trim(),
          zipCode: addr.zipCode.trim()
        };
        
        if (formData.companyDescription) {
          userData.companyDescription = formData.companyDescription.trim();
        }
        if (formData.website) {
          userData.website = formData.website.trim();
        }
        if (formData.establishedYear) {
          userData.establishedYear = parseInt(formData.establishedYear);
        }
      }

      console.log('📤 Submitting registration:', userData);

      const result = await register(userData);
      if (result.success) {
        setSuccess('Registration successful! Redirecting...');
        setTimeout(() => navigate('/profile'), 1000);
      } else {
        setError(result.error);
      }
    } else {
      // Login
      if (!formData.email || !formData.password) {
        setError('Please enter email and password');
        return;
      }

      const result = await login(formData.email, formData.password);
      if (result.success) {
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => navigate('/profile'), 1000);
      } else {
        setError(result.error);
      }
    }
  };

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setError('');
    setSuccess('');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#181818', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.1)', padding: '2.5rem', minWidth: 400, maxWidth: 600, width: '100%' }}>
        <h2 style={{ marginBottom: '2rem', fontSize: '2rem', fontWeight: 700, color: '#181818', textAlign: 'center' }}>
          {isSignup ? 'Join The Runway' : 'Welcome Back'}
        </h2>

        {isSignup && (
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', justifyContent: 'center' }}>
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
                gap: '0.5rem'
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
                gap: '0.5rem'
              }}
            >
              <span style={{ fontSize: '2rem' }}>🏢</span>
              Company
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            style={{ marginBottom: '1rem', padding: '0.75rem', width: '100%', borderRadius: 8, border: '2px solid #ddd', fontSize: '1rem', boxSizing: 'border-box' }}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            style={{ marginBottom: '1rem', padding: '0.75rem', width: '100%', borderRadius: 8, border: '2px solid #ddd', fontSize: '1rem', boxSizing: 'border-box' }}
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
                style={{ marginBottom: '1rem', padding: '0.75rem', width: '100%', borderRadius: 8, border: '2px solid #ddd', fontSize: '1rem', boxSizing: 'border-box' }}
                required
              />

              <input
                type="tel"
                name="phone"
                placeholder="Phone (with country code, e.g., +1234567890)"
                value={formData.phone}
                onChange={handleInputChange}
                style={{ marginBottom: '1rem', padding: '0.75rem', width: '100%', borderRadius: 8, border: '2px solid #ddd', fontSize: '1rem', boxSizing: 'border-box' }}
                required
              />

              {userType === 'individual' ? (
                <>
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      style={{ flex: 1, padding: '0.75rem', borderRadius: 8, border: '2px solid #ddd', fontSize: '1rem' }}
                      required
                    />
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      style={{ flex: 1, padding: '0.75rem', borderRadius: 8, border: '2px solid #ddd', fontSize: '1rem' }}
                      required
                    />
                  </div>

                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleInputChange}
                    style={{ marginBottom: '1rem', padding: '0.75rem', width: '100%', borderRadius: 8, border: '2px solid #ddd', fontSize: '1rem', boxSizing: 'border-box' }}
                    required
                  />

                  <textarea
                    name="bio"
                    placeholder="Bio (optional)"
                    value={formData.bio}
                    onChange={handleInputChange}
                    style={{ marginBottom: '1rem', padding: '0.75rem', width: '100%', borderRadius: 8, border: '2px solid #ddd', fontSize: '1rem', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }}
                  />

                  <input
                    type="text"
                    name="location"
                    placeholder="Location (optional)"
                    value={formData.location}
                    onChange={handleInputChange}
                    style={{ marginBottom: '1rem', padding: '0.75rem', width: '100%', borderRadius: 8, border: '2px solid #ddd', fontSize: '1rem', boxSizing: 'border-box' }}
                  />
                </>
              ) : (
                <>
                  <input
                    type="text"
                    name="companyName"
                    placeholder="Company Name"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    style={{ marginBottom: '1rem', padding: '0.75rem', width: '100%', borderRadius: 8, border: '2px solid #ddd', fontSize: '1rem', boxSizing: 'border-box' }}
                    required
                  />

                  <input
                    type="text"
                    name="companyAddress.street"
                    placeholder="Street Address"
                    value={formData.companyAddress.street}
                    onChange={handleInputChange}
                    style={{ marginBottom: '1rem', padding: '0.75rem', width: '100%', borderRadius: 8, border: '2px solid #ddd', fontSize: '1rem', boxSizing: 'border-box' }}
                    required
                  />

                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <input
                      type="text"
                      name="companyAddress.city"
                      placeholder="City"
                      value={formData.companyAddress.city}
                      onChange={handleInputChange}
                      style={{ flex: 1, padding: '0.75rem', borderRadius: 8, border: '2px solid #ddd', fontSize: '1rem' }}
                      required
                    />
                    <input
                      type="text"
                      name="companyAddress.state"
                      placeholder="State"
                      value={formData.companyAddress.state}
                      onChange={handleInputChange}
                      style={{ flex: 1, padding: '0.75rem', borderRadius: 8, border: '2px solid #ddd', fontSize: '1rem' }}
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
                      style={{ flex: 1, padding: '0.75rem', borderRadius: 8, border: '2px solid #ddd', fontSize: '1rem' }}
                      required
                    />
                    <input
                      type="text"
                      name="companyAddress.zipCode"
                      placeholder="ZIP Code"
                      value={formData.companyAddress.zipCode}
                      onChange={handleInputChange}
                      style={{ flex: 1, padding: '0.75rem', borderRadius: 8, border: '2px solid #ddd', fontSize: '1rem' }}
                      required
                    />
                  </div>

                  <textarea
                    name="companyDescription"
                    placeholder="Company Description (optional)"
                    value={formData.companyDescription}
                    onChange={handleInputChange}
                    style={{ marginBottom: '1rem', padding: '0.75rem', width: '100%', borderRadius: 8, border: '2px solid #ddd', fontSize: '1rem', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }}
                  />

                  <input
                    type="url"
                    name="website"
                    placeholder="Website (optional)"
                    value={formData.website}
                    onChange={handleInputChange}
                    style={{ marginBottom: '1rem', padding: '0.75rem', width: '100%', borderRadius: 8, border: '2px solid #ddd', fontSize: '1rem', boxSizing: 'border-box' }}
                  />

                  <input
                    type="number"
                    name="establishedYear"
                    placeholder="Established Year (optional)"
                    value={formData.establishedYear}
                    onChange={handleInputChange}
                    min="1800"
                    max={new Date().getFullYear()}
                    style={{ marginBottom: '1rem', padding: '0.75rem', width: '100%', borderRadius: 8, border: '2px solid #ddd', fontSize: '1rem', boxSizing: 'border-box' }}
                  />
                </>
              )}
            </>
          )}

          {error && (
            <div style={{ color: '#dc3545', marginBottom: '1rem', padding: '0.75rem', background: '#f8d7da', border: '1px solid #f5c6cb', borderRadius: 4, fontSize: '0.9rem' }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{ color: '#28a745', marginBottom: '1rem', padding: '0.75rem', background: '#d4edda', border: '1px solid #c3e6cb', borderRadius: 4, fontSize: '0.9rem' }}>
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ background: loading ? '#ccc' : '#181818', color: '#fff', border: 'none', borderRadius: 8, padding: '1rem 2rem', fontWeight: 600, fontSize: '1.1rem', cursor: loading ? 'not-allowed' : 'pointer', width: '100%', marginBottom: '1rem' }}
          >
            {loading ? 'Please wait...' : (isSignup ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        <div style={{ fontSize: '0.9rem', color: '#666', textAlign: 'center' }}>
          {isSignup ? 'Already have an account?' : "Don't have an account?"}
          <button
            onClick={toggleMode}
            style={{ background: 'none', border: 'none', color: '#007bff', marginLeft: '0.5rem', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.9rem' }}
          >
            {isSignup ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;