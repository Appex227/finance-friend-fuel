import { useState } from "react";
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Wallet, Pencil, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface BudgetSummaryProps {
  budget: number;
  totalExpenses: number;
  totalIncome: number;
  savings: number;
  currencySymbol: string;
  onBudgetEdit?: (newBudget: number) => void;
}

export function BudgetSummary({ budget, totalExpenses, totalIncome, savings, currencySymbol, onBudgetEdit }: BudgetSummaryProps) {
  const savingsIsPositive = savings >= 0;
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(budget.toFixed(2));

  const handleSave = () => {
    const newBudget = parseFloat(editValue);
    if (!isNaN(newBudget) && newBudget >= 0 && onBudgetEdit) {
      onBudgetEdit(newBudget);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditValue(budget.toFixed(2));
    setIsEditing(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-6 transition-all hover:shadow-lg">
        {isEditing ? (
          <>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground font-medium">Total Budget</p>
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="h-10"
                autoFocus
              />
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleSave}>
                <Check className="h-4 w-4 text-success" />
              </Button>
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleCancel}>
                <X className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm text-muted-foreground font-medium">Total Budget</p>
                {onBudgetEdit && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => setIsEditing(true)}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                )}
              </div>
              <p className="text-2xl font-bold text-foreground">{currencySymbol}{budget.toFixed(2)}</p>
            </div>
            <div className="p-3 rounded-full bg-primary/10">
              <Wallet className="h-6 w-6 text-primary" />
            </div>
          </div>
        )}
      </Card>

      <Card className="p-6 transition-all hover:shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground font-medium mb-1">Total Expenses</p>
            <p className="text-2xl font-bold text-destructive">{currencySymbol}{totalExpenses.toFixed(2)}</p>
          </div>
          <div className="p-3 rounded-full bg-destructive/10">
            <TrendingDown className="h-6 w-6 text-destructive" />
          </div>
        </div>
      </Card>

      <Card className="p-6 transition-all hover:shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground font-medium mb-1">Total Income</p>
            <p className="text-2xl font-bold text-success">{currencySymbol}{totalIncome.toFixed(2)}</p>
          </div>
          <div className="p-3 rounded-full bg-success/10">
            <TrendingUp className="h-6 w-6 text-success" />
          </div>
        </div>
      </Card>

      <Card className={`p-6 transition-all hover:shadow-lg ${savingsIsPositive ? 'bg-success/5 border-success/20' : 'bg-destructive/5 border-destructive/20'}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground font-medium mb-1">Savings</p>
            <p className={`text-2xl font-bold ${savingsIsPositive ? 'text-success' : 'text-destructive'}`}>
              {savingsIsPositive ? '+' : ''}{savings >= 0 ? currencySymbol : `-${currencySymbol}`}{Math.abs(savings).toFixed(2)}
            </p>
          </div>
          <div className={`p-3 rounded-full ${savingsIsPositive ? 'bg-success/20' : 'bg-destructive/20'}`}>
            <DollarSign className={`h-6 w-6 ${savingsIsPositive ? 'text-success' : 'text-destructive'}`} />
          </div>
        </div>
      </Card>
    </div>
  );
}
