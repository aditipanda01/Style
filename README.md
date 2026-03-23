# ✨ The Runway – Fashion Design Collaboration Platform

A full-stack fashion design collaboration platform connecting individual designers and companies for creative partnerships and sponsorship opportunities. The platform supports portfolio uploads, JWT-secured authentication, real-time design fetching, cloud-based image storage, and a fully responsive UI across all screen sizes.

---

## 🚀 Project Status

### ✅ Completed Till Now

#### Frontend & Backend Setup
- React (Vite) for frontend
- Node.js + Express.js + MongoDB for backend
- CORS and Axios integrated for smooth API communication

#### User Authentication
- JWT-based Login and Registration for both Individuals and Companies
- Passwords securely hashed using Bcrypt

#### Design Upload Feature
- Image uploads integrated via Cloudinary
- Designs stored and retrieved successfully from MongoDB

#### Real-Time Design Display
- Designs fetched dynamically by category (Dress, Jewellery, Shoes)
- Auto-refresh for real-time updates

#### 💬 Social Interactions (NEW)
- Like, comment, and share on designs across all three category pages
- Like count, comment count, and share count tracked per design
- Comments panel with real-time add and fetch
- Share via Web Share API with clipboard fallback

#### 👥 Follow System (NEW)
- Individual users and companies can follow designers
- Follow / Unfollow toggle on every design card
- Following count tracked in profile stats

#### 🏢 Company Dashboard (NEW)
- Dedicated dashboard for company accounts — separate from individual designer view
- **Top Info:** Company name, email, account type, website
- **Stats:** Requirements Posted, Collaborations, Shortlisted Designs, Designers Following
- **Post New Requirement** — modal with title, category, budget, timeline, description
- **My Posted Requirements** — same card style as design submissions with delete
- **Collaborations** — Sent / Received / Active tabs with Accept, Decline, and Message actions
- **Shortlisted Designs** — saved designs renamed and repurposed for company workflow
- **Liked Designs** — designs liked by the company account
- **Following Designers** — list of all followed designer profiles
- Automatic routing: `user.userType === "company"` → Company Dashboard; otherwise → Individual Dashboard

#### 📱 Fully Responsive UI (NEW)
- **Navbar / Header** — removed broken `marginLeft: -100` overflow; clean flex layout with mobile-scaled fonts and gaps
- **Hero Section** — desktop layout pixel-perfect preserved; mobile collapses to text-first then images side by side; right column (pic2 + blob) hidden on mobile to avoid black-background overflow
- **Quote Section** — `marginTop` and font sizes scale per breakpoint; `whiteSpace: nowrap` removed on mobile so text wraps correctly
- **Designer of the Week** — switches from side-by-side to stacked column on mobile; images retain exact desktop aspect ratio (200:260 scaled to 140:182)
- **Partnered Companies** — logo circles scale from 180px → 140px (tablet) → 90px (mobile); `flex-wrap` keeps rows from overflowing
- **Category Pages (Dress, Jewellery, Shoes)** — all three now use shared CSS classes from `App.css` instead of inline styles, so sizing is controlled from one place

#### 🗂️ Code Architecture (NEW)
- `DressPage.jsx` — extracted from `App.jsx` into its own file
- `Jewellery.jsx` — refactored to use CSS class-based layout (removed inline style overrides)
- `CompanyDashboard.jsx` — new standalone component
- `Profile.jsx` — now a router: renders `CompanyDashboard` or `IndividualProfile` based on `userType`

#### Hosting
- Backend: https://style-bcgu.onrender.com
- Frontend: https://style-ten-ecru.vercel.app

---

## 🔮 Future Enhancements

- 📱 SMS Notifications (Twilio Integration) — notify users about new requests and updates
- 📊 Advanced Analytics Dashboard — insights on views, likes, and collaboration performance
- 🔍 Search and filter across designs
- 🏷️ Tags and collections for designs

---

## 🛠 Tech Stack

### Frontend
- **React 19.1.0** — modern React with hooks and context
- **Vite** — fast development builds
- **React Router DOM 7.6.3** — client-side routing
- **Axios** — API communication
- **React Toastify** — toast notifications
- **React Hook Form** — efficient form handling
- **CSS Media Queries** — responsive layout across mobile, tablet, desktop

