import express from 'express';
import { updateStudentProfile, updateWorkerProfile } from '../controllers/updateProfileController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js'
const updateRouter = express.Router();

updateRouter.put('/student/:id',protect,upload.single('photo'),updateStudentProfile);
updateRouter.put('/worker/:id',protect,upload.single('photo'),updateWorkerProfile);

export default updateRouter;
