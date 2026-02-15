const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');
const Project = require('../models/Project');
const Message = require('../models/Message');

// Load env vars
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected for seeding'))
.catch((err) => {
  console.error('❌ MongoDB Connection Error:', err);
  process.exit(1);
});

// Sample data
const users = [
  {
    name: 'Admin User',
    email: process.env.ADMIN_EMAIL || ' ',
    password: process.env.ADMIN_PASSWORD || 'Admin@123456',
    role: 'admin',
    isVerified: true,
    isActive: true,
    bio: 'Portfolio Administrator'
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'User@123456',
    role: 'user',
    isVerified: true,
    isActive: true,
    bio: 'Regular user account'
  }
];

const projects = [
  {
    title: 'E-Commerce Platform',
    description: 'A full-stack e-commerce platform built with MERN stack. Features include user authentication, product management, shopping cart, payment integration with Stripe, and order tracking. The platform provides a seamless shopping experience with real-time inventory updates.',
    shortDescription: 'Modern e-commerce solution with payment integration',
    thumbnail: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800',
        alt: 'E-commerce homepage'
      }
    ],
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Stripe', 'Tailwind CSS'],
    category: 'Full Stack',
    tags: ['e-commerce', 'payment', 'mern', 'stripe'],
    liveUrl: 'https://example-ecommerce.com',
    githubUrl: 'https://github.com/example/ecommerce',
    status: 'Completed',
    featured: true,
    priority: 10,
    myRole: 'Full Stack Developer',
    teamSize: 1,
    isPublished: true
  },
  {
    title: 'Task Management App',
    description: 'A collaborative task management application similar to Trello. Built with React and Firebase, it allows teams to organize projects with boards, lists, and cards. Features include drag-and-drop functionality, real-time updates, user assignments, and deadline tracking.',
    shortDescription: 'Trello-like task management with real-time collaboration',
    thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
        alt: 'Task board interface'
      }
    ],
    technologies: ['React', 'Firebase', 'Redux', 'Material-UI', 'React Beautiful DnD'],
    category: 'Frontend',
    tags: ['task-management', 'collaboration', 'real-time', 'firebase'],
    liveUrl: 'https://example-tasks.com',
    githubUrl: 'https://github.com/example/tasks',
    status: 'Completed',
    featured: true,
    priority: 9,
    myRole: 'Frontend Developer',
    teamSize: 2,
    isPublished: true
  },
  {
    title: 'Weather Forecast Dashboard',
    description: 'An interactive weather dashboard that provides real-time weather information and forecasts. Uses OpenWeatherMap API to fetch data and displays it with beautiful visualizations using Chart.js. Features include location search, 5-day forecast, weather alerts, and favorites.',
    shortDescription: 'Real-time weather dashboard with forecasts',
    thumbnail: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?w=800',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?w=800',
        alt: 'Weather dashboard'
      }
    ],
    technologies: ['React', 'OpenWeatherMap API', 'Chart.js', 'Tailwind CSS'],
    category: 'Frontend',
    tags: ['weather', 'api', 'dashboard', 'visualization'],
    liveUrl: 'https://example-weather.com',
    githubUrl: 'https://github.com/example/weather',
    status: 'Completed',
    featured: false,
    priority: 5,
    myRole: 'Frontend Developer',
    teamSize: 1,
    isPublished: true
  },
  {
    title: 'Social Media Analytics Tool',
    description: 'A comprehensive analytics platform for social media managers. Integrates with multiple social media APIs to provide insights, engagement metrics, and performance tracking. Features include automated reporting, competitor analysis, and custom dashboard creation.',
    shortDescription: 'Multi-platform social media analytics',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
        alt: 'Analytics dashboard'
      }
    ],
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Redis', 'D3.js', 'Social Media APIs'],
    category: 'Full Stack',
    tags: ['analytics', 'social-media', 'dashboard', 'data-visualization'],
    githubUrl: 'https://github.com/example/analytics',
    status: 'In Progress',
    featured: true,
    priority: 8,
    myRole: 'Full Stack Developer',
    teamSize: 3,
    isPublished: true
  },
  {
    title: 'Portfolio Website Builder',
    description: 'A no-code portfolio website builder that allows users to create professional portfolio websites without coding knowledge. Features include drag-and-drop editor, customizable templates, built-in blog, contact forms, and one-click deployment.',
    shortDescription: 'No-code portfolio builder platform',
    thumbnail: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800',
        alt: 'Website builder interface'
      }
    ],
    technologies: ['React', 'Node.js', 'MongoDB', 'AWS S3', 'Stripe'],
    category: 'Full Stack',
    tags: ['website-builder', 'no-code', 'saas', 'portfolio'],
    status: 'In Progress',
    featured: false,
    priority: 7,
    myRole: 'Lead Developer',
    teamSize: 4,
    isPublished: true
  },
  {
    title: 'Fitness Tracking Mobile App',
    description: 'A cross-platform mobile application for fitness enthusiasts. Track workouts, set goals, monitor progress, and connect with friends. Features include workout plans, nutrition tracking, progress photos, and social features for motivation.',
    shortDescription: 'Cross-platform fitness tracking app',
    thumbnail: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800',
        alt: 'Fitness app interface'
      }
    ],
    technologies: ['React Native', 'Node.js', 'MongoDB', 'Firebase', 'Redux'],
    category: 'Mobile App',
    tags: ['fitness', 'health', 'mobile', 'react-native'],
    liveUrl: 'https://apps.apple.com/example',
    githubUrl: 'https://github.com/example/fitness',
    status: 'Completed',
    featured: true,
    priority: 9,
    myRole: 'Mobile Developer',
    teamSize: 2,
    isPublished: true
  }
];

const messages = [
  {
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '+1234567890',
    subject: 'Website Development Inquiry',
    message: 'Hi, I am interested in having a website developed for my small business. Could you provide more information about your services and pricing?',
    category: 'Project Proposal',
    status: 'new',
    priority: 'high'
  },
  {
    name: 'Mike Chen',
    email: 'mike@techcorp.com',
    phone: '+1987654321',
    subject: 'Collaboration Opportunity',
    message: 'We are looking for talented developers to join our team on a contract basis. Would you be interested in discussing potential opportunities?',
    category: 'Job Opportunity',
    status: 'read',
    priority: 'medium'
  },
  {
    name: 'Emily Rodriguez',
    email: 'emily@startup.io',
    subject: 'Technical Consultation',
    message: 'I would like to schedule a consultation to discuss the technical architecture for our upcoming project. Are you available for a call next week?',
    category: 'General Inquiry',
    status: 'new',
    priority: 'medium'
  }
];

// Seed function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany();
    await Project.deleteMany();
    await Message.deleteMany();
    console.log('✅ Existing data cleared');

    // Create admin user first
    console.log('👤 Creating admin user...');
    const adminUser = await User.create(users[0]);
    console.log('✅ Admin user created:', adminUser.email);

    // Create other users
    console.log('👥 Creating other users...');
    const otherUsers = await User.create(users.slice(1));
    console.log(`✅ ${otherUsers.length} additional users created`);

    // Create projects with admin as creator
    console.log('📁 Creating projects...');
    const projectsWithCreator = projects.map(project => ({
      ...project,
      createdBy: adminUser._id
    }));
    const createdProjects = await Project.create(projectsWithCreator);
    console.log(`✅ ${createdProjects.length} projects created`);

    // Create messages
    console.log('✉️  Creating messages...');
    const createdMessages = await Message.create(messages);
    console.log(`✅ ${createdMessages.length} messages created`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Users: ${users.length}`);
    console.log(`   Projects: ${createdProjects.length}`);
    console.log(`   Messages: ${createdMessages.length}`);
    console.log('\n🔐 Admin Credentials:');
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   Password: ${users[0].password}`);
    console.log('\n✨ You can now start the server and login with these credentials!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeder
seedDatabase();
