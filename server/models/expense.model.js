import mongoose from "mongoose";
const ExpenseSchema = new mongoose.Schema(
  {
    visit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Visit",
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paidBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    splitAmong: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
    category: {
      type: String,
      enum: ["food", "transport", "accommodation", "activities", "shopping", "other"],
      default: "other",
    },
    settled: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);


export default mongoose.model("Expense", ExpenseSchema);