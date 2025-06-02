import express from 'express';
import { getDashboardSummary } from '../controllers/dashboardController.js';
import { protect } from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/adminMiddleware.js';
const dashboardRoutes = express.Router();

dashboardRoutes.get('/summary', protect, isAdmin, getDashboardSummary);


export default dashboardRoutes;
