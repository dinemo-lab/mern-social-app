import Expense from '../models/expense.model.js';

import calculateBalances from '../utils/balanceCalculator.js';
import simplifyBalances from '../utils/balanceCalculator.js';



export const getAllExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({ chatId: req.params.chatId })
          .sort({ timestamp: -1 })
          .populate('paidBy', 'username')
          .populate('splitBetween', 'username');
    
        res.json(expenses);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
}


export const getBalanceForChat = async (req, res) => {
    try {
        const expenses = await Expense.find({ chatId: req.params.chatId });
        const balances = calculateBalances(expenses);
        const simplified = simplifyBalances(balances);
    
        res.json({
          detailed: balances,
          simplified
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
}

export const addNewExpense = async (req, res) => {

    try {
        const expense = new Expense(req.body);
        await expense.save();
        res.status(201).json(expense);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }

}

export const deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findByIdAndDelete(req.params.id);
        if (!expense) {
          return res.status(404).json({ error: 'Expense not found' });
        }
        res.json({ message: 'Expense deleted successfully' });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
}