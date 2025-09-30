import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface ExpenseIncomeFormProps {
  onAddExpense: (title: string, amount: number) => void;
  onAddIncome: (title: string, amount: number) => void;
  onSetBudget: (amount: number) => void;
  currentBudget: number;
}

export function ExpenseIncomeForm({ 
  onAddExpense, 
  onAddIncome, 
  onSetBudget,
  currentBudget 
}: ExpenseIncomeFormProps) {
  const [expenseTitle, setExpenseTitle] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [incomeTitle, setIncomeTitle] = useState("");
  const [incomeAmount, setIncomeAmount] = useState("");
  const [budget, setBudget] = useState(currentBudget.toString());

  const handleAddExpense = () => {
    if (!expenseTitle.trim() || !expenseAmount) {
      toast.error("Please fill in both expense title and amount");
      return;
    }
    onAddExpense(expenseTitle, parseFloat(expenseAmount));
    setExpenseTitle("");
    setExpenseAmount("");
    toast.success("Expense added successfully");
  };

  const handleAddIncome = () => {
    if (!incomeTitle.trim() || !incomeAmount) {
      toast.error("Please fill in both income title and amount");
      return;
    }
    onAddIncome(incomeTitle, parseFloat(incomeAmount));
    setIncomeTitle("");
    setIncomeAmount("");
    toast.success("Income added successfully");
  };

  const handleSetBudget = () => {
    if (!budget) {
      toast.error("Please enter a budget amount");
      return;
    }
    onSetBudget(parseFloat(budget));
    toast.success("Budget updated successfully");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Set Monthly Budget</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="budget">Budget Amount</Label>
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
            />
          </div>
          <div>
            <Label htmlFor="expense-amount">Amount</Label>
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
            />
          </div>
          <div>
            <Label htmlFor="income-amount">Amount</Label>
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
