// controllers/dashboardController.js
import Complaint from '../models/Complaint.js';
import Worker from '../models/Worker.js';
import Student from '../models/Student.js';
import redis from '../utils/redis.js';

export const getDashboardSummary = async (req, res) => {
  const cacheKey = 'adminDashboardSummary';
  
  try {
    // 1. Attempt to get cached data
    const cachedData = await redis.get(cacheKey);
    
    if (cachedData) {
      console.log('Redis cache hit');
      const parsedData = JSON.parse(cachedData);
      
      // Verify cached data structure
      if (typeof parsedData.totalWorkers === 'number') {
        return res.status(200).json({
          success: true,
          fromCache: true,
          data: parsedData
        });
      }
      console.warn('Cached data structure invalid, fetching fresh data');
    }

    // 2. Cache miss or invalid - fetch fresh data
    const [
      totalComplaints,
      pendingComplaints,
      resolvedComplaints,
      oldPending,
      totalWorkers,
      totalStudents
    ] = await Promise.all([
      Complaint.countDocuments(),
      Complaint.countDocuments({ status: 'Pending' }),
      Complaint.countDocuments({ status: 'Resolved' }),
      Complaint.countDocuments({
        status: 'Pending',
        createdAt: { $lte: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) }
      }),
      Worker.countDocuments(),
      Student.countDocuments()
    ]);

    const summary = {
      totalComplaints,
      pendingComplaints,
      resolvedComplaints,
      oldPending,
      totalStudents,
      totalWorkers
    };

    // 3. Cache the fresh data with validation
    try {
      await redis.set(cacheKey, JSON.stringify(summary), 'EX', 60);
      console.log(' New data cached successfully');
    } catch (redisError) {
      console.error('Redis cache set error:', redisError);
    }

    return res.status(200).json({
      success: true,
      fromCache: false,
      data: summary
    });

  } catch (error) {
    console.error('Dashboard summary error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching dashboard summary',
      error: error.message
    });
  }
};