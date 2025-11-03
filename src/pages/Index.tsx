import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IndianRupee, LogOut, Info } from "lucide-react";
import { MonthYearSelector } from "@/components/MonthYearSelector";
import { BudgetSummary } from "@/components/BudgetSummary";
import { ExpenseIncomeForm } from "@/components/ExpenseIncomeForm";
import { ExpenseIncomeList } from "@/components/ExpenseIncomeList";
import { CurrencySelector } from "@/components/CurrencySelector";
import { ThemeToggle } from "@/components/ThemeToggle";
import { MotivationalTips } from "@/components/MotivationalTips";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useBudgetData } from "@/hooks/useBudgetData";
import { UpgradeAccountBanner } from "@/components/UpgradeAccountBanner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

const CONVERSION_RATES: { [key: string]: number } = {
  USD: 1,
  EUR: 0.85,
  GBP: 0.73,
  INR: 83.12,
  JPY: 110.0,
};

const CURRENCY_SYMBOLS: { [key: string]: string } = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  INR: "₹",
  JPY: "¥",
};

interface MonthlyData {
  budget: number;
  transactions: Array<{
    id: string;
    title: string;
    amount: number;
    type: "expense" | "income";
  }>;
}

const Index = () => {
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedCurrency, setSelectedCurrency] = useState<"USD" | "INR" | "EUR" | "JPY">("INR");

  const { budget, transactions, cumulativeData, isLoading, updateBudget, addTransaction, updateTransaction, deleteTransaction } = useBudgetData(selectedMonth, selectedYear);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>;
  if (!user) return null;

  const isAnonymous = user?.is_anonymous ?? false;

  const currencySymbol = CURRENCY_SYMBOLS[selectedCurrency];
  const conversionRate = CONVERSION_RATES[selectedCurrency];
  const displayAmount = (amountInUSD: number) => (amountInUSD * conversionRate).toFixed(2);

  const totalExpenses = transactions?.reduce((sum, t) => (t.type === "expense" ? sum + Number(t.amount) : sum), 0) || 0;
  const totalIncome = transactions?.reduce((sum, t) => (t.type === "income" ? sum + Number(t.amount) : sum), 0) || 0;
  const budgetAmount = Number(budget?.budget_amount || 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="container mx-auto p-4 space-y-6">
        <header className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <IndianRupee className="w-8 h-8" />
            <div>
              <h1 className="text-4xl font-bold">Budget Tracker</h1>
              <p className="text-sm">{isAnonymous ? "Guest User" : user.email}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <ThemeToggle />
            {!isAnonymous && (
              <Button onClick={async () => { await signOut(); navigate("/auth"); }} variant="outline" size="sm">
                <LogOut className="w-4 h-4 mr-2" />Logout
              </Button>
            )}
          </div>
        </header>
        <UpgradeAccountBanner isAnonymous={isAnonymous} />
        <div className="flex gap-4">
          <MonthYearSelector selectedMonth={selectedMonth} selectedYear={selectedYear} onMonthChange={setSelectedMonth} onYearChange={setSelectedYear} />
          <CurrencySelector selectedCurrency={selectedCurrency} onCurrencyChange={setSelectedCurrency} />
        </div>
        {isLoading ? <p>Loading...</p> : (
          <>
            <BudgetSummary 
              budget={Number(displayAmount(budgetAmount))} 
              totalExpenses={Number(displayAmount(totalExpenses))} 
              totalIncome={Number(displayAmount(totalIncome))} 
              savings={Number(displayAmount(totalIncome - totalExpenses))} 
              currencySymbol={currencySymbol}
              onBudgetEdit={(newBudget) => {
                const budgetInUSD = newBudget / conversionRate;
                updateBudget(budgetInUSD);
              }}
            />
            <ExpenseIncomeForm onAddExpense={(t, a) => addTransaction({ title: t, amount: a, type: "expense" })} onAddIncome={(t, a) => addTransaction({ title: t, amount: a, type: "income" })} onSetBudget={updateBudget} currentBudget={Number(displayAmount(budgetAmount))} conversionRate={conversionRate} currencySymbol={currencySymbol} />
            <Card><CardHeader><CardTitle>All Time Summary</CardTitle></CardHeader><CardContent className="grid grid-cols-3 gap-4"><div><p className="text-sm">Total Budget</p><p className="text-2xl font-bold">{currencySymbol}{displayAmount(cumulativeData?.totalBudget || 0)}</p></div><div><p className="text-sm">Total Expenses</p><p className="text-2xl font-bold text-destructive">{currencySymbol}{displayAmount(cumulativeData?.totalExpenses || 0)}</p></div><div><p className="text-sm">Total Income</p><p className="text-2xl font-bold text-green-600">{currencySymbol}{displayAmount(cumulativeData?.totalIncome || 0)}</p></div></CardContent></Card>
            <MotivationalTips />
            <ExpenseIncomeList transactions={transactions?.map(t => ({ ...t, amount: Number(displayAmount(Number(t.amount))) })) || []} onDelete={deleteTransaction} onEdit={(id, t, a) => updateTransaction({ id, title: t, amount: a / conversionRate })} currencySymbol={currencySymbol} />
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
