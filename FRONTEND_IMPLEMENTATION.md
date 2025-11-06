# FRONTEND IMPLEMENTATION GUIDE
## Elevare Intelligence - Real Estate Platform

---

## 📋 TABLE OF CONTENTS
1. [Project Setup](#project-setup)
2. [Folder Structure](#folder-structure)
3. [Dependencies](#dependencies)
4. [Configuration](#configuration)
5. [Authentication Implementation](#authentication-implementation)
6. [Dashboard Components](#dashboard-components)
7. [Feature Modules](#feature-modules)
8. [API Integration](#api-integration)
9. [State Management](#state-management)
10. [Routing](#routing)

---

## 🚀 PROJECT SETUP

### 1. Create React + Vite Project
```bash
npm create vite@latest elevare-frontend -- --template react
cd elevare-frontend
npm install
```

### 2. Install Core Dependencies
```bash
# UI Framework & Styling
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
npm install tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Routing
npm install react-router-dom

# State Management
npm install zustand axios

# Forms & Validation
npm install react-hook-form yup @hookform/resolvers

# Charts & Visualization
npm install recharts

# Date & Time
npm install date-fns

# Utilities
npm install socket.io-client react-toastify
```

---

## 📁 FOLDER STRUCTURE

```
elevare-frontend/
├── public/
│   └── vite.svg
├── src/
│   ├── api/
│   │   ├── axios.js              # Axios instance with interceptors
│   │   ├── auth.api.js           # Auth endpoints
│   │   ├── dashboard.api.js      # Dashboard endpoints
│   │   ├── leads.api.js          # Leads endpoints
│   │   ├── calls.api.js          # Calls endpoints
│   │   ├── moods.api.js          # Mood tracking endpoints
│   │   ├── tasks.api.js          # Tasks endpoints
│   │   ├── properties.api.js     # Properties endpoints
│   │   ├── payments.api.js       # Payments endpoints
│   │   └── documents.api.js      # Documents endpoints
│   ├── assets/
│   │   ├── images/
│   │   └── icons/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Table.jsx
│   │   │   ├── Loader.jsx
│   │   │   └── ErrorBoundary.jsx
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── MainLayout.jsx
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx
│   │   │   ├── RegisterForm.jsx
│   │   │   ├── ForgotPasswordForm.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── dashboard/
│   │   │   ├── AgentDashboard.jsx
│   │   │   ├── LandlordDashboard.jsx
│   │   │   ├── ManagerDashboard.jsx
│   │   │   ├── StatsCard.jsx
│   │   │   └── ActivityChart.jsx
│   │   ├── leads/
│   │   │   ├── LeadList.jsx
│   │   │   ├── LeadCard.jsx
│   │   │   ├── LeadForm.jsx
│   │   │   └── LeadDetails.jsx
│   │   ├── calls/
│   │   │   ├── CallList.jsx
│   │   │   ├── CallRecorder.jsx
│   │   │   ├── CallAnalysis.jsx
│   │   │   └── CoachFeedback.jsx
│   │   ├── moods/
│   │   │   ├── MoodTracker.jsx
│   │   │   ├── MoodChart.jsx
│   │   │   ├── DailyMoodEntry.jsx
│   │   │   └── WeeklyTrends.jsx
│   │   ├── properties/
│   │   │   ├── PropertyList.jsx
│   │   │   ├── PropertyCard.jsx
│   │   │   ├── PropertyForm.jsx
│   │   │   └── PropertyDetails.jsx
│   │   ├── tasks/
│   │   │   ├── TaskList.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   └── TaskForm.jsx
│   │   ├── payments/
│   │   │   ├── PaymentList.jsx
│   │   │   ├── PaymentForm.jsx
│   │   │   └── PaymentHistory.jsx
│   │   └── documents/
│   │       ├── DocumentVault.jsx
│   │       ├── DocumentUpload.jsx
│   │       └── DocumentViewer.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useSocket.js
│   │   ├── useDebounce.js
│   │   └── useLocalStorage.js
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   └── ForgotPasswordPage.jsx
│   │   ├── dashboard/
│   │   │   └── DashboardPage.jsx
│   │   ├── leads/
│   │   │   ├── LeadsPage.jsx
│   │   │   └── LeadDetailsPage.jsx
│   │   ├── calls/
│   │   │   ├── CallsPage.jsx
│   │   │   └── CallDetailsPage.jsx
│   │   ├── moods/
│   │   │   └── MoodsPage.jsx
│   │   ├── properties/
│   │   │   ├── PropertiesPage.jsx
│   │   │   └── PropertyDetailsPage.jsx
│   │   ├── tasks/
│   │   │   └── TasksPage.jsx
│   │   ├── payments/
│   │   │   └── PaymentsPage.jsx
│   │   ├── documents/
│   │   │   └── DocumentsPage.jsx
│   │   └── NotFoundPage.jsx
│   ├── store/
│   │   ├── authStore.js         # Zustand auth store
│   │   ├── dashboardStore.js    # Dashboard state
│   │   ├── leadsStore.js        # Leads state
│   │   └── notificationStore.js # Notifications state
│   ├── utils/
│   │   ├── constants.js
│   │   ├── validators.js
│   │   ├── formatters.js
│   │   └── helpers.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env
├── .env.example
├── .gitignore
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

---

## 🔧 CONFIGURATION

### 1. Environment Variables (`.env`)
```env
VITE_API_BASE_URL=http://localhost:10000/api/v1
VITE_SOCKET_URL=http://localhost:10000
VITE_APP_NAME=Elevare Intelligence
```

**Note:** Backend is running on port **10000**, NOT 5000!

### 2. Tailwind CSS Configuration (`tailwind.config.js`)
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
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
      },
    },
  },
  plugins: [],
}
```

### 3. Vite Configuration (`vite.config.js`)
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:10000',
        changeOrigin: true,
      }
    }
  }
})
```

---

## 🔐 AUTHENTICATION IMPLEMENTATION

### 1. Axios Configuration (`src/api/axios.js`)
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### 2. Auth API (`src/api/auth.api.js`)
```javascript
import api from './axios';

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.get('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.put(`/auth/reset-password/${token}`, { password }),
};
```

### 3. Auth Store (`src/store/authStore.js`)
```javascript
import { create } from 'zustand';
import { authAPI } from '../api/auth.api';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,

  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const { data } = await authAPI.login(credentials);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      set({ user: data.user, token: data.token, isAuthenticated: true, loading: false });
      return data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Login failed', loading: false });
      throw error;
    }
  },

  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await authAPI.register(userData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      set({ user: data.user, token: data.token, isAuthenticated: true, loading: false });
      return data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Registration failed', loading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false });
  },

  fetchUser: async () => {
    try {
      const { data } = await authAPI.getMe();
      set({ user: data.data });
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  },
}));

export default useAuthStore;
```

### 4. Login Form Component (`src/components/auth/LoginForm.jsx`)
```javascript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { toast } from 'react-toastify';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password });
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50"
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

