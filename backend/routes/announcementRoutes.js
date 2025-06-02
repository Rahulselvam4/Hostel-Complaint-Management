import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/adminMiddleware.js';
import { addAnnouncement, deleteAnnouncement, getAnnouncement, updateAnnouncement } from '../controllers/announcementController.js';


const announcementRouter = express.Router();

announcementRouter.post('/',protect,isAdmin, addAnnouncement);
announcementRouter.put('/:id',protect,isAdmin, updateAnnouncement);  
announcementRouter.get('/',protect, getAnnouncement);        
announcementRouter.delete('/:id',protect,isAdmin, deleteAnnouncement);

export default announcementRouter;
