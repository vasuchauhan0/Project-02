# Portfolio Backend API

Complete backend solution for your portfolio project with user authentication, project management, and contact messaging system.

## 🚀 Features

- **User Authentication**: Complete auth system with JWT tokens, password reset, and refresh tokens
- **Project Management**: CRUD operations for portfolio projects with filtering and search
- **GitHub Integration**: Fetch repositories directly from GitHub API
- **Contact Messages**: Handle contact form submissions with email notifications
- **Admin Dashboard**: Manage users, projects, and messages
- **Email Service**: Automated email notifications
- **Security**: Rate limiting, helmet, input validation, and sanitization
- **MongoDB**: Robust database with Mongoose ODM

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn
- Gmail account (for email service) or other SMTP service

## 🛠️ Installation

### 1. Clone the repository

```bash
cd backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Then edit `.env` with your actual values:

```env
# Server
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173

# MongoDB
MONGODB_URI=mongodb://localhost:27017/portfolio

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_REFRESH_EXPIRE=30d

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@portfolio.com

# GitHub
GITHUB_TOKEN=your_github_token
GITHUB_USERNAME=vasuchauhan0

# Admin
ADMIN_EMAIL=admin@portfolio.com
ADMIN_PASSWORD=Admin@123456
```

### 4. Setup Gmail for Email Service

1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Generate an App Password: https://myaccount.google.com/apppasswords
4. Use this App Password in `EMAIL_PASSWORD`

### 5. Setup MongoDB

**Option A: Local MongoDB**
```bash
# Install MongoDB
# Then start MongoDB service
mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

### 6. Run the server

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server will run on `http://localhost:5000`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

#### Update Profile
```http
PUT /api/auth/update-profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Updated",
  "bio": "Full Stack Developer"
}
```

#### Update Password
```http
PUT /api/auth/update-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "Password123",
  "newPassword": "NewPassword123"
}
```

#### Forgot Password
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

### Project Endpoints

#### Get All Projects
```http
GET /api/projects?page=1&limit=10&category=Web Development
```

#### Get Featured Projects
```http
GET /api/projects/featured?limit=6
```

#### Get Project by ID
```http
GET /api/projects/:id
```

#### Get GitHub Repositories
```http
GET /api/projects/github-repos?username=vasuchauhan0&limit=6
```

#### Create Project (Admin)
```http
POST /api/projects
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "title": "E-Commerce Website",
  "description": "Full stack e-commerce platform",
  "shortDescription": "Modern online shopping experience",
  "thumbnail": "https://example.com/image.jpg",
  "technologies": ["React", "Node.js", "MongoDB"],
  "category": "Full Stack",
  "liveUrl": "https://example.com",
  "githubUrl": "https://github.com/user/repo",
  "status": "Completed",
  "featured": true
}
```

#### Update Project (Admin)
```http
PUT /api/projects/:id
Authorization: Bearer <admin-token>
Content-Type: application/json
```

#### Delete Project (Admin)
```http
DELETE /api/projects/:id
Authorization: Bearer <admin-token>
```

#### Increment Project Views
```http
POST /api/projects/:id/view
```

#### Like Project
```http
POST /api/projects/:id/like
```

### Message Endpoints

#### Send Message (Contact Form)
```http
POST /api/messages
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "subject": "Project Inquiry",
  "message": "I'd like to discuss a project...",
  "category": "Project Proposal"
}
```

#### Get All Messages (Admin)
```http
GET /api/messages?page=1&limit=20&status=new
Authorization: Bearer <admin-token>
```

#### Get Message by ID (Admin)
```http
GET /api/messages/:id
Authorization: Bearer <admin-token>
```

#### Update Message Status (Admin)
```http
PUT /api/messages/:id/status
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "status": "read"
}
```

#### Reply to Message (Admin)
```http
POST /api/messages/:id/reply
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "replyMessage": "Thank you for reaching out..."
}
```

#### Get Unread Count (Admin)
```http
GET /api/messages/unread-count
Authorization: Bearer <admin-token>
```

### User Management Endpoints (Admin)

#### Get All Users
```http
GET /api/users?page=1&limit=20
Authorization: Bearer <admin-token>
```

#### Get User Stats
```http
GET /api/users/stats
Authorization: Bearer <admin-token>
```

#### Update User
```http
PUT /api/users/:id
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "role": "admin",
  "isActive": true
}
```

## 📁 Project Structure

```
backend/
├── controllers/          # Business logic
│   ├── authController.js
│   ├── projectController.js
│   ├── messageController.js
│   └── userController.js
├── models/              # Database schemas
│   ├── User.js
│   ├── Project.js
│   └── Message.js
├── routes/              # API routes
│   ├── auth.js
│   ├── projects.js
│   ├── messages.js
│   └── users.js
├── middleware/          # Custom middleware
│   ├── auth.js
│   └── validator.js
├── utils/               # Helper functions
│   └── emailService.js
├── .env.example         # Environment variables template
├── .gitignore
├── package.json
├── README.md
└── server.js            # Entry point
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Using bcryptjs
- **Rate Limiting**: Prevent abuse
- **Helmet**: Security headers
- **Input Validation**: Using express-validator
- **XSS Protection**: Input sanitization
- **CORS**: Configured for frontend

## 🎨 Frontend Integration

### Setting up Axios in Frontend

```javascript
// src/utils/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
```

### Example: Login in Frontend

```javascript
import API from './utils/api';

const login = async (email, password) => {
  try {
    const response = await API.post('/auth/login', { email, password });
    localStorage.setItem('token', response.data.data.token);
    return response.data;
  } catch (error) {
    console.error('Login failed:', error.response.data);
  }
};
```

### Example: Fetch Projects

```javascript
const fetchProjects = async () => {
  try {
    const response = await API.get('/projects?limit=10');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching projects:', error);
  }
};
```

### Example: Contact Form

```javascript
const sendMessage = async (formData) => {
  try {
    const response = await API.post('/messages', formData);
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
  }
};
```

## 🧪 Testing

Test the API using:
- **Postman**: Import endpoints and test
- **Thunder Client**: VS Code extension
- **curl**: Command line testing

Example curl test:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"Test123"}'
```

## 🚀 Deployment

### Deploy to Heroku

```bash
# Install Heroku CLI
heroku create your-app-name
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your_mongodb_uri
# ... set other env variables
git push heroku main
```

### Deploy to Railway

1. Push code to GitHub
2. Import repository on Railway
3. Add environment variables
4. Deploy

### Deploy to Render

1. Connect GitHub repository
2. Select Node.js environment
3. Add environment variables
4. Deploy

## 📝 Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| NODE_ENV | Environment (development/production) | Yes |
| PORT | Server port | Yes |
| MONGODB_URI | MongoDB connection string | Yes |
| JWT_SECRET | JWT secret key | Yes |
| JWT_EXPIRE | JWT expiration time | Yes |
| EMAIL_USER | Email service username | Yes |
| EMAIL_PASSWORD | Email service password | Yes |
| GITHUB_TOKEN | GitHub personal access token | Optional |
| GITHUB_USERNAME | Your GitHub username | Optional |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Vasu Chauhan**
- GitHub: [@vasuchauhan0](https://github.com/vasuchauhan0)

## 🙏 Support

If you found this helpful, please give it a ⭐️!

## 📞 Contact

For questions or support, please open an issue or contact via the contact form on the portfolio.
