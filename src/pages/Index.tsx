import { useState, useEffect } from "react";
import { MonthYearSelector } from "@/components/MonthYearSelector";
import { CurrencySelector } from "@/components/CurrencySelector";
import { BudgetSummary } from "@/components/BudgetSummary";
import { ExpenseIncomeForm } from "@/components/ExpenseIncomeForm";
import { ExpenseIncomeList, Transaction } from "@/components/ExpenseIncomeList";
import { MotivationalTips } from "@/components/MotivationalTips";
import { toast } from "sonner";

interface MonthlyData {
  budget: number;
  transactions: Transaction[];
}

const CONVERSION_RATES = {
  USD: 1,
  EUR: 0.92,
  INR: 83.0,
  JPY: 150.0
};

const CURRENCY_SYMBOLS = {
  USD: "$",
  EUR: "€",
  INR: "₹",
  JPY: "¥"
};

const Index = () => {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [currency, setCurrency] = useState<"USD" | "INR" | "EUR" | "JPY">("USD");
  
  const getStorageKey = (month: number, year: number) => 
    `budget-app-${year}-${month}`;

  const loadMonthlyData = (month: number, year: number): MonthlyData => {
    const key = getStorageKey(month, year);
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : { budget: 0, transactions: [] };
  };

  const saveMonthlyData = (month: number, year: number, data: MonthlyData) => {
    const key = getStorageKey(month, year);
    localStorage.setItem(key, JSON.stringify(data));
  };

  const [monthlyData, setMonthlyData] = useState<MonthlyData>(() => 
    loadMonthlyData(selectedMonth, selectedYear)
  );

  useEffect(() => {
    const data = loadMonthlyData(selectedMonth, selectedYear);
    setMonthlyData(data);
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    saveMonthlyData(selectedMonth, selectedYear, monthlyData);
  }, [monthlyData, selectedMonth, selectedYear]);

  const handleSetBudget = (amount: number) => {
    setMonthlyData(prev => ({ ...prev, budget: amount }));
  };

  const handleAddExpense = (title: string, amount: number) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      title,
      amount,
      type: "expense"
    };
    setMonthlyData(prev => ({
      ...prev,
      transactions: [...prev.transactions, newTransaction]
    }));
  };

  const handleAddIncome = (title: string, amount: number) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      title,
      amount,
      type: "income"
    };
    setMonthlyData(prev => ({
      ...prev,
      transactions: [...prev.transactions, newTransaction]
    }));
  };

  const handleDeleteTransaction = (id: string) => {
    setMonthlyData(prev => ({
      ...prev,
      transactions: prev.transactions.filter(t => t.id !== id)
    }));
    toast.success("Transaction deleted");
  };

  const totalExpenses = monthlyData.transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalIncome = monthlyData.transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const savings = monthlyData.budget - totalExpenses;

  const currencySymbol = CURRENCY_SYMBOLS[currency];
  const conversionRate = CONVERSION_RATES[currency];

  const displayAmount = (amount: number) => amount * conversionRate;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Budget Tracker
              </h1>
              <p className="text-muted-foreground">
                Manage your finances and track your savings
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <MonthYearSelector
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                onMonthChange={setSelectedMonth}
                onYearChange={setSelectedYear}
              />
              <CurrencySelector
                selectedCurrency={currency}
                onCurrencyChange={setCurrency}
              />
            </div>
          </div>
          
          <BudgetSummary
            budget={displayAmount(monthlyData.budget)}
            totalExpenses={displayAmount(totalExpenses)}
            totalIncome={displayAmount(totalIncome)}
            savings={displayAmount(savings)}
            currencySymbol={currencySymbol}
          />
        </header>

        <div className="space-y-6">
          <ExpenseIncomeForm
            onAddExpense={handleAddExpense}
            onAddIncome={handleAddIncome}
            onSetBudget={handleSetBudget}
            currentBudget={monthlyData.budget}
          />

          <MotivationalTips />

          <ExpenseIncomeList
            transactions={monthlyData.transactions.map(t => ({
              ...t,
              amount: displayAmount(t.amount)
            }))}
            onDelete={handleDeleteTransaction}
            currencySymbol={currencySymbol}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
