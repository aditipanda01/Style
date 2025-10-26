# Fashion Design Platform - Complete Tech Stack & Architecture

## 🏗️ **COMPREHENSIVE TECH STACK**

### **Frontend Stack**
- **Framework**: React 19.1.0 (Current)
- **Routing**: React Router DOM 7.6.3 (Current)
- **Styling**: CSS-in-JS (Current inline styles) + CSS Modules
- **UI Components**: Custom components + React Slick for carousels
- **State Management**: React Context API + useState/useReducer
- **HTTP Client**: Axios for API calls
- **File Upload**: React Dropzone
- **Image Processing**: React Image Crop
- **Notifications**: React Toastify

### **Backend Stack**
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) + bcrypt
- **File Storage**: Cloudinary (images) + MongoDB GridFS (documents)
- **SMS Service**: Twilio API
- **Email Service**: SendGrid (backup notifications)
- **API Documentation**: Swagger/OpenAPI
- **Validation**: Joi or Yup
- **Security**: Helmet.js, CORS, Rate Limiting

### **DevOps & Hosting**
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Vercel Serverless Functions
- **Database**: MongoDB Atlas (Cloud)
- **CDN**: Cloudinary for images
- **Environment Management**: dotenv
- **Version Control**: Git + GitHub
- **CI/CD**: Vercel automatic deployments

### **Third-Party Services**
- **SMS**: Twilio API
- **Image Storage**: Cloudinary
- **Database**: MongoDB Atlas
- **Analytics**: Google Analytics (optional)
- **Monitoring**: Vercel Analytics

## 🗄️ **DATABASE SCHEMA DESIGN**

### **Users Collection**
```javascript
{
  _id: ObjectId,
  userType: "individual" | "company",
  email: String (unique),
  password: String (hashed),
  phone: String,
  isVerified: Boolean,
  
  // Individual User Fields
  firstName: String,
  lastName: String,
  username: String (unique),
  bio: String,
  profilePicture: String (URL),
  dateOfBirth: Date,
  location: String,
  
  // Company Fields
  companyName: String,
  companyAddress: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  companyDescription: String,
  companyLogo: String (URL),
  website: String,
  establishedYear: Number,
  
  // Common Stats
  followers: [ObjectId] (User IDs),
  following: [ObjectId] (User IDs),
  totalLikes: Number (default: 0),
  totalSaves: Number (default: 0),
  totalShares: Number (default: 0),
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date,
  lastLogin: Date
}
```

### **Designs Collection**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: Users),
  title: String,
  description: String,
  category: "dress" | "jewellery" | "shoes",
  images: [{
    url: String,
    publicId: String (Cloudinary),
    isPrimary: Boolean
  }],
  tags: [String],
  isPublic: Boolean (default: true),
  
  // Engagement
  likes: [ObjectId] (User IDs),
  saves: [ObjectId] (User IDs),
  shares: Number (default: 0),
  views: Number (default: 0),
  
  // Collaboration
  isAvailableForCollab: Boolean (default: false),
  collaborationRequests: [ObjectId] (ref: Collaborations),
  
  createdAt: Date,
  updatedAt: Date
}
```

### **Collaborations Collection**
```javascript
{
  _id: ObjectId,
  designId: ObjectId (ref: Designs),
  designerId: ObjectId (ref: Users),
  companyId: ObjectId (ref: Users),
  
  status: "pending" | "accepted" | "declined" | "completed",
  message: String,
  proposedTerms: {
    budget: Number,
    timeline: String,
    deliverables: [String],
    additionalNotes: String
  },
  
  // Communication
  messages: [{
    senderId: ObjectId (ref: Users),
    message: String,
    timestamp: Date,
    attachments: [String]
  }],
  
  // Notifications
  smsNotificationSent: Boolean (default: false),
  emailNotificationSent: Boolean (default: false),
  
  createdAt: Date,
  updatedAt: Date,
  completedAt: Date
}
```

### **Notifications Collection**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: Users),
  type: "collaboration_request" | "collaboration_accepted" | "collaboration_declined" | "new_follower" | "design_liked",
  title: String,
  message: String,
  relatedId: ObjectId, // Design ID, Collaboration ID, etc.
  isRead: Boolean (default: false),
  createdAt: Date
}
```

