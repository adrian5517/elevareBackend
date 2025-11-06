# 🔗 FRONTEND-BACKEND INTEGRATION GUIDE
## Elevare Intelligence Platform - Complete Integration Steps

---

## 📋 OVERVIEW

This guide provides **step-by-step instructions** on how to integrate the Elevare Backend (running on port 10000) with the React + Vite frontend. Follow each section carefully to ensure proper connectivity.

---

## ⚙️ PREREQUISITES

### Backend Requirements
- ✅ Backend server running on `http://localhost:10000`
- ✅ MongoDB Atlas connected (blkgrnapi cluster)
- ✅ All API endpoints implemented and working
- ✅ CORS configured for localhost origins
- ✅ Socket.io enabled on port 10000

### Frontend Requirements
- Node.js v18+ installed
- npm or yarn package manager
- Text editor (VS Code recommended)
- Basic knowledge of React, Axios, and Zustand

---

## 🚀 STEP 1: CREATE FRONTEND PROJECT

### 1.1 Initialize Vite + React Project
```bash
# Open new terminal (separate from backend)
cd "c:\Users\Jessica Callanta\Desktop"
npm create vite@latest ElavareFrontend -- --template react
cd ElavareFrontend
```

### 1.2 Install Core Dependencies
```bash
# UI & Styling
npm install tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Routing & State Management
npm install react-router-dom zustand axios

# Additional Tools
npm install socket.io-client react-toastify date-fns recharts

# Optional: Icons
npm install react-icons
```

### 1.3 Verify Installation
```bash
npm run dev
```
You should see frontend running on `http://localhost:5173`

---

## 🔧 STEP 2: ENVIRONMENT CONFIGURATION

### 2.1 Create `.env` File
Create `.env` in the **frontend root directory**:

```env
# Backend API Configuration
VITE_API_BASE_URL=http://localhost:10000/api/v1
VITE_SOCKET_URL=http://localhost:10000

# App Configuration
VITE_APP_NAME=Elevare Intelligence
VITE_APP_ENV=development
```

**CRITICAL**: Backend is on port **10000**, NOT 5000 or 3000!

### 2.2 Create `.env.example` for Reference
```env
VITE_API_BASE_URL=http://localhost:10000/api/v1
VITE_SOCKET_URL=http://localhost:10000
VITE_APP_NAME=Elevare Intelligence
```

### 2.3 Update `.gitignore`
```
.env
node_modules
dist
```

---

## 📁 STEP 3: CREATE FOLDER STRUCTURE

### 3.1 Create All Directories
```bash
# In frontend root (ElavareFrontend)
mkdir -p src/api
mkdir -p src/store
mkdir -p src/components/auth
mkdir -p src/components/layout
mkdir -p src/components/dashboard
mkdir -p src/components/leads
mkdir -p src/components/calls
mkdir -p src/components/moods
mkdir -p src/components/properties
mkdir -p src/components/tasks
mkdir -p src/components/payments
mkdir -p src/components/documents
mkdir -p src/pages/auth
mkdir -p src/pages/dashboard
mkdir -p src/hooks
mkdir -p src/utils
```

### 3.2 Verify Structure
```
ElavareFrontend/
├── src/
│   ├── api/
│   ├── store/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   └── utils/
├── .env
├── package.json
└── vite.config.js
```

---

## 🔐 STEP 4: SETUP AXIOS & API INTEGRATION

### 4.1 Create Axios Instance (`src/api/axios.js`)

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // http://localhost:10000/api/v1
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies if using them
});

// Request Interceptor: Add JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('📤 API Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle errors globally
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.response?.status, error.response?.data);
    
    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error('Access denied - insufficient permissions');
    }
    
    return Promise.reject(error);
  }
);

export default api;
```

### 4.2 Create Auth API (`src/api/auth.api.js`)

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
  resetPassword: async (resetToken, password) => {
    const response = await api.put(`/auth/reset-password/${resetToken}`, { password });
    return response.data;
  },
};
```

