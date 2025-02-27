const Budget = require("../models/budget");
const connectDB = require("../database");

module.exports = {
  name: "summary",
  description: "View your total spending summary: !summary",
  async execute(message) {
    try {
      const budget = await Budget.findOne({ userId: message.author.id });

      if (!budget) {
        return message.reply(
          "⚠️ No budget found. Set your budget first using `!setbudget <amount>`."
        );
      }

      // Fetch expenses from the database
      const db = await connectDB();
      const expensesCollection = db.collection("expenses");

      const expenses = await expensesCollection
        .find({ userId: message.author.id })
        .toArray();

      if (!expenses.length) {
        return message.reply("ℹ️ No expenses recorded yet.");
      }

      // Get current date
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay()); // Start of current week (Sunday)

      const startOfBiWeek = new Date(today);
      startOfBiWeek.setDate(today.getDate() - (today.getDay() + 7)); // Start of last two weeks

      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // Start of month

      let weeklySpent = 0,
        biweeklySpent = 0,
        monthlySpent = 0;

      // Calculate weekly, biweekly, and monthly spendings
      expenses.forEach((expense) => {
        const expenseDate = new Date(expense.date);
        if (expenseDate >= startOfWeek) weeklySpent += expense.amount;
        if (expenseDate >= startOfBiWeek) biweeklySpent += expense.amount;
        if (expenseDate >= startOfMonth) monthlySpent += expense.amount;
      });

      // If budget is reset, do not show any summaries
      if (budget.spent === 0) {
        return message.reply(
          "⚠️ Your budget has been reset. No spending data available."
        );
      }

      // Build summary message
      const summaryMessage =
        `📊 **Spending Summary:**\n\n` +
        `🗓 **Weekly Spending:** ₹${weeklySpent.toFixed(2)}\n` +
        `📆 **Biweekly Spending:** ₹${biweeklySpent.toFixed(2)}\n` +
        `🗓 **Monthly Spending:** ₹${monthlySpent.toFixed(2)}\n` +
        `\n💰 **Total Budget:** ₹${budget.budget}\n` +
        `💸 **Total Spent:** ₹${budget.spent}\n` +
        `💵 **Remaining:** ₹${(budget.budget - budget.spent).toFixed(2)}`;

      return message.reply(summaryMessage);
    } catch (error) {
      console.error("❌ Error fetching summary:", error);
      return message.reply("⚠️ Failed to retrieve summary. Please try again.");
    }
  },
};
