function calculateBalances(expenses) {
    const balances = {};
  
    expenses.forEach(expense => {
      const amountPerPerson = expense.amount / expense.splitBetween.length;
      
      // Add to the payer's balance
      if (!balances[expense.paidBy]) balances[expense.paidBy] = 0;
      balances[expense.paidBy] += expense.amount;
      
      // Subtract from each person who owes
      expense.splitBetween.forEach(userId => {
        if (userId.toString() !== expense.paidBy.toString()) {
          if (!balances[userId]) balances[userId] = 0;
          balances[userId] -= amountPerPerson;
        }
      });
    });
  
    return balances;
  }
  
  function simplifyBalances(balances) {
    const creditors = [];
    const debtors = [];
    const simplified = [];
  
    // Separate into creditors and debtors
    Object.entries(balances).forEach(([userId, balance]) => {
      if (balance > 0.01) { // Creditor
        creditors.push({ userId, amount: balance });
      } else if (balance < -0.01) { // Debtor
        debtors.push({ userId, amount: -balance }); // Store as positive for easier math
      }
    });
  
    // Sort largest to smallest
    creditors.sort((a, b) => b.amount - a.amount);
    debtors.sort((a, b) => b.amount - a.amount);
  
    // Distribute debts to creditors
    let creditorIndex = 0;
    let debtorIndex = 0;
  
    while (creditorIndex < creditors.length && debtorIndex < debtors.length) {
      const creditor = creditors[creditorIndex];
      const debtor = debtors[debtorIndex];
      const amount = Math.min(creditor.amount, debtor.amount);
  
      if (amount > 0.01) { // Ignore tiny amounts
        simplified.push({
          from: debtor.userId,
          to: creditor.userId,
          amount: parseFloat(amount.toFixed(2))
        });
  
        creditor.amount -= amount;
        debtor.amount -= amount;
      }
  
      if (creditor.amount < 0.01) creditorIndex++;
      if (debtor.amount < 0.01) debtorIndex++;
    }
  
    return simplified;
  }
  
  export default {
    calculateBalances,
    simplifyBalances
  };