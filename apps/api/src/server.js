require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { setupDb } = require('./db/neon');

// Import routes
const indexRoutes = require('./routes/index');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3001;

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many requests, please try again later.'
  }
});

// Apply rate limiting to API routes
app.use('/api/', apiLimiter);

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3002'],
  credentials: true
}));
app.use(morgan('combined')); // Logging
app.use(compression()); // Performance optimizations
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Trust proxy for proper IP detection behind load balancers
app.set('trust proxy', 1);

// Routes
app.use('/api/v1', indexRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Initialize database connection if DATABASE_URL is provided
    if (process.env.DATABASE_URL) {
      try {
        await setupDb();
        console.log('Database connected successfully');
      } catch (dbError) {
        console.error('Warning: Database connection failed:', dbError.message);
        console.log('Continuing without database connection...');
      }
    } else {
      console.log('No DATABASE_URL provided. Running without database connection.');
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
