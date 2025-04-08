import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  PlusCircle,
  DollarSign,
  Users,
  Check,
  ArrowRight,
  RefreshCw,
  Receipt,
  BarChart3,
  CreditCard
} from "lucide-react";
import { addExpense, settleDebt, fetchExpenses } from "../store/ExpenesSlice";

const ExpenseSharing = ({ visitId, participants }) => {
  const dispatch = useDispatch();
  const { expenses, loading } = useSelector((state) => state.expenses);
  const { user } = useSelector((state) => state.auth);
  
  const [activeTab, setActiveTab] = useState("expenses");
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [expenseData, setExpenseData] = useState({
    description: "",
    amount: "",
    paidBy: user?._id,
    splitAmong: [],
    category: "food",
  });
  
  useEffect(() => {
    if (visitId) {
      dispatch(fetchExpenses(visitId));
    }
  }, [dispatch, visitId]);
  
  useEffect(() => {
    // Pre-select all participants to split expense by default
    if (participants && participants.length > 0) {
      const participantIds = participants.map(
        p => p.user?._id || p.user
      );
      setExpenseData(prev => ({
        ...prev,
        splitAmong: participantIds
      }));
    }
  }, [participants]);

  const handleAddExpense = () => {
    if (!expenseData.description || !expenseData.amount) return;
    
    dispatch(addExpense({
      visitId,
      expenseData: {
        ...expenseData,
        amount: parseFloat(expenseData.amount)
      }
    }));
    
    // Reset form
    setExpenseData({
      description: "",
      amount: "",
      paidBy: user?._id,
      splitAmong: participants?.map(p => p.user?._id || p.user) || [],
      category: "food"
    });
    
    setShowAddExpense(false);
  };
  
  const handleSettleDebt = (debtId) => {
    dispatch(settleDebt({
      visitId,
      debtId
    }));
  };
  
  // Calculate balances between users
  const calculateBalances = () => {
    if (!expenses || expenses.length === 0) return [];
    
    const balances = {};
    
    // Initialize balances for all participants
    participants.forEach(p => {
      const userId = p.user?._id || p.user;
      balances[userId] = 0;
    });
    
    // Calculate net balance for each user
    expenses.forEach(expense => {
      const paidById = expense.paidBy?._id || expense.paidBy;
      const amountPerPerson = expense.amount / expense.splitAmong.length;
      
      // Add the full amount to the person who paid
      balances[paidById] += expense.amount;
      
      // Subtract the split amount from each person who owes
      expense.splitAmong.forEach(personId => {
        const id = personId?._id || personId;
        balances[id] -= amountPerPerson;
      });
    });
    
    // Create transactions to settle debts
    const transactions = [];
    const debtors = [];
    const creditors = [];
    
    Object.keys(balances).forEach(userId => {
      if (balances[userId] < -0.01) {
        debtors.push({ id: userId, amount: balances[userId] });
      } else if (balances[userId] > 0.01) {
        creditors.push({ id: userId, amount: balances[userId] });
      }
    });
    
    // Create transactions for simplest debt settlement
    debtors.sort((a, b) => a.amount - b.amount); // Sort by debt amount (most negative first)
    creditors.sort((a, b) => b.amount - a.amount); // Sort by credit amount (most positive first)
    
    let i = 0, j = 0;
    
    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];
      
      const amount = Math.min(Math.abs(debtor.amount), creditor.amount);
      
      if (amount > 0.01) {
        // Use the getUserName function to get names
        const debtorName = getUserName(debtor.id);
        const creditorName = getUserName(creditor.id);
        
        transactions.push({
          from: { id: debtor.id, name: debtorName },
          to: { id: creditor.id, name: creditorName },
          amount: amount.toFixed(2)
        });
      }
      
      // Update balances
      debtor.amount += amount;
      creditor.amount -= amount;
      
      // Move to next person if their balance is settled
      if (Math.abs(debtor.amount) < 0.01) i++;
      if (creditor.amount < 0.01) j++;
    }
    
    return transactions;
  };
  
  // Actually using the getUserName function
  const getUserName = (userId) => {
    const participant = participants.find(p => 
      (p.user?._id || p.user) === userId
    );
    return participant?.user?.name || "Unknown";
  };
  
  const transactions = calculateBalances();
  
  const categories = [
    { value: "food", label: "Food & Drinks", icon: <CreditCard className="h-4 w-4" /> },
    { value: "transport", label: "Transportation", icon: <CreditCard className="h-4 w-4" /> },
    { value: "accommodation", label: "Accommodation", icon: <CreditCard className="h-4 w-4" /> },
    { value: "activities", label: "Activities", icon: <CreditCard className="h-4 w-4" /> },
    { value: "shopping", label: "Shopping", icon: <CreditCard className="h-4 w-4" /> },
    { value: "other", label: "Other", icon: <CreditCard className="h-4 w-4" /> }
  ];
  
  // Actually using the getCategoryIcon function
  const getCategoryIcon = (category) => {
    const categoryItem = categories.find(c => c.value === category);
    return categoryItem?.icon || <DollarSign className="h-4 w-4" />;
  };
  
  // Tab configuration
  const tabs = [
    { id: "expenses", label: "Expenses", icon: <Receipt className="w-4 h-4" /> },
    { id: "balances", label: "Balances", icon: <BarChart3 className="w-4 h-4" /> },
    { id: "addExpense", label: "Add New", icon: <PlusCircle className="w-4 h-4" /> }
  ];

  return (
    <div className="border-t border-gray-200 pt-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <div className="bg-purple-100 p-2 rounded-lg mr-3">
          <DollarSign className="h-5 w-5 text-purple-600" />
        </div>
        Expense Sharing
      </h2>
      
      {/* Tab Navigation */}
      <div className="flex mb-6 bg-gray-100 p-1 rounded-xl">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              if (tab.id === "addExpense") setShowAddExpense(true);
            }}
            className={`flex-1 flex items-center justify-center py-2.5 px-4 rounded-lg transition-all duration-300 cursor-pointer ${
              activeTab === tab.id 
                ? "bg-white text-purple-700 shadow-sm font-medium" 
                : "text-gray-600 hover:text-purple-600"
            }`}
          >
            <div className="flex items-center">
              {tab.icon}
              <span className="ml-2">{tab.label}</span>
            </div>
          </button>
        ))}
      </div>
      
      {/* Tab Content with Animation */}
      <div className="relative">
        {/* Expenses Tab */}
        <div 
          className={`transition-all duration-300 cursor-pointer ${
            activeTab === "expenses" 
              ? "opacity-100 transform translate-x-0" 
              : "opacity-0 absolute top-0 left-0 transform -translate-x-4 pointer-events-none"
          }`}
        >
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-800">Expenses List</h3>
            <button 
              onClick={() => {
                setActiveTab("addExpense");
                setShowAddExpense(true);
              }}
              className="text-sm bg-purple-100 hover:bg-purple-200 text-purple-700 py-1.5 px-3 rounded-lg transition-all duration-300 font-medium flex items-center"
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              Add
            </button>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <RefreshCw className="h-8 w-8 text-purple-500 animate-spin" />
            </div>
          ) : expenses && expenses.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-purple-200 scrollbar-track-transparent">
              {expenses.map(expense => (
                <div key={expense._id} className="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start">
                      <div className="bg-purple-100 p-2 rounded-lg mr-3">
                        {getCategoryIcon(expense.category)}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">{expense.description}</h4>
                        <p className="text-sm text-gray-500">
                          Paid by{" "}
                          <span className="font-medium text-purple-600">
                            {expense.paidBy?._id === user._id ? "You" : getUserName(expense.paidBy?._id || expense.paidBy)}
                          </span>
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Split among {expense.splitAmong.length} people
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800">${parseFloat(expense.amount).toFixed(2)}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(expense.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 p-8 rounded-xl text-center border border-dashed border-gray-200">
              <div className="inline-flex items-center justify-center bg-purple-100 p-4 rounded-full mb-4">
                <DollarSign className="h-8 w-8 text-purple-500" />
              </div>
              <p className="text-gray-500">No expenses have been added yet.</p>
            </div>
          )}
        </div>
        
        {/* Balances Tab */}
        <div 
          className={`transition-all duration-300 cursor-pointer ${
            activeTab === "balances" 
              ? "opacity-100 transform translate-x-0" 
              : "opacity-0 absolute top-0 left-0 transform translate-x-4 pointer-events-none"
          }`}
        >
          <h3 className="text-lg font-medium text-gray-800 mb-4">Balances to Settle</h3>
          
          {transactions.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {transactions.map((transaction, index) => (
                <div key={index} className="bg-blue-50 p-4 rounded-xl border border-blue-100 hover:shadow-md transition-all duration-300">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="bg-white p-2 rounded-full border border-blue-200 mr-3">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="flex items-center">
                          <span className="font-medium text-gray-800">
                            {transaction.from.id === user._id ? "You" : transaction.from.name}
                          </span>
                          <ArrowRight className="h-4 w-4 text-blue-500 mx-2" />
                          <span className="font-medium text-gray-800">
                            {transaction.to.id === user._id ? "You" : transaction.to.name}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          ${transaction.amount}
                        </p>
                      </div>
                    </div>
                    
                    {(transaction.from.id === user._id || transaction.to.id === user._id) && (
                      <button
                        onClick={() => handleSettleDebt({ 
                          fromId: transaction.from.id, 
                          toId: transaction.to.id,
                          amount: parseFloat(transaction.amount)
                        })}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-all duration-300 cursor-pointer"
                      >
                        {transaction.from.id === user._id ? "Mark as paid" : "Mark as received"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 p-8 rounded-xl text-center border border-dashed border-gray-200">
              <div className="inline-flex items-center justify-center bg-green-100 p-4 rounded-full mb-4">
                <Check className="h-8 w-8 text-green-500" />
              </div>
              <p className="text-gray-500">All balances are settled!</p>
            </div>
          )}
        </div>
        
        {/* Add Expense Tab */}
        <div 
          className={`transition-all duration-300 cursor-pointer ${
            activeTab === "addExpense" && showAddExpense
              ? "opacity-100 transform translate-x-0" 
              : "opacity-0 absolute top-0 left-0 transform translate-y-4 pointer-events-none"
          }`}
        >
          <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
            <h3 className="text-lg font-semibold text-purple-800 mb-4">Add New Expense</h3>
            
            {/* Add expense form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={expenseData.description}
                  onChange={(e) => setExpenseData({...expenseData, description: e.target.value})}
                  placeholder="Dinner, Taxi, etc."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    value={expenseData.amount}
                    onChange={(e) => setExpenseData({...expenseData, amount: e.target.value})}
                    placeholder="0.00"
                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={expenseData.category}
                  onChange={(e) => setExpenseData({...expenseData, category: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Paid By</label>
                <select
                  value={expenseData.paidBy}
                  onChange={(e) => setExpenseData({...expenseData, paidBy: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {participants.map(p => {
                    const id = p.user?._id || p.user;
                    const name = p.user?.name || "Unknown";
                    
                    return (
                      <option key={id} value={id}>
                        {name} {id === user._id ? "(You)" : ""}
                      </option>
                    );
                  })}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Split Among</label>
                <div className="bg-white p-3 border border-gray-300 rounded-lg max-h-40 overflow-y-auto">
                  {participants.map(p => {
                    const id = p.user?._id || p.user;
                    const name = p.user?.name || "Unknown";
                    return (
                      <div key={id} className="flex items-center mb-2 last:mb-0">
                        <input
                          type="checkbox"
                          id={`participant-${id}`}
                          checked={expenseData.splitAmong.includes(id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setExpenseData({
                                ...expenseData,
                                splitAmong: [...expenseData.splitAmong, id]
                              });
                            } else {
                              setExpenseData({
                                ...expenseData,
                                splitAmong: expenseData.splitAmong.filter(pId => pId !== id)
                              });
                            }
                          }}
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`participant-${id}`} className="ml-2 block text-sm text-gray-700">
                          {name} {id === user._id ? "(You)" : ""}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="flex space-x-3 pt-2">
                <button
                  onClick={handleAddExpense}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg transition-all duration-300 font-medium"
                >
                  Save Expense
                </button>
                <button
                  onClick={() => {
                    setShowAddExpense(false);
                    setActiveTab("expenses");
                  }}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-6 rounded-lg transition-all duration-300 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseSharing;