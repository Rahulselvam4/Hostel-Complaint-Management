import express from 'express';
import { createComplaint ,adminUpdateComplaintStatus, addComplaintFeedback,getAllComplaints,getComplaintsByStudent, getWorkerComplaints, getPendingComplaints, getResolvedComplaints, getStalePendingComplaints, updateComplaintStatusByWorker} from '../controllers/complaintController.js';
import { protect } from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/adminMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const complaintrouter = express.Router();


complaintrouter.post('/',protect,  upload.single('photo'), createComplaint);
complaintrouter.get('/student', protect, getComplaintsByStudent);
complaintrouter.put('/:complaintId/feedback', protect, addComplaintFeedback);


complaintrouter.get('/all',protect,isAdmin,getAllComplaints);
complaintrouter.get('/pending', protect, isAdmin, getPendingComplaints);
complaintrouter.get('/resolved', protect, isAdmin, getResolvedComplaints);
complaintrouter.get('/pending-stale', protect, isAdmin, getStalePendingComplaints);
complaintrouter.put('/admin/:complaintId/status', protect, isAdmin, adminUpdateComplaintStatus);




complaintrouter.get('/worker', protect, getWorkerComplaints);
complaintrouter.put('/:id/resolve', protect, updateComplaintStatusByWorker);



export default complaintrouter;
