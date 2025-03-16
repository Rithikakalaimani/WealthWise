# WealthWise

**WealthWise** is a personal finance tracking bot that helps users manage their expenses, set budgets, and get financial insights.

## Features
- Track daily expenses by category.
- View spending history with different time filters.
- Set and check monthly budgets.
- Reset expenses or budgets as needed.
- Get weekly, biweekly, and monthly spending summaries.
- Receive financial tips and insights.
- Identify top spending categories.
- Currency conversion support.
- Set a default currency for expense tracking.

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/rithikakalaimani/WealthWise.git
   ```
2. Navigate to the project directory:
   ```sh
   cd WealthWise
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Set up environment variables by creating a `.env` file in the root directory and adding:
   ```env
   BOT_TOKEN=your_discord_bot_token
   MONGO_URI=your_mongodb_connection_string
   ```
5. Start the bot:
   ```sh
   node src/index.js
   ```

## Commands

### Expense Tracking
- `!track <amount> <category>` → Records an expense.  
  **Example:** `!track 500 food`
- `!history` → Shows full expense history.
- `!history <N>` → Shows the last N transactions.
- `!topcategories` → Shows the top 3 spending categories.  
  **Example Output:** `Food: $150, Shopping: $90, Entertainment: $75`

### Budget Management
- `!setbudget <amount>` → Sets a budget for the month.  
  **Example:** `!setbudget 4000`
- `!checkbudget` → Displays current budget and remaining amount.
- `!reset expenses` → Clears all recorded expenses.
- `!reset budget` → Resets the budget.

### Financial Summaries
- `!summary weekly` → Provides a weekly spending summary.
- `!summary biweekly` → Provides a biweekly spending summary.
- `!summary monthly` → Provides a monthly spending summary.

### Additional Features
- `!tip` → Gives a random financial tip.

## Technologies Used
- **Node.js** - Backend runtime
- **MongoDB** - Database for storing user expenses
- **Discord.js** - Discord bot framework

## Contributing
Feel free to contribute! Fork the repo, make your changes, and submit a pull request.

## Author
Developed by **Rithika Kalaimani**.
