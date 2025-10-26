# Fashion Design Platform - API Documentation

## 🚀 **API Overview**

**Base URL**: `https://your-app.vercel.app/api`
**Version**: v1
**Authentication**: JWT Bearer Token
**Content-Type**: `application/json`

## 🔐 **Authentication**

### **Register User**
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "userType": "individual" | "company",
  "email": "user@example.com",
  "password": "securePassword123",
  "phone": "+1234567890",
  
  // For Individual Users
  "firstName": "John",
  "lastName": "Doe",
  "username": "johndoe",
  "bio": "Fashion designer passionate about sustainable fashion",
  
  // For Companies
  "companyName": "Fashion Hub Ltd",
  "companyAddress": {
    "street": "123 Fashion St",
    "city": "New York",
    "state": "NY",
    "country": "USA",
    "zipCode": "10001"
  },
  "website": "https://fashionhub.com",
  "companyDescription": "Leading fashion brand since 2018"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "64f8a1b2c3d4e5f6g7h8i9j0",
      "email": "user@example.com",
      "userType": "individual",
      "firstName": "John",
      "lastName": "Doe",
      "username": "johndoe"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### **Login User**
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "64f8a1b2c3d4e5f6g7h8i9j0",
      "email": "user@example.com",
      "userType": "individual",
      "firstName": "John",
      "lastName": "Doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

## 👤 **User Management**

### **Get User Profile**
```http
GET /api/users/profile
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64f8a1b2c3d4e5f6g7h8i9j0",
    "email": "user@example.com",
    "userType": "individual",
    "firstName": "John",
    "lastName": "Doe",
    "username": "johndoe",
    "bio": "Fashion designer passionate about sustainable fashion",
    "profilePicture": "https://cloudinary.com/image/profile.jpg",
    "followers": ["64f8a1b2c3d4e5f6g7h8i9j1", "64f8a1b2c3d4e5f6g7h8i9j2"],
    "following": ["64f8a1b2c3d4e5f6g7h8i9j3"],
    "totalLikes": 340,
    "totalSaves": 58,
    "totalShares": 21,
    "createdAt": "2024-01-15T10:30:00Z",
    "lastLogin": "2024-01-20T14:45:00Z"
  }
}
```

## 🎨 **Design Management**

### **Create Design**
```http
POST /api/designs
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
```
title: "Summer Boho Collection"
description: "Sustainable summer dresses with bohemian flair"
category: "dress"
tags: ["boho", "summer", "sustainable"]
isPublic: true
isAvailableForCollab: true
images: [file1.jpg, file2.jpg, file3.jpg]
```

### **Get All Designs**
```http
GET /api/designs?page=1&limit=20&category=dress&search=boho
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 50)
- `category` (optional): Filter by category (dress, jewellery, shoes)
- `search` (optional): Search in title, description, tags
- `userId` (optional): Filter by specific user
- `sortBy` (optional): Sort by (createdAt, likes, views) default: createdAt
- `sortOrder` (optional): asc or desc (default: desc)

## 🤝 **Collaboration Management**

### **Send Collaboration Request**
```http
POST /api/collaborations
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "designId": "64f8a1b2c3d4e5f6g7h8i9j0",
  "message": "Hi! We love your design and would like to collaborate.",
  "proposedTerms": {
    "budget": 3000,
    "timeline": "3 weeks",
    "deliverables": [
      "Design sketches",
      "Technical specifications",
      "3D mockups"
    ],
    "additionalNotes": "Looking for sustainable materials focus"
  }
}
```

### **Accept/Decline Collaboration**
```http
PUT /api/collaborations/{collaborationId}/accept
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "message": "Great! I'm excited to work on this project."
}
```

## 🔔 **Notifications**

### **Get Notifications**
```http
GET /api/notifications?page=1&limit=20&unread=true
Authorization: Bearer {token}
```

## ❌ **Error Responses**

### **Standard Error Format**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  }
}
```

### **Common Error Codes**
- `VALIDATION_ERROR` (400): Request validation failed
- `UNAUTHORIZED` (401): Authentication required
- `FORBIDDEN` (403): Access denied
- `NOT_FOUND` (404): Resource not found
- `CONFLICT` (409): Resource already exists
- `RATE_LIMITED` (429): Too many requests
- `INTERNAL_ERROR` (500): Server error

## 🧪 **Testing**

### **Sample cURL Commands**

**Register User:**
```bash
curl -X POST https://your-app.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "userType": "individual",
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User",
    "username": "testuser"
  }'
```

**Get Designs:**
```bash
curl -X GET "https://your-app.vercel.app/api/designs?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Send Collaboration Request:**
```bash
curl -X POST https://your-app.vercel.app/api/collaborations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "designId": "64f8a1b2c3d4e5f6g7h8i9j0",
    "message": "We would love to collaborate!",
    "proposedTerms": {
      "budget": 3000,
      "timeline": "3 weeks"
    }
  }'
```

## 🚀 **Rate Limiting**

API endpoints are rate limited to prevent abuse:
- **Authentication endpoints**: 5 requests per minute per IP
- **Design upload**: 10 uploads per hour per user
- **Collaboration requests**: 20 requests per hour per user
- **General API**: 100 requests per minute per user

## 📋 **Response Headers**

All API responses include these headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642694400
X-Request-ID: req_1234567890abcdef
```

## 🔄 **Pagination**

All list endpoints support pagination with consistent format:
```json
{
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 200,
    "itemsPerPage": 20,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## 📝 **Changelog**

### Version 1.0.0 (Initial Release)
- User authentication and registration
- Design upload and management
- Collaboration system
- SMS notifications
- Basic analytics

### Future Versions
- **v1.1.0**: Real-time messaging
- **v1.2.0**: Advanced search and filtering
- **v1.3.0**: Team collaboration features
- **v2.0.0**: Mobile app API extensions

This API documentation provides comprehensive guidance for integrating with the Fashion Design Platform backend services.