### 4.3 Test API Connection

Create `src/utils/testApi.js`:

```javascript
import api from '../api/axios';

export async function testBackendConnection() {
  try {
    // Test if backend is reachable
    const response = await api.get('/health');
    console.log('✅ Backend Connection: SUCCESS', response.data);
    return true;
  } catch (error) {
    console.error('❌ Backend Connection: FAILED', error.message);
    if (error.code === 'ERR_NETWORK') {
      console.error('Make sure backend is running on http://localhost:10000');
    }
    return false;
  }
}
```

### 4.4 Add Test to `App.jsx`

```javascript
import { useEffect } from 'react';
import { testBackendConnection } from './utils/testApi';

function App() {
  useEffect(() => {
    // Test backend connection on app load
    testBackendConnection();
  }, []);

  return (
    <div>
      <h1>Elevare Intelligence</h1>
    </div>
  );
}

export default App;
```

**Run frontend and check browser console for connection test results!**

---

## 🗃️ STEP 5: SETUP ZUSTAND STORE

### 5.1 Create Auth Store (`src/store/authStore.js`)

```javascript
import { create } from 'zustand';
import { authAPI } from '../api/auth.api';

const useAuthStore = create((set, get) => ({
  // State
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,

  // Login Action
  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const data = await authAPI.login(credentials);
      
      // Store token and user in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Update state
      set({ 
        user: data.user, 
        token: data.token, 
        isAuthenticated: true, 
        loading: false 
      });
      
      console.log('✅ Login successful:', data.user);
      return data;
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Login failed';
      set({ error: errorMsg, loading: false });
      console.error('❌ Login failed:', errorMsg);
      throw error;
    }
  },

  // Register Action
  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      const data = await authAPI.register(userData);
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      set({ 
        user: data.user, 
        token: data.token, 
        isAuthenticated: true, 
        loading: false 
      });
      
      console.log('✅ Registration successful:', data.user);
      return data;
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Registration failed';
      set({ error: errorMsg, loading: false });
      console.error('❌ Registration failed:', errorMsg);
      throw error;
    }
  },

  // Logout Action
  logout: async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Clear state and localStorage regardless of API call result
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      set({ 
        user: null, 
        token: null, 
        isAuthenticated: false,
        error: null 
      });
      console.log('✅ Logged out successfully');
    }
  },

  // Fetch Current User
  fetchUser: async () => {
    try {
      const data = await authAPI.getMe();
      set({ user: data.data });
      localStorage.setItem('user', JSON.stringify(data.data));
      console.log('✅ User data refreshed:', data.data);
    } catch (error) {
      console.error('❌ Failed to fetch user:', error);
      // If token is invalid, logout
      get().logout();
    }
  },

  // Clear Error
  clearError: () => set({ error: null }),
}));

export default useAuthStore;
```

---

## 🔒 STEP 6: CREATE LOGIN PAGE

### 6.1 Login Form Component (`src/components/auth/LoginForm.jsx`)

```javascript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { toast } from 'react-toastify';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('🔐 Attempting login with:', { email });
    
    try {
      const result = await login({ email, password });
      console.log('✅ Login successful! User:', result.user);
      
      toast.success(`Welcome back, ${result.user.fullName}!`);
      navigate('/dashboard');
    } catch (error) {
      console.error('❌ Login error:', error);
      const errorMsg = error.response?.data?.error || 'Login failed';
      toast.error(errorMsg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login to Elevare</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          <a href="/forgot-password" className="text-blue-600 hover:underline">
            Forgot password?
          </a>
        </div>

        <div className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <a href="/register" className="text-blue-600 hover:underline">
            Register here
          </a>
        </div>
      </div>
    </div>
  );
}
```

### 6.2 Login Page (`src/pages/auth/LoginPage.jsx`)