### 5. Protected Route Component (`src/components/auth/ProtectedRoute.jsx`)
```javascript
import { Navigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
```

---

## 📊 DASHBOARD COMPONENTS

### 1. Dashboard API (`src/api/dashboard.api.js`)
```javascript
import api from './axios';

export const dashboardAPI = {
  getAgentDashboard: () => api.get('/dashboard/agent'),
  getLandlordDashboard: () => api.get('/dashboard/landlord'),
  getManagerDashboard: () => api.get('/dashboard/manager'),
};
```

### 2. Stats Card Component (`src/components/dashboard/StatsCard.jsx`)
```javascript
export default function StatsCard({ title, value, icon, color, trend }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {trend && (
            <p className={`text-sm mt-1 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
```

### 3. Agent Dashboard (`src/components/dashboard/AgentDashboard.jsx`)
```javascript
import { useEffect, useState } from 'react';
import { dashboardAPI } from '../../api/dashboard.api';
import StatsCard from './StatsCard';
import { FaUsers, FaTasks, FaPhone, FaChartLine } from 'react-icons/fa';

export default function AgentDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const { data: response } = await dashboardAPI.getAgentDashboard();
      setData(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Agent Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Active Leads"
          value={data?.activeLeads || 0}
          icon={<FaUsers className="text-white" />}
          color="bg-blue-500"
        />
        <StatsCard
          title="Pending Tasks"
          value={data?.pendingTasks || 0}
          icon={<FaTasks className="text-white" />}
          color="bg-yellow-500"
        />
        <StatsCard
          title="Calls Today"
          value={data?.todayCalls || 0}
          icon={<FaPhone className="text-white" />}
          color="bg-green-500"
        />
        <StatsCard
          title="Conversion Rate"
          value={`${data?.conversionRate || 0}%`}
          icon={<FaChartLine className="text-white" />}
          color="bg-purple-500"
        />
      </div>

      {/* Add more dashboard sections here */}
    </div>
  );
}
```

---

## 🎯 FEATURE MODULES

### 1. Leads Management (`src/api/leads.api.js`)
```javascript
import api from './axios';

