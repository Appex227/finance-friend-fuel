import { useState, useEffect } from "react";
import { MonthYearSelector } from "@/components/MonthYearSelector";
import { CurrencySelector } from "@/components/CurrencySelector";
import { ThemeToggle } from "@/components/ThemeToggle";
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
  const [currency, setCurrency] = useState<"USD" | "INR" | "EUR" | "JPY">("INR");
  
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

  // Calculate cumulative data across all months
  const getCumulativeData = () => {
    const allKeys = Object.keys(localStorage).filter(key => key.startsWith('budget-app-'));
    let cumulativeExpenses = 0;
    let cumulativeIncome = 0;
    let cumulativeBudget = 0;

    console.log('=== Cumulative Data Debug ===');
    console.log('All keys found:', allKeys);

    allKeys.forEach(key => {
      const data = JSON.parse(localStorage.getItem(key) || '{"budget":0,"transactions":[]}');
      console.log(`Key: ${key}`, data);
      cumulativeBudget += data.budget || 0;
      data.transactions?.forEach((t: Transaction) => {
        console.log(`Transaction: ${t.type} - ${t.amount}`);
        if (t.type === 'expense') cumulativeExpenses += t.amount;
        else if (t.type === 'income') cumulativeIncome += t.amount;
      });
    });

    console.log('Final cumulative values (before conversion):', {
      budget: cumulativeBudget,
      expenses: cumulativeExpenses,
      income: cumulativeIncome,
      savings: cumulativeBudget - cumulativeExpenses
    });

    return {
      budget: cumulativeBudget,
      expenses: cumulativeExpenses,
      income: cumulativeIncome,
      savings: cumulativeBudget - cumulativeExpenses
    };
  };

  const cumulativeData = getCumulativeData();

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
            <div className="flex flex-wrap gap-3 items-center">
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
              <ThemeToggle />
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
            conversionRate={conversionRate}
            currencySymbol={currencySymbol}
          />

          <div className="bg-card rounded-lg border p-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-4 text-foreground">Cumulative Summary (All Time)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Budget</p>
                <p className="text-2xl font-bold text-foreground">
                  {currencySymbol}{displayAmount(cumulativeData.budget).toFixed(2)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Expenses</p>
                <p className="text-2xl font-bold text-destructive">
                  {currencySymbol}{displayAmount(cumulativeData.expenses).toFixed(2)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Income</p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {currencySymbol}{displayAmount(cumulativeData.income).toFixed(2)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Savings</p>
                <p className={`text-2xl font-bold ${cumulativeData.savings >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-destructive'}`}>
                  {currencySymbol}{displayAmount(cumulativeData.savings).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

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
