require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { setupDb } = require('./db/neon');

// Import routes
const indexRoutes = require('./routes/index');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', indexRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
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
