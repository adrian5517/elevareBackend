const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const app = express();

app.use(helmet());

// CORS Configuration - Allow multiple origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'https://elevare-frontend.vercel.app'
];

// Add any additional URLs from environment variable
if (process.env.FRONTEND_URL) {
  const envUrls = process.env.FRONTEND_URL.split(',').map(url => url.trim());
  allowedOrigins.push(...envUrls);
}

app.use(cors({ 
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list or is localhost
    if (allowedOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
      callback(null, true);
    } else {
      console.log('❌ CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

// Enable trust proxy for deployment behind reverse proxies (Render, Heroku, etc.)
// This is required for rate limiting and getting real client IPs
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1); // Trust first proxy
}

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use('/api', limiter);

// Routes
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/dashboard', require('./routes/dashboard'));
app.use('/api/v1/users', require('./routes/users'));
app.use('/api/v1/properties', require('./routes/properties'));
app.use('/api/v1/leads', require('./routes/leads'));
app.use('/api/v1/calls', require('./routes/calls'));
app.use('/api/v1/moods', require('./routes/moods'));
app.use('/api/v1/tasks', require('./routes/tasks'));
app.use('/api/v1/payments', require('./routes/payments'));
app.use('/api/v1/documents', require('./routes/documents'));

// Health
app.get('/health', (req, res) => res.status(200).json({ status: 'OK', timestamp: new Date() }));

// 404
app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack || err);
  res.status(err.statusCode || 500).json({ success: false, message: err.message || 'Server Error' });
});

module.exports = app;
