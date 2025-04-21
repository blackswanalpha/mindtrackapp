require('dotenv').config();
const rateLimit = require('express-rate-limit');
const { setupDb } = require('./db/neon');
const app = require('./app');

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

// Trust proxy for proper IP detection behind load balancers
app.set('trust proxy', 1);

// Add preflight handler for CORS
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.sendStatus(200);
});

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
