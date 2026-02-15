# Portfolio Frontend

Modern, responsive portfolio website built with React, Vite, and Tailwind CSS. Fully integrated with the backend API.

## 🚀 Features

- **Modern UI**: Beautiful, responsive design with Tailwind CSS
- **Authentication**: Complete user authentication system
- **Projects Showcase**: Display portfolio projects with filtering and search
- **Contact Form**: Integrated contact form with backend
- **Dashboard**: User dashboard for authenticated users
- **GitHub Integration**: Display GitHub repositories
- **Animations**: Smooth animations with Framer Motion
- **Toast Notifications**: User-friendly notifications

## 📦 Tech Stack

- **React 18** - UI library
- **Vite** - Build tool
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Framer Motion** - Animations
- **React Toastify** - Notifications
- **React Icons** - Icon library

## 🛠️ Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your backend API URL:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Start Development Server

```bash
npm run dev
```

The app will run on `http://localhost:5173`

## 📁 Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable components
│   │   ├── layout/       # Layout components (Navbar, Footer)
│   │   └── ProtectedRoute.jsx
│   ├── context/          # React Context
│   │   └── AuthContext.jsx
│   ├── pages/            # Page components
│   │   ├── Home.jsx
│   │   ├── Projects.jsx
│   │   ├── ProjectDetail.jsx
│   │   ├── Contact.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   └── NotFound.jsx
│   ├── services/         # API services
│   │   └── api.js
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🎨 Pages

### Public Pages
- **Home** (`/`) - Landing page with featured projects
- **Projects** (`/projects`) - All projects with filters and search
- **Project Detail** (`/projects/:id`) - Individual project details
- **Contact** (`/contact`) - Contact form
- **Login** (`/login`) - User login
- **Register** (`/register`) - User registration

### Protected Pages
- **Dashboard** (`/dashboard`) - User dashboard (requires authentication)

## 🔑 Authentication Flow

1. **Register**: Create a new account at `/register`
2. **Login**: Sign in at `/login`
3. **Auto Token Management**: Tokens are automatically stored and refreshed
4. **Protected Routes**: Dashboard requires authentication
5. **Logout**: Available in navbar when logged in

## 📡 API Integration

The frontend is fully integrated with the backend API:

### Authentication API
```javascript
import { authAPI } from './services/api';

// Register
await authAPI.register({ name, email, password });

// Login
await authAPI.login({ email, password });

// Get current user
await authAPI.getMe();

// Logout
await authAPI.logout();
```

### Projects API
```javascript
import { projectsAPI } from './services/api';

// Get all projects
await projectsAPI.getAll({ page: 1, limit: 10 });

// Get featured projects
await projectsAPI.getFeatured(6);

// Get project by ID
await projectsAPI.getById(projectId);

// Search projects
await projectsAPI.search('react', { page: 1 });

// Get GitHub repos
await projectsAPI.getGithubRepos('username', 6);
```

### Messages API
```javascript
import { messagesAPI } from './services/api';

// Send contact message
await messagesAPI.send({
  name: 'John Doe',
  email: 'john@example.com',
  subject: 'Inquiry',
  message: 'Hello...',
  category: 'General Inquiry'
});
```

## 🎯 Features Implementation

### Authentication Context
The app uses React Context for authentication state management:
- Automatic token refresh
- Protected routes
- User state management
- Login/logout functionality

### API Service
Centralized API service with:
- Axios instance configuration
- Request/response interceptors
- Token management
- Error handling

### Responsive Design
- Mobile-first approach
- Tailwind CSS utilities
- Responsive navigation
- Adaptive layouts

### Animations
- Framer Motion for smooth animations
- Page transitions
- Component animations
- Hover effects

## 🚀 Build for Production

```bash
# Build the app
npm run build

# Preview production build
npm run preview
```

The build will be in the `dist/` folder.

## 🌐 Deployment

### Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Set environment variables in Vercel dashboard:
   - `VITE_API_URL` - Your production API URL

### Netlify

1. Build command: `npm run build`
2. Publish directory: `dist`
3. Environment variables:
   - `VITE_API_URL` - Your production API URL

### Other Platforms
- Works on any static hosting (GitHub Pages, Cloudflare Pages, etc.)
- Just build and deploy the `dist/` folder

## 🔧 Customization

### Change Colors
Edit `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom colors
      }
    }
  }
}
```

### Update API URL
Edit `.env`:
```env
VITE_API_URL=https://your-api-url.com/api
```

### Add New Pages
1. Create component in `src/pages/`
2. Add route in `src/App.jsx`
3. Update navigation in `src/components/layout/Navbar.jsx`

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| VITE_API_URL | Backend API URL | Yes |

## 🤝 Integration with Backend

Make sure your backend is running before starting the frontend:

1. Start backend: `cd backend && npm run dev`
2. Backend runs on: `http://localhost:5000`
3. Start frontend: `cd frontend && npm run dev`
4. Frontend runs on: `http://localhost:5173`

## 🐛 Troubleshooting

### CORS Errors
- Make sure backend CORS is configured for `http://localhost:5173`
- Check `FRONTEND_URL` in backend `.env`

### API Connection Failed
- Verify backend is running
- Check `VITE_API_URL` in frontend `.env`
- Ensure ports are correct

### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install

# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

## 📚 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🎨 Styling Guide

### Tailwind Classes
- Primary color: `bg-primary-600`, `text-primary-600`
- Spacing: `p-4`, `m-4`, `space-x-4`
- Responsive: `md:`, `lg:`, `xl:`
- Hover: `hover:bg-primary-700`

### Custom Animations
- `fade-in-up` - Fade in from bottom
- `spinner` - Loading spinner
- `text-gradient` - Gradient text

## 🔐 Security

- JWT tokens stored in localStorage
- Automatic token refresh
- Protected routes
- Input validation
- XSS protection

## 📱 Mobile Responsive

- Hamburger menu on mobile
- Responsive grid layouts
- Touch-friendly buttons
- Optimized images

## 🌟 Best Practices

- Component-based architecture
- Context for global state
- Custom hooks for reusability
- API service abstraction
- Error handling
- Loading states
- User feedback (toasts)

## 📄 License

MIT License

## 👨‍💻 Author

**Vasu Chauhan**
- GitHub: [@vasuchauhan0](https://github.com/vasuchauhan0)

## 🙏 Acknowledgments

- React Team
- Vite Team
- Tailwind CSS
- All open-source contributors

---

**Happy Coding! 🚀**