### Backend
- **Node.js 18+** — server runtime
- **Express.js** — REST API framework
- **MongoDB Atlas + Mongoose** — cloud-based database
- **JWT** — token-based authentication
- **Bcrypt** — password hashing
- **Cloudinary** — image upload and optimization

---

## ⚙️ Setup Instructions

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

Create a `.env` file in your backend root directory:

```env
PORT=5000

MONGODB_URI=your-mongodb-uri

JWT_SECRET=your-jwt-secret
JWT_EXPIRATION=1d

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

CLIENT_URL=https://style-ten-ecru.vercel.app
```

> ⚠️ Do not expose your actual credentials in public repositories. Keep this file private and add `.env` to your `.gitignore`.

### 4. Start Development Servers

**Backend**
```bash
npm run dev
```
API available at: `http://localhost:5000/api`

**Frontend**
```bash
npm run dev
```
Frontend available at: `http://localhost:5173`

---

## 🌐 Deployment

### Hosted Links
- **Backend:** https://style-bcgu.onrender.com
- **Frontend:** https://style-ten-ecru.vercel.app

### Deployment Steps

**Frontend (Vercel):**
1. Connect the repository to Vercel
2. Add environment variables from `.env`
3. Deploy automatically on push

**Backend (Render):**
1. Deploy the Express server
2. Add MongoDB and Cloudinary credentials in the Render dashboard

---

## 📦 Current Features

### 👩‍🎨 For Individual Designers
- Register and log in securely
- Upload and showcase portfolio designs
- Designs visible in categorized sections (Dress, Jewellery, Shoes)
- Cloudinary integration for image storage
- Like, comment, and share on other designs
- Follow other designers
- Profile dashboard with stats: Designs Submitted, Total Likes, Followers, Following

### 🏢 For Companies
- Register and explore available designs
- Browse by category and design type
- Post design requirements with budget and timeline
- Manage collaborations (accept, decline, message)
- Shortlist and like designs
- Follow individual designers
- Dedicated company dashboard with tailored stats and sections

### 🔐 Core Platform
- Secure JWT-based authentication
- MongoDB Atlas integration
- Cloudinary for design media
- Real-time category-based fetching
- Fully responsive UI (mobile, tablet, desktop)

---

## 📊 API Overview

### Authentication
```js
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
```

### Designs
```js
// Upload Design / Post Requirement
POST /api/designs
{
  "title": "Summer Collection",
  "description": "Sustainable summer dresses",
  "category": "dress",
  "images": [{ "url": "...", "publicId": "..." }]
}

// Fetch Designs by Category
GET /api/designs?category=dress

// Like a Design
POST /api/designs/:id/like

// Unlike a Design
DELETE /api/designs/:id/like

// Share a Design
POST /api/designs/:id/share

// Get Comments
GET /api/designs/:id/comments

// Add Comment
POST /api/designs/:id/comments
{ "text": "Amazing work!" }
```

### Users
```js
// Follow a User
POST /api/users/:id/follow

// Unfollow a User
DELETE /api/users/:id/follow

// Get Profile Stats
GET /api/profile
```

### Collaborations
```js
// Get All Collaborations
GET /api/collaborations

// Respond to Collaboration
PUT /api/collaborations/:id/respond
{ "action": "accept" | "decline" }
```

---

## 🎨 UI Design System

### Color Palette
| Token | Value |
|---|---|
| Primary | `#181818` |
| Secondary | `#ede7df` |
| Accent | `#007bff` |
| Gold | `#FFD600` |
| Teal | `#4ecdc4` |
| Success | `#28a745` |
| Warning | `#ffc107` |
| Danger | `#dc3545` |

### Typography
| Role | Font |
|---|---|
| Headers | Bebas Neue |
| Body | Montserrat |
| Accent / Italic | Cormorant Garamond |
| Script | Great Vibes |

### Responsive Breakpoints
| Breakpoint | Width |
|---|---|
| Mobile | < 768px |
| Tablet | 768px – 1024px |
| Desktop | > 1024px |

---

## 📄 License

This project is licensed under the MIT License.

---

## 💬 Support

For issues or suggestions:
- Open an issue in the repository
- Check API documentation and setup steps

---

## ❤️ Built For

The global fashion design community — empowering creativity and collaboration.

**#SketchToStyle #TheRunway**