## 🔐 **AUTHENTICATION SYSTEM**

### **Login Flow**
```mermaid
graph TD
    A[User clicks Profile] --> B[Login Page]
    B --> C{Select User Type}
    C -->|Individual| D[Individual Login Form]
    C -->|Company| E[Company Login Form]
    D --> F[Validate Credentials]
    E --> F
    F -->|Success| G[Generate JWT Token]
    F -->|Failure| H[Show Error]
    G --> I{User Type}
    I -->|Individual| J[Individual Dashboard]
    I -->|Company| K[Company Dashboard]
```

### **JWT Token Structure**
```javascript
{
  userId: ObjectId,
  userType: "individual" | "company",
  email: String,
  iat: Number,
  exp: Number (24 hours)
}
```

## 🚀 **API ENDPOINTS ARCHITECTURE**

### **Authentication Routes**
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh-token
POST /api/auth/forgot-password
POST /api/auth/reset-password
GET  /api/auth/verify-email/:token
```

### **User Routes**
```
GET    /api/users/profile
PUT    /api/users/profile
GET    /api/users/:id
POST   /api/users/follow/:id
DELETE /api/users/unfollow/:id
GET    /api/users/:id/followers
GET    /api/users/:id/following
```

### **Design Routes**
```
GET    /api/designs                    // Get all public designs
POST   /api/designs                    // Create new design
GET    /api/designs/:id                // Get specific design
PUT    /api/designs/:id                // Update design
DELETE /api/designs/:id                // Delete design
POST   /api/designs/:id/like           // Like design
DELETE /api/designs/:id/unlike         // Unlike design
POST   /api/designs/:id/save           // Save design
DELETE /api/designs/:id/unsave         // Unsave design
POST   /api/designs/:id/share          // Share design
GET    /api/designs/category/:category // Get designs by category
GET    /api/designs/user/:userId       // Get user's designs
```

### **Collaboration Routes**
```
POST   /api/collaborations                    // Send collaboration request
GET    /api/collaborations/sent              // Get sent requests
GET    /api/collaborations/received          // Get received requests
PUT    /api/collaborations/:id/accept        // Accept collaboration
PUT    /api/collaborations/:id/decline       // Decline collaboration
POST   /api/collaborations/:id/message       // Send message
GET    /api/collaborations/:id/messages      // Get conversation
```

### **Notification Routes**
```
GET    /api/notifications                // Get user notifications
PUT    /api/notifications/:id/read       // Mark as read
PUT    /api/notifications/mark-all-read  // Mark all as read
DELETE /api/notifications/:id            // Delete notification
```

## 📱 **SMS NOTIFICATION SYSTEM**

### **Twilio Integration**
```javascript
// SMS Service Configuration
const twilioConfig = {
  accountSid: process.env.TWILIO_ACCOUNT_SID,
  authToken: process.env.TWILIO_AUTH_TOKEN,
  phoneNumber: process.env.TWILIO_PHONE_NUMBER
};

// SMS Templates
const smsTemplates = {
  collaborationRequest: (companyName, designTitle) => 
    `🎨 ${companyName} wants to collaborate on your design "${designTitle}"! Check your dashboard: ${process.env.FRONTEND_URL}/dashboard`,
  
  collaborationAccepted: (designerName, designTitle) =>
    `✅ ${designerName} accepted your collaboration request for "${designTitle}"! View details: ${process.env.FRONTEND_URL}/dashboard`,
    
  collaborationDeclined: (designerName, designTitle) =>
    `❌ ${designerName} declined your collaboration request for "${designTitle}". View other designs: ${process.env.FRONTEND_URL}/designs`
};
```

### **SMS Notification Flow**
```mermaid
graph TD
    A[Company sends collaboration request] --> B[Save to database]
    B --> C[Get designer phone number]
    C --> D[Send SMS via Twilio]
    D --> E[Update notification status]
    E --> F[Designer receives SMS]
    F --> G[Designer clicks link]
    G --> H[Redirect to dashboard]
    H --> I[Show collaboration request]
