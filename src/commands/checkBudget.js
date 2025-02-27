const Budget = require("../models/budget");

module.exports = {
  name: "checkbudget",
  description: "Shows how much you've spent and how much remains.",
  async execute(message) {
    const userId = message.author.id;

    try {
      const budget = await Budget.findOne({ userId });

      if (!budget) {
        return message.reply(
          "❌ You haven't set a budget yet. Use `!setbudget <amount>`."
        );
      }

      const remaining = budget.budget - budget.spent;
      const spentPercentage = ((budget.spent / budget.budget) * 100).toFixed(2);

      message.reply(
        `📊 **Budget Overview:**\n
        💰 **Total Budget:** ₹${budget.budget}
        💸 **Spent:** ₹${budget.spent} (${spentPercentage}%)
        💡 **Remaining:** ₹${remaining}`
      );
    } catch (err) {
      console.error(err);
      message.reply("❌ Error checking budget. Try again later.");
    }
  },
};
