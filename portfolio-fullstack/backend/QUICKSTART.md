# Quick Start Guide

Get your Portfolio Backend up and running in 5 minutes!

## 🚀 Super Quick Start (For Testing)

### 1. Clone & Install
```bash
cd backend
npm install
```

### 2. Create `.env` File
```bash
cp .env.example .env
```

Edit `.env` with minimum required values:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/portfolio
JWT_SECRET=my-super-secret-jwt-key-12345
JWT_REFRESH_SECRET=my-refresh-secret-12345
FRONTEND_URL=http://localhost:5173
```

### 3. Start MongoDB
```bash
# If you have MongoDB installed locally:
mongod

# OR use Docker:
docker run -d -p 27017:27017 --name mongodb mongo:7.0

# OR skip local setup and use MongoDB Atlas (free cloud database)
# Sign up at: https://www.mongodb.com/cloud/atlas
# Get connection string and update MONGODB_URI
```

### 4. Seed Database (Optional but Recommended)
```bash
npm run seed
```

This creates:
- Admin user (admin@portfolio.com / Admin@123456)
- Sample projects
- Sample messages

### 5. Start Server
```bash
npm run dev
```

### 6. Test It!
Open browser: `http://localhost:5000`

You should see:
```json
{
  "message": "Portfolio Backend API",
  "version": "1.0.0",
  "endpoints": { ... }
}
```

---

## 📱 Test with Postman

### Import Collection
1. Open Postman
2. Click "Import"
3. Select `Portfolio-API.postman_collection.json`
4. Set variables:
   - `base_url`: `http://localhost:5000/api`
   - `token`: (will be set after login)

### Test Login
1. Go to "Authentication" → "Login"
2. Use credentials: `admin@portfolio.com` / `Admin@123456`
3. Copy the token from response
4. Set it in Postman environment variable

### Test Other Endpoints
Now you can test all other endpoints with the token!

---

## 🎨 Frontend Integration Examples

### Setup Axios in React/Vite

#### 1. Install Axios
```bash
npm install axios
```

#### 2. Create API Service (`src/services/api.js`)
```javascript
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to all requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired - try to refresh
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const { data } = await axios.post(
            'http://localhost:5000/api/auth/refresh-token',
            { refreshToken }
          );
          localStorage.setItem('token', data.data.token);
          localStorage.setItem('refreshToken', data.data.refreshToken);
          // Retry original request
          return API(error.config);
        } catch (refreshError) {
          // Refresh failed - logout
          localStorage.clear();
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default API;
```

#### 3. Create Auth Context (`src/context/AuthContext.jsx`)
```javascript
import { createContext, useState, useContext, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const { data } = await API.get('/auth/me');
        setUser(data.data);
      } catch (error) {
        localStorage.clear();
      }
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      const { data } = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('refreshToken', data.data.refreshToken);
      setUser(data.data.user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await API.post('/auth/register', { name, email, password });
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('refreshToken', data.data.refreshToken);
      setUser(data.data.user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  const logout = async () => {
    try {
      await API.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

#### 4. Create Projects Hook (`src/hooks/useProjects.js`)
```javascript
import { useState, useEffect } from 'react';
import API from '../services/api';

export const useProjects = (filters = {}) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, [filters]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams(filters).toString();
      const { data } = await API.get(`/projects?${params}`);
      setProjects(data.data);
      setPagination(data.pagination);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const getFeaturedProjects = async (limit = 6) => {
    try {
      const { data } = await API.get(`/projects/featured?limit=${limit}`);
      return data.data;
    } catch (err) {
      console.error('Error fetching featured projects:', err);
      return [];
    }
  };

  const getProjectById = async (id) => {
    try {
      const { data } = await API.get(`/projects/${id}`);
      return data.data;
    } catch (err) {
      console.error('Error fetching project:', err);
      return null;
    }
  };

  return { projects, loading, error, pagination, getFeaturedProjects, getProjectById };
};
```

#### 5. Example Component - Projects List
```javascript
import { useProjects } from '../hooks/useProjects';

const ProjectsList = () => {
  const { projects, loading, error } = useProjects({ page: 1, limit: 9 });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <div key={project._id} className="bg-white rounded-lg shadow-md p-6">
          <img
            src={project.thumbnail}
            alt={project.title}
            className="w-full h-48 object-cover rounded-md mb-4"
          />
          <h3 className="text-xl font-bold mb-2">{project.title}</h3>
          <p className="text-gray-600 mb-4">{project.shortDescription}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {tech}
              </span>
            ))}
          </div>
          <a
            href={`/projects/${project._id}`}
            className="text-blue-600 hover:underline"
          >
            View Details →
          </a>
        </div>
      ))}
    </div>
  );
};
```

#### 6. Example Component - Contact Form
```javascript
import { useState } from 'react';
import API from '../services/api';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'General Inquiry'
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await API.post('/messages', formData);
      setStatus({ type: 'success', message: data.message });
      setFormData({ name: '', email: '', subject: '', message: '', category: 'General Inquiry' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Failed to send message'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
      <input
        type="text"
        placeholder="Your Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
        className="w-full px-4 py-2 border rounded-md mb-4"
      />
      <input
        type="email"
        placeholder="Your Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
        className="w-full px-4 py-2 border rounded-md mb-4"
      />
      <input
        type="text"
        placeholder="Subject"
        value={formData.subject}
        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
        required
        className="w-full px-4 py-2 border rounded-md mb-4"
      />
      <textarea
        placeholder="Your Message"
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        required
        rows={5}
        className="w-full px-4 py-2 border rounded-md mb-4"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Sending...' : 'Send Message'}
      </button>
      {status.message && (
        <div className={`mt-4 p-3 rounded ${status.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {status.message}
        </div>
      )}
    </form>
  );
};
```

---

## 🔧 Common Commands

```bash
# Development
npm run dev          # Start with nodemon (auto-reload)

# Production
npm start            # Start server

# Database
npm run seed         # Seed sample data

# Testing
npm test            # Run tests (if configured)

# Linting
npm run lint        # Check code quality
```

---

## 🐛 Troubleshooting

### Port 5000 Already in Use?
```bash
# Kill process on port 5000
lsof -i :5000
kill -9 <PID>

# Or change port in .env
PORT=3000
```

### MongoDB Connection Error?
```bash
# Check if MongoDB is running
mongosh

# If not, start it:
mongod

# Or use Docker:
docker start mongodb
```

### Can't Send Emails?
- Use Gmail App Password (not regular password)
- Generate at: https://myaccount.google.com/apppasswords
- Enable 2FA first

---

## 📚 Next Steps

1. **Customize Models**: Add fields to User, Project, Message models
2. **Add Features**: Implement blog, comments, ratings, etc.
3. **Deploy**: Follow [DEPLOYMENT.md](DEPLOYMENT.md) guide
4. **Frontend**: Integrate with your Vite + React app
5. **Testing**: Add unit and integration tests

---

## 💡 Tips

- Use environment variables for all secrets
- Never commit `.env` file
- Keep dependencies updated: `npm outdated`
- Monitor logs in production
- Setup automated backups for database
- Use HTTPS in production
- Implement rate limiting for public endpoints

---

Happy coding! 🚀
