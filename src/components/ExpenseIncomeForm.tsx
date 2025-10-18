import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

// Validation schemas
const amountSchema = z.number()
  .positive("Amount must be positive")
  .max(999999999, "Amount is too large")
  .finite("Amount must be a valid number")
  .refine((val) => Number.isFinite(val) && val === Math.round(val * 100) / 100, {
    message: "Amount must have at most 2 decimal places"
  });

const titleSchema = z.string()
  .trim()
  .min(1, "Title cannot be empty")
  .max(200, "Title must be less than 200 characters");

interface ExpenseIncomeFormProps {
  onAddExpense: (title: string, amount: number) => void;
  onAddIncome: (title: string, amount: number) => void;
  onSetBudget: (amount: number) => void;
  currentBudget: number;
  conversionRate: number;
  currencySymbol: string;
}

export function ExpenseIncomeForm({ 
  onAddExpense, 
  onAddIncome, 
  onSetBudget,
  currentBudget,
  conversionRate,
  currencySymbol
}: ExpenseIncomeFormProps) {
  const [expenseTitle, setExpenseTitle] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [incomeTitle, setIncomeTitle] = useState("");
  const [incomeAmount, setIncomeAmount] = useState("");
  const [budget, setBudget] = useState((currentBudget * conversionRate).toFixed(2));

  // Update budget display when currency or budget changes
  useEffect(() => {
    setBudget((currentBudget * conversionRate).toFixed(2));
  }, [currentBudget, conversionRate]);

  const handleAddExpense = () => {
    // Validate title
    const titleResult = titleSchema.safeParse(expenseTitle);
    if (!titleResult.success) {
      toast.error(titleResult.error.errors[0].message);
      return;
    }

    // Validate amount
    const amount = parseFloat(expenseAmount);
    const amountResult = amountSchema.safeParse(amount);
    if (!amountResult.success) {
      toast.error(amountResult.error.errors[0].message);
      return;
    }

    // Convert from selected currency to USD for storage
    const amountInUSD = amount / conversionRate;
    onAddExpense(titleResult.data, amountInUSD);
    setExpenseTitle("");
    setExpenseAmount("");
    toast.success("Expense added successfully");
  };

  const handleAddIncome = () => {
    // Validate title
    const titleResult = titleSchema.safeParse(incomeTitle);
    if (!titleResult.success) {
      toast.error(titleResult.error.errors[0].message);
      return;
    }

    // Validate amount
    const amount = parseFloat(incomeAmount);
    const amountResult = amountSchema.safeParse(amount);
    if (!amountResult.success) {
      toast.error(amountResult.error.errors[0].message);
      return;
    }

    // Convert from selected currency to USD for storage
    const amountInUSD = amount / conversionRate;
    onAddIncome(titleResult.data, amountInUSD);
    setIncomeTitle("");
    setIncomeAmount("");
    toast.success("Income added successfully");
  };

  const handleSetBudget = () => {
    // Validate amount
    const amount = parseFloat(budget);
    const amountResult = amountSchema.safeParse(amount);
    if (!amountResult.success) {
      toast.error(amountResult.error.errors[0].message);
      return;
    }

    // Convert from selected currency to USD for storage
    const amountInUSD = amount / conversionRate;
    onSetBudget(amountInUSD);
    toast.success("Budget updated successfully");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Set Monthly Budget</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="budget">Budget Amount ({currencySymbol})</Label>
            <Input
              id="budget"
              type="number"
              placeholder="Enter budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="mt-1"
            />
          </div>
          <Button onClick={handleSetBudget} className="w-full">
            Update Budget
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Add Expense</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="expense-title">Expense Title</Label>
            <Input
              id="expense-title"
              placeholder="e.g., Groceries"
              value={expenseTitle}
              onChange={(e) => setExpenseTitle(e.target.value)}
              className="mt-1"
              maxLength={200}
            />
          </div>
          <div>
            <Label htmlFor="expense-amount">Amount ({currencySymbol})</Label>
            <Input
              id="expense-amount"
              type="number"
              placeholder="0.00"
              value={expenseAmount}
              onChange={(e) => setExpenseAmount(e.target.value)}
              className="mt-1"
            />
          </div>
          <Button onClick={handleAddExpense} variant="destructive" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Expense
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Add Income</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="income-title">Income Title</Label>
            <Input
              id="income-title"
              placeholder="e.g., Salary"
              value={incomeTitle}
              onChange={(e) => setIncomeTitle(e.target.value)}
              className="mt-1"
              maxLength={200}
            />
          </div>
          <div>
            <Label htmlFor="income-amount">Amount ({currencySymbol})</Label>
            <Input
              id="income-amount"
              type="number"
              placeholder="0.00"
              value={incomeAmount}
              onChange={(e) => setIncomeAmount(e.target.value)}
              className="mt-1"
            />
          </div>
          <Button onClick={handleAddIncome} className="w-full bg-success hover:bg-success/90">
            <Plus className="h-4 w-4 mr-2" />
            Add Income
          </Button>
        </div>
      </Card>
    </div>
  );
}
