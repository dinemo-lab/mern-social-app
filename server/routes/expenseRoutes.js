import express from "express";
import {protect} from "../middleware/authMiddleware.js"
import {
  getExpenses,
  newExpense,
  settleExpense,
} from "../controllers/expenseController.js";

const router = express.Router();

router.get("/:visitId", protect, getExpenses);
router.post("/:visitId/", protect, newExpense);
router.post("/:visitId/settle", protect, settleExpense);

export default router;
