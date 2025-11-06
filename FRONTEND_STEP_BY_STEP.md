# FRONTEND STEP-BY-STEP IMPLEMENTATION GUIDE
## Elevare Intelligence - Complete Setup with Real Data Integration

---

## 🎯 OVERVIEW
Gabay na ito ay magtuturong step-by-step kung paano i-implement ang frontend mula simula hanggang makakuha ng REAL DATA mula sa backend API. Hindi default/placeholder data - tunay na data from MongoDB!

---

## 📋 PRE-REQUIREMENTS
- ✅ Backend running sa `http://localhost:10000`
- ✅ MongoDB connected
- ✅ Node.js v18+ installed
- ✅ Text editor (VS Code recommended)

---

## 🚀 PHASE 1: PROJECT SETUP (15 minutes)

### Step 1.1: Create React Project
```bash
# Gumawa ng bagong folder para sa frontend
cd "C:\Users\Jessica Callanta\Desktop"
npm create vite@latest ElavareFrontend -- --template react
cd ElavareFrontend
```

### Step 1.2: Install ALL Dependencies
```bash
# UI & Styling
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
npm install tailwindcss postcss autoprefixer
npm install react-icons

# Routing & State Management
npm install react-router-dom zustand

# API & Forms
npm install axios react-hook-form yup @hookform/resolvers

# Charts & Utils
npm install recharts date-fns socket.io-client react-toastify

# Initialize Tailwind
npx tailwindcss init -p
```

### Step 1.3: Configure Tailwind CSS
**File: `tailwind.config.js`**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
      },
    },
  },
  plugins: [],
}
```

### Step 1.4: Update CSS
**File: `src/index.css`**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', system-ui, sans-serif;
  background-color: #f3f4f6;
}
```

### Step 1.5: Create Environment File
**File: `.env`**
```env
VITE_API_BASE_URL=http://localhost:10000/api/v1
VITE_SOCKET_URL=http://localhost:10000
VITE_APP_NAME=Elevare Intelligence
```

---

## 🗂️ PHASE 2: FOLDER STRUCTURE (10 minutes)

### Step 2.1: Create Folder Structure
```bash
# Gumawa ng lahat ng folders
mkdir src\api src\components src\pages src\store src\hooks src\utils
mkdir src\components\auth src\components\layout src\components\dashboard src\components\leads
mkdir src\pages\auth src\pages\dashboard
```

Dapat ganito ang structure:
```
src/
├── api/
├── components/
│   ├── auth/
│   ├── layout/
│   ├── dashboard/
│   └── leads/
├── pages/
│   ├── auth/
│   └── dashboard/
├── store/
├── hooks/
└── utils/
```

---

## 🔌 PHASE 3: API SETUP WITH REAL DATA (20 minutes)

### Step 3.1: Axios Configuration
**File: `src/api/axios.js`**
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor - add token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('🔵 API Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.config.url, response.data);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      // Unauthorized - logout user
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;
```

### Step 3.2: Auth API Endpoints
**File: `src/api/auth.api.js`**
```javascript
import api from './axios';

export const authAPI = {
  // Register new user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Get current user
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await api.get('/auth/logout');
    return response.data;
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (token, password) => {
    const response = await api.put(`/auth/reset-password/${token}`, { password });
    return response.data;
  },
};
```

### Step 3.3: Dashboard API (REAL DATA!)
**File: `src/api/dashboard.api.js`**
```javascript
import api from './axios';

export const dashboardAPI = {
  // Get agent dashboard - REAL STATS from MongoDB
  getAgentDashboard: async () => {
    const response = await api.get('/dashboard/agent');
    return response.data;
  },

  // Get landlord dashboard
  getLandlordDashboard: async () => {
    const response = await api.get('/dashboard/landlord');
    return response.data;
  },

  // Get manager dashboard
  getManagerDashboard: async () => {
    const response = await api.get('/dashboard/manager');
    return response.data;
  },
};
```

### Step 3.4: Leads API (REAL DATA!)
**File: `src/api/leads.api.js`**
```javascript
import api from './axios';

export const leadsAPI = {
  // Get all leads - REAL DATA from MongoDB
  getAll: async (params = {}) => {
    const response = await api.get('/leads', { params });
    return response.data;
  },

  // Get single lead
  getOne: async (id) => {
    const response = await api.get(`/leads/${id}`);
    return response.data;
  },

  // Create new lead
  create: async (leadData) => {
    const response = await api.post('/leads', leadData);
    return response.data;
  },

  // Update lead
  update: async (id, leadData) => {
    const response = await api.put(`/leads/${id}`, leadData);
    return response.data;
  },

  // Delete lead
  delete: async (id) => {
    const response = await api.delete(`/leads/${id}`);
    return response.data;
  },
};
```

---

## 🔐 PHASE 4: AUTHENTICATION WITH REAL LOGIN (30 minutes)

### Step 4.1: Auth Store (State Management)
**File: `src/store/authStore.js`**
```javascript
import { create } from 'zustand';
import { authAPI } from '../api/auth.api';

const useAuthStore = create((set) => ({
  // Initial state
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,

  // Login action - REAL API CALL
  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const data = await authAPI.login(credentials);
      
      // Save to localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Update state
      set({ 
        user: data.user, 
        token: data.token, 
        isAuthenticated: true, 
        loading: false 
      });
      
      console.log('✅ Login successful:', data.user.fullName);
      return data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Login failed';
      set({ error: errorMsg, loading: false });
      console.error('❌ Login error:', errorMsg);
      throw error;
    }
  },

  // Register action - REAL API CALL
  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      const data = await authAPI.register(userData);
      
      // Save to localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Update state
      set({ 
        user: data.user, 
        token: data.token, 
        isAuthenticated: true, 
        loading: false 
      });
      
      console.log('✅ Registration successful:', data.user.fullName);
      return data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Registration failed';
      set({ error: errorMsg, loading: false });
      console.error('❌ Registration error:', errorMsg);
      throw error;
    }
  },

  // Logout action
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false });
    console.log('👋 User logged out');
  },

  // Fetch current user - REAL API CALL
  fetchUser: async () => {
    try {
      const data = await authAPI.getMe();
      set({ user: data.data });
      localStorage.setItem('user', JSON.stringify(data.data));
      console.log('✅ User data refreshed');
    } catch (error) {
      console.error('❌ Failed to fetch user:', error);
    }
  },
}));

