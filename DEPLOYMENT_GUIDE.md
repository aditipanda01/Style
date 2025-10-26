# Deployment Guide - The Runway Fashion Platform

## 🚀 Quick Deployment Steps

### 1. Environment Setup
Create a `.env.local` file with the following variables:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/runway

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
JWT_EXPIRES_IN=24h

# Twilio SMS
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your-cloudinary-secret

# Frontend URL
FRONTEND_URL=https://your-app.vercel.app

# Environment
NODE_ENV=production
```

### 2. Database Setup (MongoDB Atlas)

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a free cluster
   - Create a database user
   - Whitelist your IP address (or use 0.0.0.0/0 for all IPs)

2. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `runway`

### 3. Twilio SMS Setup

1. **Create Twilio Account**
   - Go to [Twilio Console](https://console.twilio.com/)
   - Get a phone number
   - Find your Account SID and Auth Token

2. **Configure SMS**
   - Copy Account SID, Auth Token, and Phone Number
   - Add to environment variables

### 4. Cloudinary Setup

1. **Create Cloudinary Account**
   - Go to [Cloudinary](https://cloudinary.com/)
   - Get your Cloud Name, API Key, and API Secret
   - Add to environment variables

### 5. Vercel Deployment

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login to Vercel
   vercel login
   
   # Deploy
   vercel --prod
   ```

2. **Add Environment Variables in Vercel Dashboard**
   - Go to your project settings
   - Add all environment variables from `.env.local`
   - Redeploy the application

### 6. Testing the Deployment

1. **Test Authentication**
   - Register as both individual and company
   - Verify SMS notifications work
   - Test login/logout functionality

2. **Test Core Features**
   - Upload designs (individual users)
   - Send collaboration requests (companies)
   - Test like/save/share functionality
   - Verify dashboard functionality

## 🔧 Local Development Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Twilio account
- Cloudinary account

### Installation Steps

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd runway
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your credentials
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Access Application**
   - Frontend: http://localhost:3000
   - API: http://localhost:3000/api

## 📱 Features Verification Checklist

### Authentication System
- [ ] Individual user registration works
- [ ] Company registration works
- [ ] Login/logout functionality
- [ ] JWT token management
- [ ] Protected routes work

### Individual User Features
- [ ] Profile creation and editing
- [ ] Design upload (mock data for now)
- [ ] Dashboard with stats
- [ ] Collaboration request management
- [ ] Notifications system

### Company Features
- [ ] Company profile setup
- [ ] Design discovery and search
- [ ] Collaboration request sending
- [ ] Active collaboration management
- [ ] Company dashboard

### Core Platform Features
- [ ] Like/save/share functionality
- [ ] SMS notifications via Twilio
- [ ] Real-time dashboard updates
- [ ] Responsive design
- [ ] Error handling

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   ```
   Error: MongoNetworkError
   ```
   - Check MongoDB URI format
   - Verify database user credentials
   - Check IP whitelist in MongoDB Atlas

2. **Twilio SMS Error**
   ```
   Error: Authentication Error
   ```
   - Verify Account SID and Auth Token
   - Check phone number format (+1234567890)
   - Ensure Twilio account is active

3. **Cloudinary Upload Error**
   ```
   Error: Invalid API credentials
   ```
   - Check Cloud Name, API Key, and Secret
   - Verify Cloudinary account is active

4. **JWT Token Error**
   ```
   Error: JsonWebTokenError
   ```
   - Ensure JWT_SECRET is set and long enough
   - Check token expiration settings

### Development Issues

1. **CORS Errors**
   - Ensure FRONTEND_URL matches your domain
   - Check Vercel function configuration

2. **API Route Not Found**
   - Verify file structure in `/api` folder
   - Check export default function syntax

3. **Build Errors**
   - Run `npm run build` locally first
   - Check for TypeScript/ESLint errors
   - Verify all imports are correct

## 🔒 Security Considerations

### Production Security
- [ ] Use strong JWT secrets (32+ characters)
- [ ] Enable HTTPS only
- [ ] Set secure cookie flags
- [ ] Implement rate limiting
- [ ] Validate all user inputs
- [ ] Use environment variables for secrets

### Database Security
- [ ] Use MongoDB Atlas with authentication
- [ ] Limit database user permissions
- [ ] Enable IP whitelisting
- [ ] Regular security updates

### API Security
- [ ] Implement proper authentication
- [ ] Validate request payloads
- [ ] Use CORS properly
- [ ] Implement request rate limiting
- [ ] Log security events

## 📊 Monitoring and Analytics

### Recommended Tools
- **Vercel Analytics**: Built-in performance monitoring
- **MongoDB Atlas Monitoring**: Database performance
- **Twilio Console**: SMS delivery tracking
- **Cloudinary Analytics**: Image usage statistics

### Key Metrics to Monitor
- User registration rates
- Collaboration request success rates
- SMS delivery rates
- API response times
- Error rates

## 🚀 Performance Optimization

### Frontend Optimization
- [ ] Image optimization with Cloudinary
- [ ] Code splitting for routes
- [ ] Lazy loading for components
- [ ] Caching strategies

### Backend Optimization
- [ ] Database indexing
- [ ] API response caching
- [ ] Connection pooling
- [ ] Query optimization

## 📈 Scaling Considerations

### Database Scaling
- MongoDB Atlas auto-scaling
- Read replicas for heavy read operations
- Proper indexing strategy

### API Scaling
- Vercel serverless functions auto-scale
- Consider API rate limiting
- Implement caching layers

### File Storage Scaling
- Cloudinary handles scaling automatically
- Consider CDN for global distribution

## 🔄 Backup and Recovery

### Database Backups
- MongoDB Atlas automatic backups
- Point-in-time recovery available
- Export important data regularly

### Code Backups
- Git version control
- Multiple deployment environments
- Automated deployment pipelines

This deployment guide ensures your fashion design platform is production-ready with all features working correctly.