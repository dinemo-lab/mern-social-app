import express from 'express';
import { handleContactForm } from '../controllers/contactController.js';
import {protect} from '../middleware/authMiddleware.js'; // Import the authentication middleware


const router = express.Router();


router.post('/',protect, handleContactForm);

export default router;