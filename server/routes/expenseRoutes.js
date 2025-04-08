import express from 'express';
import { getAllExpenses,getBalanceForChat,addNewExpense,deleteExpense } from '../controllers/expenseController.js';
import {protect} from '../middleware/authMiddleware.js'; // Import the authentication middleware
 


const router = express.Router();

router.post('/:chatId/expenses', protect, getAllExpenses); // Route to create a new expense
router.get('/:chatId/balances', protect, getBalanceForChat); // Route to get all expenses for a specific visit       
router.put('/expenses', protect, addNewExpense); // Route to update an expense by ID
router.delete('/expenses/:id', protect, deleteExpense); 

export default router; // Route to delete an expense by ID