```javascript
import LoginForm from '../../components/auth/LoginForm';

export default function LoginPage() {
  return <LoginForm />;
}
```

---

## 🛡️ STEP 7: PROTECTED ROUTES

### 7.1 Create Protected Route Component (`src/components/auth/ProtectedRoute.jsx`)

```javascript
import { Navigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, user } = useAuthStore();

  // Check if user is authenticated
  if (!isAuthenticated) {
    console.log('🚫 Not authenticated - redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  if (allowedRoles.length > 0 && user) {
    if (!allowedRoles.includes(user.role)) {
      console.log(`🚫 Access denied - user role: ${user.role}, required: ${allowedRoles.join(', ')}`);
      return <Navigate to="/unauthorized" replace />;
    }
  }

  console.log('✅ Access granted - user:', user?.fullName, 'role:', user?.role);
  return children;
}
```

---

## 🗺️ STEP 8: SETUP ROUTING

### 8.1 Install React Router
```bash
npm install react-router-dom
```

### 8.2 Update `App.jsx` with Routes

```javascript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
      
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

---

## 📊 STEP 9: CREATE DASHBOARD PAGE

### 9.1 Dashboard API (`src/api/dashboard.api.js`)

```javascript
import api from './axios';

export const dashboardAPI = {
  getAgentDashboard: async () => {
    const response = await api.get('/dashboard/agent');
    return response.data;
  },

  getLandlordDashboard: async () => {
    const response = await api.get('/dashboard/landlord');
    return response.data;
  },

  getManagerDashboard: async () => {
    const response = await api.get('/dashboard/manager');
    return response.data;
  },
};
```

### 9.2 Dashboard Page (`src/pages/dashboard/DashboardPage.jsx`)

```javascript
import { useEffect, useState } from 'react';
import useAuthStore from '../../store/authStore';
import { dashboardAPI } from '../../api/dashboard.api';
import { toast } from 'react-toastify';

export default function DashboardPage() {
  const { user, logout } = useAuthStore();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, [user?.role]);

  const fetchDashboard = async () => {
    try {
      console.log('📊 Fetching dashboard for role:', user?.role);
      
      let data;
      switch (user?.role) {
        case 'agent':
          data = await dashboardAPI.getAgentDashboard();
          break;
        case 'landlord':
          data = await dashboardAPI.getLandlordDashboard();
          break;
        case 'manager':
        case 'ceo':
        case 'admin':
          data = await dashboardAPI.getManagerDashboard();
          break;
        default:
          data = await dashboardAPI.getAgentDashboard();
      }
      
      console.log('✅ Dashboard data:', data);
      setDashboardData(data.data);
    } catch (error) {
      console.error('❌ Failed to fetch dashboard:', error);
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Welcome, {user?.fullName}!</h1>
            <p className="text-gray-600">Role: {user?.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        {/* Dashboard Content */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
          
          {dashboardData ? (
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(dashboardData, null, 2)}
            </pre>
          ) : (
            <p>No dashboard data available</p>
          )}
        </div>
      </div>
    </div>
  );
}
```

---

## 🔌 STEP 10: SOCKET.IO INTEGRATION

### 10.1 Create Socket Hook (`src/hooks/useSocket.js`)

```javascript
import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import useAuthStore from '../store/authStore';

export default function useSocket() {
  const socketRef = useRef(null);
  const { user, token, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('🔌 Connecting to Socket.io...');
      
      socketRef.current = io(import.meta.env.VITE_SOCKET_URL, {
        auth: {
          token: token,
          userId: user._id
        },
        transports: ['websocket', 'polling'],
      });

      socketRef.current.on('connect', () => {
        console.log('✅ Socket connected:', socketRef.current.id);
        
        // Join user room
        socketRef.current.emit('user:join', { userId: user._id });
      });

      socketRef.current.on('disconnect', () => {
        console.log('🔌 Socket disconnected');
      });

      socketRef.current.on('notification', (data) => {
        console.log('🔔 New notification:', data);
        // Handle notification (show toast, update state, etc.)
      });

      socketRef.current.on('connect_error', (error) => {
        console.error('❌ Socket connection error:', error.message);
      });

      return () => {
        console.log('🔌 Disconnecting socket...');
        socketRef.current?.disconnect();
      };
    }
  }, [isAuthenticated, user, token]);

  return socketRef.current;
}
```

### 10.2 Use Socket in Dashboard

Update `DashboardPage.jsx`:

```javascript
import useSocket from '../../hooks/useSocket';

