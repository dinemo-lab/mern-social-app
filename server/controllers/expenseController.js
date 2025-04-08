import Expense from "../models/expense.model.js";
import Settlement from "../models/settlement.model.js";
import Visit from "../models/visitRequest.model.js";

// ✅ Get all expenses for a visit
export const getExpenses = async (req, res) => {
  try {
    const visitId = req.params.visitId;
    const visit = await Visit.findById(visitId);
    if (!visit) return res.status(404).json({ message: "Visit not found" });

    const isOrganizer = visit.user.toString() === req.user.id;
    const isParticipant = visit.joinRequests.some(
      (r) => r.user.toString() === req.user.id && r.status === "accepted"
    );

    if (!isOrganizer && !isParticipant) {
      return res.status(403).json({ message: "Access denied" });
    }

    const expenses = await Expense.find({ visit: visitId })
      .populate("paidBy", "name profilePicture")
      .populate("splitAmong", "name profilePicture");

    const settlements = await Settlement.find({ visit: visitId })
      .populate("fromUser", "name profilePicture")
      .populate("toUser", "name profilePicture");

    res.json({ expenses, settlements });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Add a new expense
export const newExpense = async (req, res) => {
  try {
    const visitId = req.params.visitId;
    const { description, amount, paidBy, splitAmong, category } = req.body;

    const visit = await Visit.findById(visitId);
    if (!visit) return res.status(404).json({ message: "Visit not found" });

    const isOrganizer = visit.user.toString() === req.user.id;
    const isParticipant = visit.joinRequests.some(
      (r) => r.user.toString() === req.user.id && r.status === "accepted"
    );

    if (!isOrganizer && !isParticipant) {
      return res.status(403).json({ message: "Access denied" });
    }

    const newExpense = new Expense({
      visit: visitId,
      description,
      amount,
      paidBy,
      splitAmong,
      category,
    });

    await newExpense.save();

    const populatedExpense = await Expense.findById(newExpense._id)
      .populate("paidBy", "name profilePicture")
      .populate("splitAmong", "name profilePicture");

    res.json({ expense: populatedExpense });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Settle a debt
export const settleExpense = async (req, res) => {
  try {
    const visitId = req.params.visitId;
    const { fromId, toId, amount } = req.body;

    const visit = await Visit.findById(visitId);
    if (!visit) return res.status(404).json({ message: "Visit not found" });

    if (req.user.id !== fromId && req.user.id !== toId) {
      return res.status(403).json({ message: "Access denied" });
    }

    const newSettlement = new Settlement({
      visit: visitId,
      fromUser: fromId,
      toUser: toId,
      amount,
      settled: true,
    });

    await newSettlement.save();

    const expenses = await Expense.find({ visit: visitId })
      .populate("paidBy", "name profilePicture")
      .populate("splitAmong", "name profilePicture");

    const settlements = await Settlement.find({ visit: visitId })
      .populate("fromUser", "name profilePicture")
      .populate("toUser", "name profilePicture");

    res.json({ expenses, settlements });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
