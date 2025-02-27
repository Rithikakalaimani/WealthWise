const Budget = require("../models/budget");

module.exports = {
  name: "setbudget",
  description: "Sets a monthly spending limit.",
  async execute(message, args) {
    const userId = message.author.id;
    const budgetAmount = parseFloat(args[0]);

    if (isNaN(budgetAmount) || budgetAmount <= 0) {
      return message.reply("❌ Please provide a valid budget amount.");
    }

    try {
      let budget = await Budget.findOne({ userId });

      if (budget) {
        budget.budget = budgetAmount;
      } else {
        budget = new Budget({ userId, budget: budgetAmount });
      }

      await budget.save();
      message.reply(`✅ Your monthly budget is set to **₹${budgetAmount}**.`);
    } catch (err) {
      console.error(err);
      message.reply("❌ Error setting budget. Try again later.");
    }
  },
};
