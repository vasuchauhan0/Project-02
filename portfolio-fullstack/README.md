# Portfolio Full-Stack Application

Complete portfolio application with React frontend and Node.js backend, fully integrated and tested.

## 📁 Project Structure

```
portfolio-fullstack/
├── backend/                 # Node.js + Express + MongoDB
│   ├── controllers/        # API business logic
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Authentication & validation
│   ├── utils/             # Helper functions
│   ├── seeders/           # Database seeders
│   └── server.js          # Backend entry point
│
├── frontend/               # React + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── context/       # Auth context
│   │   ├── pages/         # Page components
│   │   ├── services/      # API integration
│   │   └── App.jsx        # Main app
│   └── public/            # Static assets
│
├── package.json           # Root package manager
└── README.md             # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- npm or yarn

### Option 1: Install Everything at Once

```bash
# Install all dependencies (root, backend, and frontend)
npm run install:all
```

### Option 2: Manual Installation

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### Setup Environment Variables

**Backend:**
```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and secrets
```

**Frontend:**
```bash
cd frontend
cp .env.example .env
# Edit .env with backend API URL (default: http://localhost:5000/api)
```

### Start MongoDB

Choose one option:

```bash
# Option A: Local MongoDB
mongod

# Option B: Docker
docker run -d -p 27017:27017 --name mongodb mongo:7.0

# Option C: Use MongoDB Atlas (cloud)
# Get connection string from https://cloud.mongodb.com
```

### Seed Database

```bash
# Populate with sample data
npm run seed
```

### Start Development

**Option 1: Run Both Together (Recommended)**
```bash
npm run dev
```
- Backend runs on: http://localhost:5000
- Frontend runs on: http://localhost:5173

**Option 2: Run Separately**
```bash
# Terminal 1 - Backend
npm run backend

# Terminal 2 - Frontend
npm run frontend
```

## 🔑 Default Login Credentials

After seeding:
- **Email:** admin@portfolio.com
- **Password:** Admin@123456

## 📚 Available Scripts

### Root Level
```bash
npm run install:all    # Install all dependencies
npm run dev           # Run both backend and frontend
npm run backend       # Run only backend
npm run frontend      # Run only frontend
npm run seed          # Seed database
npm run build:frontend # Build frontend for production
```

### Backend (cd backend)
```bash
npm run dev           # Start with nodemon
npm start            # Production start
npm run seed         # Seed database
```

### Frontend (cd frontend)
```bash
npm run dev          # Development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## ✅ Testing Checklist

### Backend API Tests

1. **Health Check**
   ```bash
   curl http://localhost:5000/api/health
   ```

2. **Register User**
   ```bash
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Test User","email":"test@test.com","password":"Test@123456"}'
   ```

3. **Login**
   ```bash
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@portfolio.com","password":"Admin@123456"}'
   ```

4. **Get Projects**
   ```bash
   curl http://localhost:5000/api/projects
   ```

5. **Send Message**
   ```bash
   curl -X POST http://localhost:5000/api/messages \
     -H "Content-Type: application/json" \
     -d '{"name":"John","email":"john@test.com","subject":"Test","message":"Testing"}'
   ```

### Frontend Tests

1. **Home Page** - http://localhost:5173
   - ✅ Hero section displays
   - ✅ Featured projects load
   - ✅ GitHub repos display
   - ✅ Navigation works

2. **Projects Page** - http://localhost:5173/projects
   - ✅ All projects display
   - ✅ Category filters work
   - ✅ Search functionality works
   - ✅ Pagination works

3. **Project Detail** - http://localhost:5173/projects/:id
   - ✅ Project details load
   - ✅ Technologies display
   - ✅ Links work

4. **Contact Page** - http://localhost:5173/contact
   - ✅ Form submits successfully
   - ✅ Validation works
   - ✅ Success message shows

5. **Login** - http://localhost:5173/login
   - ✅ Login form works
   - ✅ Token saved
   - ✅ Redirects to dashboard

6. **Register** - http://localhost:5173/register
   - ✅ Registration works
   - ✅ User created
   - ✅ Auto-login after registration

