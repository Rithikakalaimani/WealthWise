const connectDB = require("../database");

module.exports = {
  name: "history",
  description: "View your expense history: !history [number]",
  async execute(message, args) {
    const db = await connectDB();
    const expensesCollection = db.collection("expenses");

    let count = 5; // Default value

    if (args.length > 0) {
      const parsedCount = parseInt(args[0], 10);
      if (!isNaN(parsedCount) && parsedCount > 0 && parsedCount <= 100) {
        count = parsedCount;
      } else {
        return message.reply(
          "⚠️ Please provide a valid number between 1 and 100. Example: `!history 10`"
        );
      }
    }

    try {
      const expenses = await expensesCollection
        .find({ userId: message.author.id })
        .sort({ date: -1 }) // Sort by most recent date
        .limit(count) // Restrict to the required number of expenses
        .toArray();

      if (expenses.length === 0) {
        return message.reply("ℹ️ No expense history found.");
      }

      let historyMessage = `**Your Last ${expenses.length} Expenses:**\n`;
      expenses.slice(0, count).forEach((expense, index) => {
        const dateStr =
          expense.date instanceof Date
            ? expense.date.toDateString()
            : "Unknown Date";
        historyMessage += `**${index + 1}.** ₹${expense.amount} - ${
          expense.category
        } (${dateStr})\n`;
      });

      message.reply(historyMessage);
    } catch (error) {
      console.error("❌ Database Error:", error);
      message.reply("⚠️ Failed to retrieve history. Please try again.");
    }
  },
};
