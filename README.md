# The Runway - Fashion Design Collaboration Platform

A full-stack fashion design platform that connects individual designers with companies for collaboration opportunities. Features include user authentication, design portfolios, collaboration requests, SMS notifications, and real-time dashboards.

## 🚀 Features

### For Individual Designers
- **Portfolio Management**: Upload and showcase design portfolios
- **Collaboration Requests**: Receive and manage collaboration requests from companies
- **Real-time Notifications**: SMS and in-app notifications for new opportunities
- **Engagement Tracking**: Track likes, saves, shares, and views on designs
- **Profile Analytics**: Comprehensive stats on design performance and collaborations

### For Companies
- **Design Discovery**: Browse and search available designs for collaboration
- **Collaboration Management**: Send requests and manage active projects
- **Company Profiles**: Showcase company information and past collaborations
- **Project Tracking**: Monitor collaboration progress and communications

### Core Platform Features
- **Dual Authentication**: Separate registration flows for individuals and companies
- **SMS Notifications**: Twilio integration for instant collaboration alerts
- **Real-time Dashboards**: Dynamic dashboards based on user type
- **Design Categories**: Organized by dress, jewelry, and shoes
- **Responsive Design**: Mobile-first approach for all devices

## 🛠 Tech Stack

### Frontend
- **React 19.1.0** - Modern React with hooks and context
- **React Router DOM 7.6.3** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Toastify** - Toast notifications
- **React Hook Form** - Form handling and validation

### Backend
- **Node.js 18+** - Server runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing

### Third-Party Services
- **Twilio** - SMS notifications
- **Cloudinary** - Image storage and optimization
- **MongoDB Atlas** - Cloud database hosting
- **Vercel** - Frontend and serverless function hosting

## 📦 Installation

### Prerequisites
- Node.js 18 or higher
- MongoDB Atlas account
- Twilio account for SMS
- Cloudinary account for image storage

### 1. Clone the Repository
```bash
git clone <repository-url>
cd runway
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/runway

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=24h

# Twilio SMS
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Environment
NODE_ENV=development
```

### 4. Database Setup
1. Create a MongoDB Atlas cluster
2. Create a database named `runway`
3. Update the `MONGODB_URI` in your `.env.local` file

### 5. Twilio Setup
1. Create a Twilio account
2. Get a phone number for SMS
3. Add your credentials to `.env.local`

### 6. Cloudinary Setup
1. Create a Cloudinary account
2. Get your cloud name, API key, and secret
3. Add credentials to `.env.local`

## 🚀 Development

### Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### API Endpoints
The backend API will be available at `http://localhost:3000/api`

Key endpoints:
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/users/profile` - Get user profile
- `GET /api/designs` - Get designs
- `POST /api/collaborations` - Send collaboration request

## 📱 Usage

### For Designers (Individual Users)
1. **Register**: Choose "Individual" during signup
2. **Complete Profile**: Add bio, location, and profile picture
3. **Upload Designs**: Add your design portfolio
4. **Enable Collaboration**: Mark designs as available for collaboration
5. **Manage Requests**: Accept or decline collaboration requests
6. **Track Performance**: Monitor design engagement and stats

### For Companies
1. **Register**: Choose "Company" during signup
2. **Company Profile**: Add company details, logo, and description
3. **Discover Designs**: Browse available designs by category
4. **Send Requests**: Collaborate with designers on specific designs
5. **Manage Projects**: Track active collaborations and communications
6. **View Analytics**: Monitor collaboration success and engagement

## 🔧 API Documentation

### Authentication
```javascript
// Register
POST /api/auth/register
{
  "userType": "individual" | "company",
  "email": "user@example.com",
  "password": "password123",
  "phone": "+1234567890",
  // Additional fields based on user type
}

// Login
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Designs
```javascript
// Get designs
GET /api/designs?category=dress&limit=20

// Create design
POST /api/designs
{
  "title": "Summer Collection",
  "description": "Sustainable summer dresses",
  "category": "dress",
  "images": [{"url": "...", "publicId": "..."}],
  "isAvailableForCollab": true
}

// Like design
POST /api/designs/:id/like
```

### Collaborations
```javascript
// Send collaboration request
POST /api/collaborations
{
  "designId": "design-id",
  "message": "Collaboration message",
  "proposedTerms": {
    "budget": 3000,
    "timeline": "3 weeks"
  }
}

// Respond to collaboration
PUT /api/collaborations/:id/respond
{
  "action": "accept" | "decline",
  "message": "Response message"
}
```

## 🚀 Deployment

### Vercel Deployment
1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Environment Variables**: Add all environment variables in Vercel dashboard
3. **Deploy**: Vercel will automatically build and deploy

### Environment Variables in Vercel
Add these as environment variables in your Vercel project:
- `MONGODB_URI`
- `JWT_SECRET`
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_PHONE_NUMBER`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `FRONTEND_URL` (your Vercel domain)

## 📊 Database Schema

### Users Collection
```javascript
{
  userType: "individual" | "company",
  email: String,
  password: String (hashed),
  phone: String,
  
  // Individual fields
  firstName: String,
  lastName: String,
  username: String,
  bio: String,
  profilePicture: String,
  
  // Company fields
  companyName: String,
  companyAddress: Object,
  companyDescription: String,
  companyLogo: String,
  
  // Stats
  followers: [ObjectId],
  totalLikes: Number,
  totalSaves: Number
}
```

### Designs Collection
```javascript
{
  userId: ObjectId,
  title: String,
  description: String,
  category: "dress" | "jewellery" | "shoes",
  images: [Object],
  tags: [String],
  isAvailableForCollab: Boolean,
  likes: [ObjectId],
  saves: [ObjectId],
  views: Number
}
```

### Collaborations Collection
```javascript
{
  designId: ObjectId,
  designerId: ObjectId,
  companyId: ObjectId,
  status: "pending" | "accepted" | "declined" | "completed",
  message: String,
  proposedTerms: Object,
  smsNotificationSent: Boolean
}
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt for secure password storage
- **Input Validation**: Joi validation for all API inputs
- **Rate Limiting**: Protection against API abuse
- **CORS Configuration**: Secure cross-origin requests
- **Environment Variables**: Sensitive data protection

## 📱 SMS Notifications

The platform sends SMS notifications for:
- New collaboration requests
- Collaboration acceptances/declines
- Design likes and engagement
- New followers

SMS templates are customizable and include direct links to the platform.

## 🎨 Design System

### Color Palette
- **Primary**: #181818 (Dark)
- **Secondary**: #ede7df (Light Beige)
- **Accent**: #007bff (Blue)
- **Success**: #28a745 (Green)
- **Warning**: #ffc107 (Yellow)
- **Danger**: #dc3545 (Red)

### Typography
- **Headers**: Bebas Neue
- **Body**: Montserrat
- **Accent**: Cormorant Garamond

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation
- Review the setup instructions

## 🚀 Future Enhancements

- **Real-time Chat**: WebSocket-based messaging
- **Advanced Search**: AI-powered design recommendations
- **Mobile App**: React Native mobile application
- **Payment Integration**: Stripe for collaboration payments
- **Analytics Dashboard**: Advanced business intelligence
- **Team Collaboration**: Multi-user company accounts

---

Built with ❤️ for the fashion design community.
#   S k e t c h T o S t y l e  
 #   S t y l e  
 