7. **Dashboard** - http://localhost:5173/dashboard
   - ✅ Protected route works
   - ✅ User info displays
   - ✅ Logout works

## 🔧 Configuration

### Backend Environment (.env)

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/portfolio
JWT_SECRET=your_jwt_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_key_here
FRONTEND_URL=http://localhost:5173
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
GITHUB_TOKEN=your_github_token
GITHUB_USERNAME=vasuchauhan0
ADMIN_EMAIL=admin@portfolio.com
ADMIN_PASSWORD=Admin@123456
```

### Frontend Environment (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

## 📡 API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/logout` - Logout (protected)
- `PUT /api/auth/update-profile` - Update profile (protected)
- `PUT /api/auth/update-password` - Change password (protected)

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/featured` - Get featured projects
- `GET /api/projects/:id` - Get project by ID
- `GET /api/projects/category/:category` - Filter by category
- `GET /api/projects/search?q=query` - Search projects
- `GET /api/projects/github-repos` - Get GitHub repos
- `POST /api/projects/:id/view` - Increment views
- `POST /api/projects/:id/like` - Like project
- `POST /api/projects` - Create project (admin)
- `PUT /api/projects/:id` - Update project (admin)
- `DELETE /api/projects/:id` - Delete project (admin)

### Messages
- `POST /api/messages` - Send message (contact form)
- `GET /api/messages` - Get all messages (admin)
- `GET /api/messages/unread-count` - Get unread count (admin)
- `GET /api/messages/:id` - Get message by ID (admin)
- `PUT /api/messages/:id/status` - Update status (admin)
- `POST /api/messages/:id/reply` - Reply to message (admin)

### Users (Admin)
- `GET /api/users` - Get all users
- `GET /api/users/stats` - Get user statistics
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## 🧪 Testing with Postman

1. Import `backend/Portfolio-API.postman_collection.json`
2. Set variables:
   - `base_url`: http://localhost:5000/api
   - `token`: (will be set after login)
3. Test all endpoints

## 🐛 Troubleshooting

### Backend Issues

**MongoDB Connection Failed**
```bash
# Check MongoDB is running
mongosh

# Start MongoDB
mongod

# Or use Docker
docker start mongodb
```

**Port 5000 in use**
```bash
# Find and kill process
lsof -i :5000
kill -9 <PID>

# Or change port in backend/.env
PORT=3000
```

**Email not sending**
- Use Gmail App Password (not regular password)
- Enable 2FA first
- Generate at: https://myaccount.google.com/apppasswords

### Frontend Issues

**Cannot connect to backend**
- Verify backend is running on port 5000
- Check VITE_API_URL in frontend/.env
- Check browser console for CORS errors

**Dependencies error**
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 🚀 Deployment

### Backend
- Heroku, Railway, Render, or DigitalOcean
- See `backend/DEPLOYMENT.md` for detailed guides

### Frontend
- Vercel (recommended), Netlify, or Cloudflare Pages
- Build command: `npm run build`
- Publish directory: `dist`

## 📚 Features

### Backend Features
- ✅ User authentication (JWT)
- ✅ Password hashing (bcrypt)
- ✅ Email notifications
- ✅ GitHub integration
- ✅ Rate limiting
- ✅ Input validation
- ✅ Error handling
- ✅ CORS configuration

### Frontend Features
- ✅ Responsive design
- ✅ Authentication pages
- ✅ Protected routes
- ✅ Project showcase
- ✅ Contact form
- ✅ User dashboard
- ✅ Toast notifications
- ✅ Loading states
- ✅ Smooth animations

## 🔐 Security

- JWT token authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- Input validation and sanitization
- CORS configuration
- Helmet security headers
- Environment variables for secrets

## 📄 License

MIT License

## 👨‍💻 Author

Vasu Chauhan
- GitHub: [@vasuchauhan0](https://github.com/vasuchauhan0)

## 🙏 Acknowledgments

- React Team
- Express.js
- MongoDB
- Tailwind CSS
- All open-source contributors

---

**Happy Coding! 🚀**

Need help? Check the documentation in `/backend` and `/frontend` folders.