```

## 🎨 **FRONTEND MODIFICATIONS**

### **New Components to Create**
1. **AuthenticationFlow.jsx** - Handle login/signup with user type selection
2. **CompanyDashboard.jsx** - Company-specific dashboard
3. **IndividualDashboard.jsx** - Enhanced user dashboard
4. **CollaborationModal.jsx** - Send collaboration requests
5. **CollaborationList.jsx** - Manage collaborations
6. **DesignUpload.jsx** - Upload and manage designs
7. **NotificationCenter.jsx** - Show notifications
8. **ProfileSettings.jsx** - Edit profile information

### **Enhanced Features**
- **Like/Save/Share buttons** on all design cards
- **Collaboration buttons** on company view
- **Real-time notifications** using WebSocket or polling
- **File upload** with drag-and-drop
- **Image cropping** and optimization
- **Search and filter** functionality

## 🔄 **COLLABORATION WORKFLOW**

```mermaid
sequenceDiagram
    participant C as Company
    participant S as System
    participant D as Designer
    participant T as Twilio

    C->>S: Browse designs
    C->>S: Click "Collaborate" on design
    S->>S: Show collaboration form
    C->>S: Submit collaboration request
    S->>S: Save collaboration to database
    S->>T: Send SMS to designer
    T->>D: SMS notification received
    D->>S: Click SMS link → Dashboard
    S->>D: Show collaboration request
    D->>S: Accept/Decline collaboration
    S->>T: Send SMS to company
    T->>C: SMS notification received
    C->>S: View collaboration status
```

## 📊 **DASHBOARD FEATURES**

### **Individual User Dashboard**
- **Profile Section**: Name, bio, profile picture, followers count
- **Stats Cards**: Designs posted, total likes, saves, collaborations completed
- **Recent Activity**: Latest likes, saves, collaboration requests
- **Design Gallery**: User's uploaded designs with edit/delete options
- **Collaboration Requests**: Pending, accepted, declined requests
- **Notifications**: Real-time updates

### **Company Dashboard**
- **Company Profile**: Name, address, logo, description
- **Collaboration Stats**: Invitations sent, active collaborations, completed projects
- **Design Discovery**: Browse designs with collaboration options
- **Active Collaborations**: Ongoing projects with designers
- **Collaboration History**: Past collaborations and outcomes
- **Team Management**: Add/remove team members (future feature)

## 🚀 **DEPLOYMENT STRATEGY**

### **Vercel Configuration**
```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "MONGODB_URI": "@mongodb-uri",
    "JWT_SECRET": "@jwt-secret",
    "TWILIO_ACCOUNT_SID": "@twilio-account-sid",
    "TWILIO_AUTH_TOKEN": "@twilio-auth-token",
    "CLOUDINARY_CLOUD_NAME": "@cloudinary-cloud-name"
  }
}
```

### **Environment Variables**
```bash
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/runway

# Authentication
JWT_SECRET=your-super-secret-jwt-key
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
FRONTEND_URL=https://your-app.vercel.app
```

## 📈 **IMPLEMENTATION PHASES**

### **Phase 1: Backend Foundation (Week 1-2)**
- Set up Express.js server with MongoDB
- Implement authentication system
- Create user and design models
- Basic API endpoints

### **Phase 2: Core Features (Week 3-4)**
- Design upload and management
- Like/save/share functionality
- User profiles and dashboards
- Basic collaboration system

### **Phase 3: Advanced Features (Week 5-6)**
- SMS notifications with Twilio
- Real-time notifications
- Enhanced collaboration workflow
- Company dashboard features

### **Phase 4: Polish & Deploy (Week 7-8)**
- UI/UX improvements
- Performance optimization
- Testing and bug fixes
- Production deployment

## 🔧 **DEVELOPMENT TOOLS**

### **Backend Development**
- **Postman**: API testing
- **MongoDB Compass**: Database management
- **Nodemon**: Development server
- **ESLint**: Code linting
- **Prettier**: Code formatting

### **Frontend Development**
- **Vite**: Build tool (current)
- **React DevTools**: Debugging
- **Axios**: HTTP client
- **React Hook Form**: Form handling

This comprehensive architecture provides a solid foundation for your fashion design platform with all the requested features including user authentication, company profiles, collaboration system, SMS notifications, and enhanced dashboard functionality.