export default function DashboardPage() {
  // ... existing code ...
  
  // Add socket connection
  const socket = useSocket();
  
  useEffect(() => {
    if (socket) {
      console.log('✅ Socket available in dashboard:', socket.id);
    }
  }, [socket]);
  
  // ... rest of component ...
}
```

---

## 🧪 STEP 11: TESTING THE INTEGRATION

### 11.1 Start Backend Server

```bash
# Terminal 1: Backend
cd "c:\Users\Jessica Callanta\Desktop\ElavareBackend"
npm run dev
```

**Verify backend is running:**
- ✅ `🚀 HTTP server listening on :::10000`
- ✅ `✅ MongoDB connected`

### 11.2 Start Frontend Server

```bash
# Terminal 2: Frontend
cd "c:\Users\Jessica Callanta\Desktop\ElavareFrontend"
npm run dev
```

**Verify frontend is running:**
- ✅ `Local: http://localhost:5173`

### 11.3 Test Login Flow

1. **Open browser:** `http://localhost:5173`
2. **Navigate to login page** (should redirect automatically)
3. **Open Developer Console** (F12)
4. **Test with existing user:**
   - Email: `admin@elevare.com`
   - Password: `Admin123!`

**Expected Console Logs:**
```
📤 API Request: POST /auth/login
✅ API Response: /auth/login 200
✅ Login successful: { _id: "...", fullName: "Admin User", role: "admin" }
🔌 Connecting to Socket.io...
✅ Socket connected: abc123
📊 Fetching dashboard for role: admin
✅ Dashboard data: { ... }
```

### 11.4 Test Backend Connection

Check browser console for:
- ✅ `📤 API Request: POST /auth/login`
- ✅ `✅ API Response: /auth/login 200`
- ✅ `✅ Login successful`

Check backend terminal for:
- ✅ `POST /api/v1/auth/login 200`
- ✅ `New client connected: abc123...`

---

## 📝 STEP 12: CREATE MORE API MODULES

### 12.1 Leads API (`src/api/leads.api.js`)

```javascript
import api from './axios';

export const leadsAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/leads', { params });
    return response.data;
  },

  getOne: async (id) => {
    const response = await api.get(`/leads/${id}`);
    return response.data;
  },

  create: async (leadData) => {
    const response = await api.post('/leads', leadData);
    return response.data;
  },

  update: async (id, leadData) => {
    const response = await api.put(`/leads/${id}`, leadData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/leads/${id}`);
    return response.data;
  },
};
```

### 12.2 Calls API (`src/api/calls.api.js`)

```javascript
import api from './axios';

