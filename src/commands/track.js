
const Budget = require("../models/budget");
const connectDB = require("../database");

module.exports = {
  name: "track",
  description: "Track an expense: !track <amount> <category>",
  async execute(message, args) {
    if (args.length < 2) {
      return message.reply("⚠️ Usage: `!track <amount> <category>`");
    }

    const amount = parseFloat(args[0]);
    if (isNaN(amount) || amount <= 0) {
      return message.reply("⚠️ Please enter a valid positive amount.");
    }

    const category = args.slice(1).join(" ");

    try {
      let budget = await Budget.findOne({ userId: message.author.id });

      if (!budget) {
        return message.reply(
          "⚠️ You haven't set a budget yet! Use `!setbudget <amount>`."
        );
      }

      // Update budget
      budget.spent += amount;
      budget.expenses.push({ amount, category, date: new Date() });
      await budget.save();

      // Save the expense to the expenses collection
      const db = await connectDB();
      const expensesCollection = db.collection("expenses");

      await expensesCollection.insertOne({
        userId: message.author.id,
        amount,
        category,
        date: new Date(),
      });

      // Get remaining days in the month
      const today = new Date();
      const lastDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0
      );
      const remainingDays = lastDayOfMonth.getDate() - today.getDate();

      const percentageSpent = (budget.spent / budget.budget) * 100;
      let alertMessage = `✅ Tracked **₹${amount}** for **${category}**.\n💰 Spent: **₹${budget.spent} / ₹${budget.budget}**\n📅 **Remaining days this month: ${remainingDays} days**`;

      // 🔔 Automated Alerts based on percentage spent
      if (percentageSpent >= 100) {
        alertMessage +=
          "\n🚨 **You've reached 100% of your budget! No more spending allowed.**";
      } else if (percentageSpent >= 90) {
        alertMessage += `\n⚠️ **Warning: You've spent 90% of your budget! Be extra cautious.**\n⏳ You have **${remainingDays} days** left. Try to manage wisely!`;
      } else if (percentageSpent >= 80) {
        alertMessage += `\n⚠️ **Caution: You've spent 80% of your budget! Consider slowing down.**\n⏳ You have **${remainingDays} days** to stretch your budget!`;
      } else if (percentageSpent >= 70) {
        alertMessage += `\n🔔 **Reminder: You've spent 70% of your budget! Keep an eye on expenses.**\n⏳ There are **${remainingDays} days** left this month.`;
      }

      return message.reply(alertMessage);
    } catch (error) {
      console.error("❌ Database Error:", error);
      return message.reply("⚠️ Failed to record expense. Please try again.");
    }
  },
};

