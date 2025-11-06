require('dotenv').config();
const http = require('http');
const mongoose = require('mongoose');
const app = require('./src/app');
const initializeSocket = require('./src/sockets');

const PORT = process.env.PORT || 10000;

console.log('Starting server.js', { pid: process.pid, env: process.env.NODE_ENV || 'development' });
console.log('Using PORT:', PORT);
console.log('MONGODB_URI (truncated):', (process.env.MONGODB_URI || '').slice(0, 80) + (process.env.MONGODB_URI && process.env.MONGODB_URI.length > 80 ? '...': ''));

// Connect to MongoDB with connection event logs
// Configure mongoose behavior: don't buffer commands indefinitely and use reasonable timeouts
mongoose.set('bufferCommands', false); // immediately return errors if not connected
mongoose.set('strictQuery', false);

const mongoUri = process.env.MONGODB_URI || '';
if (!mongoUri) {
  console.warn('No MONGODB_URI provided; running without DB connection');
} else {
  mongoose.connect(mongoUri, {
    // reduce timeouts so failed DNS/connection doesn't block long
    serverSelectionTimeoutMS: parseInt(process.env.MONGO_SERVER_SELECTION_TIMEOUT_MS) || 5000,
    connectTimeoutMS: parseInt(process.env.MONGO_CONNECT_TIMEOUT_MS) || 10000
  })
    .then(() => console.log('✅ MongoDB connected'))
    .catch((err) => {
      console.error('❌ MongoDB connection error:', err && err.message ? err.message : err);
    });

  mongoose.connection.on('connected', () => console.log('mongoose event: connected'));
  mongoose.connection.on('error', (err) => console.error('mongoose event: error', err && err.message ? err.message : err));
  mongoose.connection.on('disconnected', () => console.log('mongoose event: disconnected'));
}

const server = http.createServer((req, res) => {
  // small debug for incoming requests
  console.log(`Incoming request: ${req.method} ${req.url}`);
  return app(req, res);
});

// Initialize socket.io and attach to app
const io = initializeSocket(server);
app.set('io', io);

server.listen(PORT);

server.on('listening', () => {
  const addr = server.address();
  console.log(`🚀 HTTP server listening on ${addr.address || '0.0.0.0'}:${addr.port}`);
});

server.on('error', (err) => {
  console.error('Server error event:', err && err.message ? err.message : err);
});

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  try { server.close(() => process.exit(1)); } catch(e) { process.exit(1); }
});