export const leadsAPI = {
  getAll: (params) => api.get('/leads', { params }),
  getOne: (id) => api.get(`/leads/${id}`),
  create: (data) => api.post('/leads', data),
  update: (id, data) => api.put(`/leads/${id}`, data),
  delete: (id) => api.delete(`/leads/${id}`),
};
```

### 2. Lead List Component (`src/components/leads/LeadList.jsx`)
```javascript
import { useEffect, useState } from 'react';
import { leadsAPI } from '../../api/leads.api';
import LeadCard from './LeadCard';

export default function LeadList() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const { data } = await leadsAPI.getAll();
      setLeads(data.data);
    } catch (error) {
      console.error('Failed to fetch leads:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading leads...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {leads.map((lead) => (
        <LeadCard key={lead._id} lead={lead} onUpdate={fetchLeads} />
      ))}
    </div>
  );
}
```

### 3. Calls Management (`src/api/calls.api.js`)
```javascript
import api from './axios';

export const callsAPI = {
  getAll: (params) => api.get('/calls', { params }),
  getOne: (id) => api.get(`/calls/${id}`),
  create: (data) => api.post('/calls', data),
  addFeedback: (id, feedback) => api.post(`/calls/${id}/feedback`, feedback),
  delete: (id) => api.delete(`/calls/${id}`),
};
```

### 4. Mood Tracking (`src/api/moods.api.js`)
```javascript
import api from './axios';

export const moodsAPI = {
  getAll: () => api.get('/moods'),
  create: (data) => api.post('/moods', data),
  getDailyAnalysis: () => api.get('/moods/daily-analysis'),
  getWeeklyTrends: () => api.get('/moods/weekly-trends'),
};
```

### 5. Mood Tracker Component (`src/components/moods/MoodTracker.jsx`)
```javascript
import { useState } from 'react';
import { moodsAPI } from '../../api/moods.api';
import { toast } from 'react-toastify';

export default function MoodTracker() {
  const [mood, setMood] = useState(5);
  const [energy, setEnergy] = useState(5);
  const [focus, setFocus] = useState(5);
  const [confidence, setConfidence] = useState(5);
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await moodsAPI.create({
        entryType: 'daily-check-in',
        mood,
        energy,
        focus,
        confidence,
        notes,
      });
      toast.success('Mood entry saved!');
      // Reset form
      setNotes('');
    } catch (error) {
      toast.error('Failed to save mood entry');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
      <h2 className="text-xl font-bold">Daily Mood Check-in</h2>
      
      <div>
        <label className="block text-sm font-medium mb-2">Mood: {mood}</label>
        <input
          type="range"
          min="1"
          max="10"
          value={mood}
          onChange={(e) => setMood(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Energy: {energy}</label>
        <input
          type="range"
          min="1"
          max="10"
          value={energy}
          onChange={(e) => setEnergy(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Focus: {focus}</label>
        <input
          type="range"
          min="1"
          max="10"
          value={focus}
          onChange={(e) => setFocus(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Confidence: {confidence}</label>
        <input
          type="range"
          min="1"
          max="10"
          value={confidence}
          onChange={(e) => setConfidence(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          rows="3"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700"
      >
        Save Entry
      </button>
    </form>
  );
}
```

---

## 🔌 SOCKET.IO INTEGRATION

### Socket Hook (`src/hooks/useSocket.js`)
```javascript
import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import useAuthStore from '../store/authStore';

export default function useSocket() {
  const socketRef = useRef(null);
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      socketRef.current = io(import.meta.env.VITE_SOCKET_URL, {
        auth: { userId: user._id }
      });

      socketRef.current.on('connect', () => {
        console.log('Socket connected');
      });

      socketRef.current.on('notification', (data) => {
        // Handle notifications
        console.log('New notification:', data);
      });

      return () => {
        socketRef.current?.disconnect();
      };
    }
  }, [user]);

  return socketRef.current;
}
```

---

## 🗺️ ROUTING SETUP

### Main App Router (`src/App.jsx`)
```javascript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ProtectedRoute from './components/auth/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';

// Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import LeadsPage from './pages/leads/LeadsPage';
import CallsPage from './pages/calls/CallsPage';
import MoodsPage from './pages/moods/MoodsPage';
import PropertiesPage from './pages/properties/PropertiesPage';
import TasksPage from './pages/tasks/TasksPage';
import PaymentsPage from './pages/payments/PaymentsPage';
import DocumentsPage from './pages/documents/DocumentsPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes */}
        <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="leads" element={<LeadsPage />} />
          <Route path="calls" element={<CallsPage />} />
          <Route path="moods" element={<MoodsPage />} />
          <Route path="properties" element={<PropertiesPage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="documents" element={<DocumentsPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

---

## 🎨 LAYOUT COMPONENTS

### Main Layout (`src/components/layout/MainLayout.jsx`)
```javascript
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function MainLayout() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
```

### Sidebar (`src/components/layout/Sidebar.jsx`)
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
    <aside className="w-64 bg-gray-900 text-white">
      <div className="p-4">
        <h1 className="text-xl font-bold">Elevare Intelligence</h1>
      </div>
      <nav className="mt-6">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 hover:bg-gray-800 ${
                isActive ? 'bg-gray-800 border-l-4 border-primary-500' : ''
              }`
            }
          >
            <item.icon className="mr-3" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
```

---

## 📦 ADDITIONAL API FILES

### Properties API (`src/api/properties.api.js`)
```javascript
import api from './axios';

export const propertiesAPI = {
  getAll: (params) => api.get('/properties', { params }),
  getOne: (id) => api.get(`/properties/${id}`),
  create: (data) => api.post('/properties', data),
  update: (id, data) => api.put(`/properties/${id}`, data),
  delete: (id) => api.delete(`/properties/${id}`),
};
```

### Tasks API (`src/api/tasks.api.js`)
```javascript
import api from './axios';

export const tasksAPI = {
  getAll: (params) => api.get('/tasks', { params }),
  getOne: (id) => api.get(`/tasks/${id}`),
  create: (data) => api.post('/tasks', data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  resolve: (id, response) => api.put(`/tasks/${id}/resolve`, { response }),
  delete: (id) => api.delete(`/tasks/${id}`),
};
```

### Payments API (`src/api/payments.api.js`)
```javascript
import api from './axios';

export const paymentsAPI = {
  getAll: (params) => api.get('/payments', { params }),
  getOne: (id) => api.get(`/payments/${id}`),
  create: (data) => api.post('/payments', data),
  update: (id, data) => api.put(`/payments/${id}`, data),
  delete: (id) => api.delete(`/payments/${id}`),
};
```

### Documents API (`src/api/documents.api.js`)
```javascript
import api from './axios';

export const documentsAPI = {
  getAll: (params) => api.get('/documents', { params }),
  getOne: (id) => api.get(`/documents/${id}`),
  upload: (formData) => api.post('/documents', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, data) => api.put(`/documents/${id}`, data),
  delete: (id) => api.delete(`/documents/${id}`),
};
```

---

## ✅ IMPLEMENTATION CHECKLIST

### Phase 1: Project Setup
- [ ] Create Vite + React project
- [ ] Install all dependencies
- [ ] Configure Tailwind CSS
- [ ] Setup environment variables
- [ ] Create folder structure

### Phase 2: Authentication
- [ ] Setup Axios with interceptors
- [ ] Create auth API endpoints
- [ ] Implement auth store (Zustand)
- [ ] Build login/register forms
- [ ] Create protected route component
- [ ] Test authentication flow

### Phase 3: Layout & Navigation
- [ ] Build main layout component
- [ ] Create navbar component
- [ ] Create sidebar with navigation
- [ ] Add responsive design
- [ ] Implement logout functionality

### Phase 4: Dashboard
- [ ] Create dashboard API integration
- [ ] Build stats cards
- [ ] Implement role-based dashboards (Agent/Landlord/Manager)
- [ ] Add charts and visualizations
- [ ] Real-time updates with Socket.io

### Phase 5: Feature Modules
- [ ] **Leads Management**
  - [ ] Lead list/grid view
  - [ ] Lead details page
  - [ ] Create/edit lead forms
  - [ ] Lead status updates
- [ ] **Calls Management**
  - [ ] Call history list
  - [ ] Call recorder component
  - [ ] AI analysis display
  - [ ] Coach feedback form
- [ ] **Mood Tracking**
  - [ ] Daily mood entry form
  - [ ] Mood charts (daily/weekly)
  - [ ] Psychospiritual insights
- [ ] **Properties**
  - [ ] Property listings
  - [ ] Property details
  - [ ] Create/edit property forms
- [ ] **Tasks**
  - [ ] Task list with filters
  - [ ] Task creation/assignment
  - [ ] Task resolution
- [ ] **Payments**
  - [ ] Payment history
  - [ ] Payment forms
  - [ ] Payment reminders
- [ ] **Documents**
  - [ ] Document vault
  - [ ] File upload
  - [ ] Document viewer

### Phase 6: Advanced Features
- [ ] Socket.io real-time notifications
- [ ] File upload handling
- [ ] Search and filtering
- [ ] Pagination
- [ ] Export to CSV/PDF
- [ ] Dark mode toggle
- [ ] Mobile responsiveness

### Phase 7: Testing & Deployment
- [ ] Unit tests for components
- [ ] Integration tests for API
- [ ] E2E tests with Cypress
- [ ] Build for production
- [ ] Deploy to hosting (Vercel/Netlify)

---

## 🚀 GETTING STARTED

1. **Create project:**
```bash
npm create vite@latest elevare-frontend -- --template react
cd elevare-frontend
```

2. **Install dependencies:**
```bash
npm install @mui/material @emotion/react @emotion/styled
npm install react-router-dom zustand axios
npm install react-hook-form yup socket.io-client react-toastify
npm install recharts date-fns
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

3. **Setup environment:**
```bash
cp .env.example .env
# Edit .env with your backend URL
```

4. **Run development server:**
```bash
npm run dev
```

5. **Build for production:**
```bash
npm run build
```

---

## 📝 NOTES

- Backend API must be running on `http://localhost:10000`
- All API endpoints are prefixed with `/api/v1`
- JWT token is stored in localStorage
- Socket.io connects automatically when user logs in
- Use React Query for better data fetching (optional enhancement)
- Consider adding Redux Toolkit for complex state (alternative to Zustand)

---

**Complete implementation aligned with backend API structure!** 🎉
