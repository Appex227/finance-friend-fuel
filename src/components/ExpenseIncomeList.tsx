import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, TrendingDown, TrendingUp, Pencil } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: "expense" | "income";
}

interface ExpenseIncomeListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onEdit: (id: string, title: string, amount: number) => void;
  currencySymbol: string;
}

export function ExpenseIncomeList({ transactions, onDelete, onEdit, currencySymbol }: ExpenseIncomeListProps) {
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editAmount, setEditAmount] = useState("");
  
  const expenses = transactions.filter(t => t.type === "expense");
  const income = transactions.filter(t => t.type === "income");

  const handleEditClick = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setEditTitle(transaction.title);
    setEditAmount(transaction.amount.toFixed(2));
  };

  const handleSaveEdit = () => {
    if (editingTransaction && editTitle.trim() && editAmount) {
      onEdit(editingTransaction.id, editTitle, parseFloat(editAmount));
      setEditingTransaction(null);
      setEditTitle("");
      setEditAmount("");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingDown className="h-5 w-5 text-destructive" />
          <h3 className="text-lg font-semibold text-foreground">Expenses</h3>
        </div>
        <ScrollArea className="h-[300px] pr-4">
          {expenses.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No expenses added yet</p>
          ) : (
            <div className="space-y-3">
              {expenses.map((expense) => (
                <div 
                  key={expense.id}
                  className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors"
                >
                  <div>
                    <p className="font-medium text-foreground">{expense.title}</p>
                    <p className="text-sm text-destructive font-semibold">{currencySymbol}{expense.amount.toFixed(2)}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditClick(expense)}
                      className="hover:bg-primary/10 hover:text-primary"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(expense.id)}
                      className="hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-success" />
          <h3 className="text-lg font-semibold text-foreground">Income</h3>
        </div>
        <ScrollArea className="h-[300px] pr-4">
          {income.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No income added yet</p>
          ) : (
            <div className="space-y-3">
              {income.map((inc) => (
                <div 
                  key={inc.id}
                  className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors"
                >
                  <div>
                    <p className="font-medium text-foreground">{inc.title}</p>
                    <p className="text-sm text-success font-semibold">{currencySymbol}{inc.amount.toFixed(2)}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditClick(inc)}
                      className="hover:bg-primary/10 hover:text-primary"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(inc.id)}
                      className="hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </Card>

      <Dialog open={!!editingTransaction} onOpenChange={(open) => !open && setEditingTransaction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit {editingTransaction?.type === "expense" ? "Expense" : "Income"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="edit-amount">Amount ({currencySymbol})</Label>
              <Input
                id="edit-amount"
                type="number"
                value={editAmount}
                onChange={(e) => setEditAmount(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setEditingTransaction(null)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit}>
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