export default useAuthStore;
```

### Step 4.2: Login Page
**File: `src/pages/auth/LoginPage.jsx`**
```javascript
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { toast } from 'react-toastify';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await login({ email, password });
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2">Elevare Intelligence</h1>
        <p className="text-center text-gray-600 mb-8">Login to your account</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:underline font-medium">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
```

### Step 4.3: Register Page
**File: `src/pages/auth/RegisterPage.jsx`**
```javascript
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { toast } from 'react-toastify';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'agent',
  });
  
  const { register, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    try {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      toast.success('Registration successful! Welcome aboard!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 py-12">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2">Create Account</h1>
        <p className="text-center text-gray-600 mb-8">Join Elevare Intelligence</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Juan Dela Cruz"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="agent">Agent</option>
              <option value="landlord">Landlord</option>
              <option value="manager">Manager</option>
              <option value="property-manager">Property Manager</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline font-medium">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
```

### Step 4.4: Protected Route Component
**File: `src/components/auth/ProtectedRoute.jsx`**
```javascript
import { Navigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-600 mb-4">Unauthorized</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return children;
}
```

---

## 📊 PHASE 5: DASHBOARD WITH REAL DATA (30 minutes)

### Step 5.1: Dashboard Store
**File: `src/store/dashboardStore.js`**
```javascript
import { create } from 'zustand';
import { dashboardAPI } from '../api/dashboard.api';

const useDashboardStore = create((set) => ({
  // State
  data: null,
  loading: false,
  error: null,

  // Fetch agent dashboard - REAL DATA!
  fetchAgentDashboard: async () => {
    set({ loading: true, error: null });
    try {
      const response = await dashboardAPI.getAgentDashboard();
      set({ data: response.data, loading: false });
      console.log('✅ Agent Dashboard Data:', response.data);
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to fetch dashboard';
      set({ error: errorMsg, loading: false });
      console.error('❌ Dashboard Error:', errorMsg);
      throw error;
    }
  },

  // Fetch landlord dashboard
  fetchLandlordDashboard: async () => {
    set({ loading: true, error: null });
    try {
      const response = await dashboardAPI.getLandlordDashboard();
      set({ data: response.data, loading: false });
      console.log('✅ Landlord Dashboard Data:', response.data);
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to fetch dashboard';
      set({ error: errorMsg, loading: false });
      throw error;
    }
  },

  // Fetch manager dashboard
  fetchManagerDashboard: async () => {
    set({ loading: true, error: null });
    try {
      const response = await dashboardAPI.getManagerDashboard();
      set({ data: response.data, loading: false });
      console.log('✅ Manager Dashboard Data:', response.data);
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to fetch dashboard';
      set({ error: errorMsg, loading: false });
      throw error;
    }
  },
}));

export default useDashboardStore;
```

### Step 5.2: Stats Card Component
**File: `src/components/dashboard/StatsCard.jsx`**
```javascript
export default function StatsCard({ title, value, icon, color, trend, loading }) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 animate-pulse">
        <div className="h-20 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 font-medium">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          {trend !== undefined && (
            <p className={`text-sm mt-2 font-medium ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
            </p>
          )}
        </div>
        <div className={`p-4 rounded-full ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
```

### Step 5.3: Dashboard Page (REAL DATA!)
**File: `src/pages/dashboard/DashboardPage.jsx`**
```javascript
import { useEffect } from 'react';
import useAuthStore from '../../store/authStore';
import useDashboardStore from '../../store/dashboardStore';
import StatsCard from '../../components/dashboard/StatsCard';
import { FaUsers, FaTasks, FaPhone, FaChartLine } from 'react-icons/fa';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { data, loading, fetchAgentDashboard } = useDashboardStore();

  useEffect(() => {
    // Fetch REAL data from backend
    if (user?.role === 'agent') {
      fetchAgentDashboard();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome back, {user?.fullName}! 👋
          </h1>
          <p className="text-gray-600 mt-1">Here's what's happening with your business today.</p>
        </div>
      </div>

      {/* Stats Cards - REAL DATA FROM MONGODB */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Active Leads"
          value={data?.activeLeads || 0}
          icon={<FaUsers className="text-white text-2xl" />}
          color="bg-blue-500"
          loading={loading}
        />
        <StatsCard
          title="Pending Tasks"
          value={data?.pendingTasks || 0}
          icon={<FaTasks className="text-white text-2xl" />}
          color="bg-yellow-500"
          loading={loading}
        />
        <StatsCard
          title="Calls Today"
          value={data?.todayCalls || 0}
          icon={<FaPhone className="text-white text-2xl" />}
          color="bg-green-500"
          loading={loading}
        />
        <StatsCard
          title="Progress"
          value={`${data?.progress || 0}%`}
          icon={<FaChartLine className="text-white text-2xl" />}
          color="bg-purple-500"
          loading={loading}
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        {data?.recentMoodEntry ? (
          <div className="space-y-3">
            <p className="text-gray-600">
              <span className="font-medium">Latest Mood Entry:</span>{' '}
              Mood: {data.recentMoodEntry.mood}/10, Energy: {data.recentMoodEntry.energy}/10
            </p>
            <p className="text-sm text-gray-500">
              {new Date(data.recentMoodEntry.date).toLocaleDateString()}
            </p>
          </div>
        ) : (
          <p className="text-gray-500">No recent activity</p>
        )}
      </div>
    </div>
  );
}
```

---

## 🎨 PHASE 6: LAYOUT COMPONENTS (20 minutes)

### Step 6.1: Sidebar Navigation
**File: `src/components/layout/Sidebar.jsx`**
```javascript
import { NavLink } from 'react-router-dom';
import { FaHome, FaUsers, FaPhone, FaSmile, FaBuilding, FaTasks, FaDollarSign, FaFile } from 'react-icons/fa';

const menuItems = [
  { path: '/dashboard', icon: FaHome, label: 'Dashboard' },
  { path: '/leads', icon: FaUsers, label: 'Leads' },
  { path: '/calls', icon: FaPhone, label: 'Calls' },
  { path: '/moods', icon: FaSmile, label: 'Mood Tracker' },
  { path: '/properties', icon: FaBuilding, label: 'Properties' },
  { path: '/tasks', icon: FaTasks, label: 'Tasks' },
  { path: '/payments', icon: FaDollarSign, label: 'Payments' },
  { path: '/documents', icon: FaFile, label: 'Documents' },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold">Elevare</h1>
        <p className="text-sm text-gray-400 mt-1">Intelligence Platform</p>
      </div>
      
      <nav className="mt-6">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-6 py-3 hover:bg-gray-800 transition ${
                isActive ? 'bg-gray-800 border-l-4 border-blue-500' : ''
              }`
            }
          >
            <item.icon className="mr-4 text-lg" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
```

### Step 6.2: Navbar
**File: `src/components/layout/Navbar.jsx`**
```javascript
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { FaSignOutAlt, FaUser } from 'react-icons/fa';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">Current User</p>
          <p className="text-lg font-semibold">{user?.fullName}</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
            {user?.role}
          </span>
          
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
```

### Step 6.3: Main Layout
**File: `src/components/layout/MainLayout.jsx`**
```javascript
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function MainLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Navbar />
        
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
```

---

## 🗺️ PHASE 7: ROUTING SETUP (15 minutes)

### Step 7.1: Main App Component
**File: `src/App.jsx`**
```javascript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ProtectedRoute from './components/auth/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Dashboard
import DashboardPage from './pages/dashboard/DashboardPage';

function App() {
  return (
    <BrowserRouter>
      <ToastContainer 
        position="top-right" 
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
      />
      
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          
          {/* TODO: Add more routes */}
          <Route path="leads" element={<div>Leads Page (Coming Soon)</div>} />
          <Route path="calls" element={<div>Calls Page (Coming Soon)</div>} />
          <Route path="moods" element={<div>Moods Page (Coming Soon)</div>} />
          <Route path="properties" element={<div>Properties Page (Coming Soon)</div>} />
          <Route path="tasks" element={<div>Tasks Page (Coming Soon)</div>} />
          <Route path="payments" element={<div>Payments Page (Coming Soon)</div>} />
          <Route path="documents" element={<div>Documents Page (Coming Soon)</div>} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

### Step 7.2: Main Entry Point
**File: `src/main.jsx`**
```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

---

## 🧪 PHASE 8: TESTING WITH REAL DATA (15 minutes)

### Step 8.1: Start Frontend
```bash
npm run dev
```

Frontend running sa: `http://localhost:5174` (or 5173)

### Step 8.2: Test Flow
1. **Open browser**: `http://localhost:5174`
2. **Register new user**:
   - Full Name: Juan Dela Cruz
   - Email: juan@test.com
   - Password: password123
   - Role: agent
3. **Login**:
   - Email: juan@test.com
   - Password: password123
4. **Check Dashboard**:
   - Dapat makita mo ang REAL stats from MongoDB
   - Active Leads, Pending Tasks, etc.

### Step 8.3: Check Console Logs
Open browser DevTools (F12) → Console

Dapat makita mo:
```
🔵 API Request: POST /auth/register
✅ API Response: /auth/register {success: true, token: "...", user: {...}}
✅ Registration successful: Juan Dela Cruz

🔵 API Request: GET /dashboard/agent
✅ API Response: /dashboard/agent {success: true, data: {...}}
✅ Agent Dashboard Data: {activeLeads: 0, pendingTasks: 0, ...}
```

---

## 📝 VERIFICATION CHECKLIST

### Backend Check
- [ ] Backend running on http://localhost:10000
- [ ] MongoDB connected successfully
- [ ] Health endpoint working: http://localhost:10000/health

### Frontend Check
- [ ] Frontend running on http://localhost:5174
- [ ] No console errors
- [ ] Can see login page

### Authentication Flow
- [ ] Can register new user
- [ ] Registration saves user to MongoDB
- [ ] Can login with registered credentials
- [ ] Token saved to localStorage
- [ ] Redirects to dashboard after login

### Dashboard
- [ ] Dashboard loads after login
- [ ] Shows user's full name
- [ ] Stats cards show REAL data from MongoDB
- [ ] No errors in console

### Real Data Verification
- [ ] Open MongoDB Atlas → Browse Collections
- [ ] Check `users` collection - dapat may bagong user
- [ ] Check browser localStorage - dapat may `token` at `user`
- [ ] Dashboard stats match data from MongoDB

---

## 🔥 NEXT STEPS: ADDING MORE FEATURES

### Create Leads Page with Real Data
**File: `src/pages/leads/LeadsPage.jsx`**
```javascript
import { useEffect, useState } from 'react';
import { leadsAPI } from '../../api/leads.api';
import { toast } from 'react-toastify';

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const data = await leadsAPI.getAll();
      setLeads(data.data);
      console.log('✅ Leads data:', data.data);
    } catch (error) {
      toast.error('Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading leads...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Leads Management</h1>
      
      {leads.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500">No leads yet. Create your first lead!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {leads.map((lead) => (
            <div key={lead._id} className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold text-lg">{lead.fullName}</h3>
              <p className="text-gray-600 text-sm">{lead.email}</p>
              <p className="text-gray-600 text-sm">{lead.phone}</p>
              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs ${
                lead.status === 'new' ? 'bg-blue-100 text-blue-600' :
                lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-600' :
                lead.status === 'won' ? 'bg-green-100 text-green-600' :
                'bg-gray-100 text-gray-600'
              }`}>
                {lead.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

Update `src/App.jsx`:
```javascript
import LeadsPage from './pages/leads/LeadsPage';

// In Routes:
<Route path="leads" element={<LeadsPage />} />
```

---

## 🎯 SUMMARY

**Mga ginawa natin:**
1. ✅ Setup Vite + React project
2. ✅ Install lahat ng dependencies
3. ✅ Configure Tailwind CSS
4. ✅ Create folder structure
5. ✅ Setup Axios with interceptors
6. ✅ Create Auth API endpoints
7. ✅ Implement Zustand stores
8. ✅ Build Login/Register pages
9. ✅ Create Dashboard with REAL data
10. ✅ Add Sidebar & Navbar
11. ✅ Setup routing
12. ✅ Test authentication flow

**RESULT:** 
- Gumagana ang login/register
- Makikita ang REAL data from MongoDB sa dashboard
- Hindi placeholder/default data - tunay na galing sa database!

**Next:** Gumawa ng more pages (Leads, Calls, Moods, etc.) gamit ang same pattern! 🚀

---

**Tapos na! Ready to use with REAL DATA!** 🎉