export const callsAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/calls', { params });
    return response.data;
  },

  getOne: async (id) => {
    const response = await api.get(`/calls/${id}`);
    return response.data;
  },

  create: async (callData) => {
    const response = await api.post('/calls', callData);
    return response.data;
  },

  addFeedback: async (id, feedback) => {
    const response = await api.post(`/calls/${id}/feedback`, feedback);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/calls/${id}`);
    return response.data;
  },
};
```

### 12.3 Moods API (`src/api/moods.api.js`)

```javascript
import api from './axios';

export const moodsAPI = {
  getAll: async () => {
    const response = await api.get('/moods');
    return response.data;
  },

  create: async (moodData) => {
    const response = await api.post('/moods', moodData);
    return response.data;
  },

  getDailyAnalysis: async () => {
    const response = await api.get('/moods/daily-analysis');
    return response.data;
  },

  getWeeklyTrends: async () => {
    const response = await api.get('/moods/weekly-trends');
    return response.data;
  },
};
```

### 12.4 Properties API (`src/api/properties.api.js`)

```javascript
import api from './axios';

export const propertiesAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/properties', { params });
    return response.data;
  },

  getOne: async (id) => {
    const response = await api.get(`/properties/${id}`);
    return response.data;
  },

  create: async (propertyData) => {
    const response = await api.post('/properties', propertyData);
    return response.data;
  },

  update: async (id, propertyData) => {
    const response = await api.put(`/properties/${id}`, propertyData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/properties/${id}`);
    return response.data;
  },
};
```

---

## ✅ INTEGRATION CHECKLIST

### Phase 1: Initial Setup
- [ ] Frontend project created with Vite + React
- [ ] All dependencies installed
- [ ] `.env` file configured with correct backend URL
- [ ] Folder structure created
- [ ] Backend server running on port 10000

### Phase 2: API Integration
- [ ] Axios instance configured with interceptors
- [ ] Auth API module created
- [ ] Backend connection test successful
- [ ] Console logs show API requests/responses

### Phase 3: Authentication
- [ ] Auth store (Zustand) implemented
- [ ] Login form component created
- [ ] Login page created
- [ ] Protected route component implemented
- [ ] JWT token stored in localStorage
- [ ] Token sent in Authorization header

### Phase 4: Routing
- [ ] React Router installed
- [ ] App.jsx configured with routes
- [ ] Public and protected routes working
- [ ] Redirect to login for unauthenticated users

### Phase 5: Dashboard
- [ ] Dashboard API created
- [ ] Dashboard page implemented
- [ ] Role-based dashboard data loading
- [ ] User info displayed correctly

### Phase 6: Real-time (Socket.io)
- [ ] Socket.io client installed
- [ ] useSocket hook created
- [ ] Socket connection established
- [ ] User joins room on connection
- [ ] Notifications received via socket

### Phase 7: Additional Features
- [ ] Leads API and components
- [ ] Calls API and components
- [ ] Moods API and components
- [ ] Properties API and components
- [ ] Tasks API and components
- [ ] Payments API and components
- [ ] Documents API and components

---

## 🐛 COMMON ISSUES & SOLUTIONS

### Issue 1: ERR_CONNECTION_REFUSED
**Problem:** Frontend can't connect to backend

**Solution:**
1. Check backend is running: `netstat -ano | findstr :10000`
2. Verify `.env` has correct URL: `http://localhost:10000/api/v1`
3. Check CORS is configured in backend
4. Restart both servers

### Issue 2: 401 Unauthorized
**Problem:** API requests return 401 error

**Solution:**
1. Check token is stored: `localStorage.getItem('token')`
2. Verify token is sent in headers: Check Network tab in DevTools
3. Check token format: Should be `Bearer <token>`
4. Login again to get fresh token

### Issue 3: CORS Error
**Problem:** CORS policy blocking requests

**Solution:**
Backend `app.js` should have:
```javascript
cors({
  origin: (origin, callback) => {
    if (!origin || origin.startsWith('http://localhost:')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
})
```

### Issue 4: Socket Not Connecting
**Problem:** Socket.io connection fails

**Solution:**
1. Check backend Socket.io is initialized in `server.js`
2. Verify frontend socket URL in `.env`
3. Check browser console for connection errors
4. Ensure token is passed in socket auth

### Issue 5: Data Not Loading
**Problem:** Dashboard or other pages show no data

**Solution:**
1. Open DevTools Network tab
2. Check if API request is made
3. Verify response status (200 = success)
4. Check response data structure matches expected format
5. Add console.logs in API calls to debug

---

## 📊 TESTING WORKFLOW

