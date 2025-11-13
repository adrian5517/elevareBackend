const socketIo = require('socket.io');

function initializeSocket(server) {
  // Configure allowed origins for Socket.io CORS
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

  const io = socketIo(server, {
    cors: {
      origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps, Postman)
        if (!origin) return callback(null, true);
        
        // Check if origin is in allowed list or starts with localhost
        if (allowedOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
          callback(null, true);
        } else {
          console.log('❌ Socket.io CORS blocked origin:', origin);
          callback(new Error('Not allowed by CORS'));
        }
      },
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('join', (userId) => {
      socket.join(`user_${userId}`);
    });

    socket.on('send-notification', (data) => {
      io.to(`user_${data.userId}`).emit('notification', data.notification);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
}

module.exports = initializeSocket;
