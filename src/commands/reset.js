const Budget = require("../models/budget");
const connectDB = require("../database");

module.exports = {
  name: "reset",
  description: "Reset all expenses or the entire budget.",
  async execute(message, args) {
    if (args.length < 1) {
      return message.reply("⚠️ Usage: `!reset expenses` or `!reset budget`");
    }

    try {
      const option = args[0].toLowerCase();
      const db = await connectDB();
      const expensesCollection = db.collection("expenses");

      if (option === "expenses") {
        // Delete all expenses for the user
        const deleteResult = await expensesCollection.deleteMany({
          userId: message.author.id,
        });

        console.log(
          `Deleted ${deleteResult.deletedCount} expenses for user ${message.author.id}`
        );

        return message.reply(
          "✅ All expenses have been reset. Your budget remains unchanged."
        );
      } else if (option === "budget") {
        // Delete budget and all expenses
        await Budget.deleteOne({ userId: message.author.id });
        const deleteResult = await expensesCollection.deleteMany({
          userId: message.author.id,
        });

        console.log(
          `Deleted budget and ${deleteResult.deletedCount} expenses for user ${message.author.id}`
        );

        return message.reply(
          "✅ Your budget and all expenses have been completely reset."
        );
      } else {
        return message.reply(
          "⚠️ Invalid option. Use `!reset expenses` or `!reset budget`."
        );
      }
    } catch (error) {
      console.error("❌ Database Error:", error);
      return message.reply("⚠️ Failed to reset. Please try again.");
    }
  },
};
