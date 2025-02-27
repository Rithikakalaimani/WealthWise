const Budget = require("../models/budget");
const connectDB = require("../database");

module.exports = {
  name: "tip",
  description:
    "Get personalized financial tips and suggestions for better spending and saving.",
  async execute(message) {
    try {
      const budget = await Budget.findOne({ userId: message.author.id });

      if (!budget) {
        return message.reply(
          "⚠️ No budget found. Set your budget first using `!setbudget <amount>`."
        );
      }

      const db = await connectDB();
      const expensesCollection = db.collection("expenses");

      const expenses = await expensesCollection
        .find({ userId: message.author.id })
        .toArray();

      if (!expenses.length) {
        return message.reply(
          "ℹ️ No expenses recorded yet. Try adding some with `!addexpense`."
        );
      }

      let totalSpent = 0;
      let categorySpending = {};
      let essentialCategories = [
        "rent",
        "groceries",
        "bills",
        "transport",
        "health",
        "medicine",
      ];
      let nonEssentialCategories = [
        "dining Out",
        "food",
        "movies",
        "theater",
        "music",
        "games",
        "toys",
        "electronics",
        "gadgets",
        "subscriptions",
        "books",
        "clothing",
        "shoes",
        "accessories",
        "beauty",
        "cosmetics",
        "fitness",
        "sports",
        "entertainment",
        "shopping",
        "luxury",
        "travel",
        "vacation",
        "dress",
        "party",
      ];
      let savingsOpportunities = [];
      let smartSpendingSuggestions = [];

      expenses.forEach((expense) => {
        totalSpent += expense.amount;
        categorySpending[expense.category] =
          (categorySpending[expense.category] || 0) + expense.amount;
      });

      let highestCategory = Object.keys(categorySpending).reduce(
        (a, b) => (categorySpending[a] > categorySpending[b] ? a : b),
        ""
      );
      let percentSpent = (totalSpent / budget.budget) * 100;

      // Correct calculation of remaining days in the month
      let today = new Date();
      let lastDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0
      ).getDate();
      let remainingDays = lastDayOfMonth - today.getDate();

      // Identify areas for savings
      Object.keys(categorySpending).forEach((category) => {
        if (
          nonEssentialCategories.includes(category) &&
          categorySpending[category] > budget.budget * 0.2
        ) {
          savingsOpportunities.push(
            `🔻 Reduce spending on **${category}** (₹${categorySpending[
              category
            ].toFixed(2)}) to save more.`
          );
        }
      });

      // Identify areas where spending is necessary
      Object.keys(categorySpending).forEach((category) => {
        if (
          essentialCategories.includes(category) &&
          categorySpending[category] < budget.budget * 0.2
        ) {
          smartSpendingSuggestions.push(
            `📌 Consider allocating more to **${category}** for better quality of life.`
          );
        }
      });

      let tipMessage = "📊 **Smart Spending & Saving Tips:**\n\n";

      if (highestCategory) {
        tipMessage += `💡 Your highest spending category is **${highestCategory}** (₹${categorySpending[
          highestCategory
        ].toFixed(2)}). Try budgeting this better.\n`;
      }

      if (percentSpent >= 70 && percentSpent < 80) {
        tipMessage += `⚠️ **Caution:** You've used **${percentSpent.toFixed(
          1
        )}%** of your budget. Only **${remainingDays} days left** this month!\n`;
      } else if (percentSpent >= 80 && percentSpent < 90) {
        tipMessage += `🚨 **Warning:** Budget usage at **${percentSpent.toFixed(
          1
        )}%**! You have just **${remainingDays} days** to manage your expenses.\n`;
      } else if (percentSpent >= 90 && percentSpent < 100) {
        tipMessage += `⚠️ **Critical:** Budget is **90%+ used**! Try cutting non-essentials immediately.\n`;
      } else if (percentSpent >= 100) {
        tipMessage += `❌ **Over Budget!** You've exceeded your budget by **₹${(
          totalSpent - budget.budget
        ).toFixed(2)}**. Reduce spending in non-essential areas now.\n`;
      }

      if (savingsOpportunities.length > 0) {
        tipMessage += `\n💰 **Where to Save Money:**\n`;
        tipMessage += savingsOpportunities.join("\n") + "\n";
      }

      if (smartSpendingSuggestions.length > 0) {
        tipMessage += `\n✅ **Where to Spend Wisely:**\n`;
        tipMessage += smartSpendingSuggestions.join("\n") + "\n";
      }

      tipMessage += `\n📌 **Tip:** Consider allocating at least **10% of your budget** to savings or investments for future security.\n`;

      return message.reply(tipMessage);
    } catch (error) {
      console.error("❌ Error generating tips:", error);
      return message.reply("⚠️ Failed to generate tips. Please try again.");
    }
  },
};
