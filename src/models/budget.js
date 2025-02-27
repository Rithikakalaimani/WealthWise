const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  budget: { type: Number, required: true },
  spent: { type: Number, default: 0 },
  expenses: [
    {
      amount: Number,
      category: String,
      date: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("Budget", budgetSchema);
