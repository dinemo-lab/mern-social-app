import mongoose from 'mongoose';
const expenseSchema = new mongoose.Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0.01
  },
  paidBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  splitBetween: [{
    type: mongoose.Schema.Types.Mixed, // More flexible type
    required: true,
    validate: {
      validator: function(v) {
        // Custom validation to check if it's either ObjectId or string
        return mongoose.isValidObjectId(v) || typeof v === 'string';
      },
      message: props => `${props.value} is not a valid user reference!`
    }
  }],
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add index for faster querying by chatId
expenseSchema.index({ chatId: 1 });

export default mongoose.model('Expense', expenseSchema);