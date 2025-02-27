const Budget = require("../models/budget");
const connectDB = require("../database");

module.exports = {
  name: "topcategories",
  description: "Shows the top 3 spending categories.",
  async execute(message) {
    try {
      const db = await connectDB();
      const expensesCollection = db.collection("expenses");

      const expenses = await expensesCollection
        .find({ userId: message.author.id })
        .toArray();

      if (!expenses.length) {
        return message.reply(
          "ℹ️ No expenses recorded yet. Add some with `!addexpense`."
        );
      }

      let categorySpending = {};

      expenses.forEach((expense) => {
        if (!categorySpending[expense.category]) {
          categorySpending[expense.category] = 0;
        }
        categorySpending[expense.category] += expense.amount;
      });

      // Convert object to array and sort by highest spending
      const sortedCategories = Object.entries(categorySpending)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3); // Get top 3

      if (sortedCategories.length === 0) {
        return message.reply("ℹ️ No spending data available.");
      }

      let response = "📊 **Top 3 Spending Categories:**\n";
      sortedCategories.forEach(([category, amount], index) => {
        response += `**${index + 1}. ${category}: ₹${amount.toFixed(2)}**\n`;
      });

      return message.reply(response);
    } catch (error) {
      console.error("❌ Error fetching top categories:", error);
      return message.reply(
        "⚠️ Failed to fetch top categories. Please try again."
      );
    }
  },
};
