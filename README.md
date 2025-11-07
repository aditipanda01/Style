✨ The Runway – Fashion Design Collaboration Platform

A full-stack fashion design collaboration platform connecting individual designers and companies for creative partnerships and sponsorship opportunities. The platform supports portfolio uploads, JWT-secured authentication, real-time design fetching, and cloud-based image storage.

🚀 Project Status
✅ Completed Till Now

Frontend & Backend Setup

React (Vite + Tailwind CSS) for frontend

Node.js + Express.js + MongoDB for backend

CORS and Axios integrated for smooth API communication

User Authentication

JWT-based Login and Registration for both Individuals and Companies

Passwords securely hashed using Bcrypt

Design Upload Feature

Image uploads integrated via Cloudinary

Designs stored and retrieved successfully from MongoDB

Real-Time Design Display

Designs fetched dynamically by category (Dress, Jewellery, Shoes)

Auto-refresh for real-time updates

Hosting

Backend: https://style-bcgu.onrender.com

Frontend: https://style-ten-ecru.vercel.app

🔮 Future Enhancements
Upcoming Features:

💬 Like, Share & Comment System – Allow users to interact with designs

🤝 Collaboration & Sponsorship Requests – Companies can send offers; designers can respond

📱 SMS Notifications (Twilio Integration) – Notify users about new requests and updates

📊 Advanced Analytics Dashboard – Insights on views, likes, and collaboration performance

🛠 Tech Stack
Frontend

React 19.1.0 – Modern React with hooks and context

Vite + Tailwind CSS – Fast development and clean UI

React Router DOM 7.6.3 – Client-side routing

Axios – API communication

React Toastify – Toast notifications

React Hook Form – Efficient form handling

Backend

Node.js 18+ – Server runtime

Express.js – REST API framework

MongoDB Atlas + Mongoose – Cloud-based database

JWT – Token-based authentication

Bcrypt – Password hashing

Cloudinary – Image upload and optimization

⚙️ Setup Instructions
1. Clone the Repository
git clone <repository-url>
cd runway

2. Install Dependencies
npm install

3. Environment Setup

Create a .env file in your backend root directory:

PORT=5000

MONGODB_URI=your-mongodb-uri

JWT_SECRET=your-jwt-secret
JWT_EXPIRATION=1d

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

CLIENT_URL=https://style-nygy8fv5w-aditipanda01s-projects.vercel.app/shoes


⚠️ Note: Do not expose your actual credentials in public repositories.
Keep this file private and add .env to your .gitignore.

4. Start Development Servers
Backend
npm run dev


API available at:
http://localhost:5000/api

Frontend
npm run dev


Frontend available at:
http://localhost:5173

🌐 Deployment
Hosted Links

Backend: https://style-bcgu.onrender.com

Frontend: https://style-ten-ecru.vercel.app

Deployment Steps

Frontend (Vercel):

Connect the repository to Vercel

Add environment variables from .env

Deploy automatically on push

Backend (Render):

Deploy the Express server

Add MongoDB and Cloudinary credentials in the Render dashboard

📦 Current Features
👩‍🎨 For Individual Designers

Register and log in securely

Upload and showcase portfolio designs

Designs visible in categorized sections

Cloudinary integration for image storage

🏢 For Companies

Register and explore available designs

Browse by category and design type

(Upcoming) Send collaboration/sponsorship requests

🔐 Core Platform

Secure JWT-based authentication

MongoDB Atlas integration

Cloudinary for design media

Real-time category-based fetching

📊 API Overview
Authentication
// Register
POST /api/auth/register
{
  "userType": "individual" | "company",
  "email": "user@example.com",
  "password": "password123"
}

// Login
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

Designs
// Upload Design
POST /api/designs
{
  "title": "Summer Collection",
  "description": "Sustainable summer dresses",
  "category": "dress",
  "images": [{"url": "...", "publicId": "..."}]
}

// Fetch Designs by Category
GET /api/designs?category=dress

🎨 UI Design System
Color Palette

Primary: #181818

Secondary: #ede7df

Accent: #007bff

Success: #28a745

Warning: #ffc107

Danger: #dc3545

Typography

Headers: Bebas Neue

Body: Montserrat

Accent: Cormorant Garamond

📄 License

This project is licensed under the MIT License.

💬 Support

For issues or suggestions:

Open an issue in the repository

Check API documentation and setup steps

❤️ Built For

The global fashion design community — empowering creativity and collaboration.

#SketchToStyle #Style