### 1. Test Authentication
```javascript
// In browser console
localStorage.clear(); // Clear old tokens
// Then try login
```

### 2. Test API Calls
```javascript
// In browser console
fetch('http://localhost:10000/api/v1/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
```

### 3. Monitor Network Requests
- Open DevTools → Network tab
- Filter by "Fetch/XHR"
- Watch for API requests
- Check request headers (Authorization)
- Check response status and data

### 4. Check Backend Logs
Backend terminal should show:
```
Incoming request: POST /api/v1/auth/login
POST /api/v1/auth/login 200 272.800 ms
New client connected: abc123...
```

### 5. Check Frontend Logs
Browser console should show:
```
📤 API Request: POST /auth/login
✅ API Response: /auth/login 200
✅ Login successful
🔌 Connecting to Socket.io...
✅ Socket connected: abc123
```

---

## 🎯 NEXT STEPS

After basic integration is working:

1. **Build UI Components**
   - Create reusable components (Button, Card, Table, etc.)
   - Implement responsive design with Tailwind CSS
   - Add loading states and error handling

2. **Implement Feature Pages**
   - Leads management page
   - Calls history page
   - Mood tracker page
   - Properties dashboard
   - Tasks manager
   - Payments tracker
   - Documents vault

3. **Add Advanced Features**
   - File upload for documents
   - Real-time notifications
   - Charts and analytics
   - Search and filtering
   - Pagination
   - Export to CSV/PDF

4. **Testing**
   - Write unit tests (Vitest)
   - Integration tests
   - E2E tests (Playwright/Cypress)

5. **Deployment**
   - Build for production: `npm run build`
   - Deploy frontend (Vercel/Netlify)
   - Configure production backend URL

---

## 📞 TROUBLESHOOTING TIPS

### Enable Detailed Logging

Add to `src/api/axios.js`:

```javascript
api.interceptors.request.use((config) => {
  console.log('🔍 REQUEST:', {
    method: config.method,
    url: config.url,
    baseURL: config.baseURL,
    headers: config.headers,
    data: config.data,
  });
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log('✅ RESPONSE:', {
      status: response.status,
      url: response.config.url,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error('❌ ERROR:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
    });
    return Promise.reject(error);
  }
);
```

### Check Environment Variables

Add to `App.jsx`:

```javascript
useEffect(() => {
  console.log('🔧 Environment:', {
    API_URL: import.meta.env.VITE_API_BASE_URL,
    SOCKET_URL: import.meta.env.VITE_SOCKET_URL,
    MODE: import.meta.env.MODE,
  });
}, []);
```

---

## 🎉 SUCCESS CRITERIA

You'll know integration is successful when:

✅ **Login works** - User can login and see dashboard  
✅ **Token persists** - Refresh page, still logged in  
✅ **API calls succeed** - Network tab shows 200 responses  
✅ **Socket connects** - Console shows "Socket connected"  
✅ **Data displays** - Dashboard shows real data from backend  
✅ **Navigation works** - Can navigate between pages  
✅ **Logout works** - Token cleared, redirected to login  

---

## 📚 ADDITIONAL RESOURCES

- **Backend API Documentation:** `BACKEND_INTEGRATION.md`
- **Frontend Implementation Guide:** `FRONTEND_IMPLEMENTATION.md`
- **API Testing Guide:** `API_TESTING_GUIDE.md`
- **React Router Docs:** https://reactrouter.com
- **Zustand Docs:** https://zustand-demo.pmnd.rs
- **Socket.io Client Docs:** https://socket.io/docs/v4/client-api/

---

**Complete integration guide! Follow step-by-step para ma-connect ang frontend sa backend.** 🚀✨

**Key Points to Remember:**
- Backend: `http://localhost:10000/api/v1`
- Frontend: `http://localhost:5173`
- Token in localStorage
- Bearer token in Authorization header
- Socket.io on same port as HTTP server
- Console logs for debugging

**Happy Coding!** 🎉
