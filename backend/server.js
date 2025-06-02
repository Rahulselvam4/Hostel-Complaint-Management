import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes/authRoutes.js';
import connectDB from './config/db.js';
import complaintrouter from './routes/complaintRoutes.js';
import workerRoutes from './routes/workerRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import announcementRouter from './routes/announcementRoutes.js';
import updateRouter from './routes/updateProfileRoutes.js';
import authRouter from './routes/auth.js';
import logger from './utils/logger.js';
import morgan from 'morgan';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
connectDB();

// Routes
app.use('/api/auth', router);
app.use('/api/complaints', complaintrouter);
app.use('/api/admin/workers', workerRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admin-announcement',announcementRouter);
app.use('/api/updateprofile',updateRouter);
app.use("/api/auth", authRouter);


// Health check endpoint
app.get('/', (req, res) => {
  res.send('Hostel Mate API is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});
app.use(
  morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info('Server started on port 5000');
  // console.log(`Server running on port ${PORT}`);
});
