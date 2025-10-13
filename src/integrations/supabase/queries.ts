import { supabase } from "./client";

export interface MonthlyBudget {
  id: string;
  user_id: string;
  month: number;
  year: number;
  budget_amount: number;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  monthly_budget_id: string;
  title: string;
  amount: number;
  type: "expense" | "income";
  created_at: string;
  updated_at: string;
}

export const budgetQueries = {
  // Get or create monthly budget
  async getOrCreateMonthlyBudget(month: number, year: number): Promise<MonthlyBudget> {
    const { data: existing, error: fetchError } = await supabase
      .from("monthly_budgets")
      .select("*")
      .eq("month", month)
      .eq("year", year)
      .maybeSingle();

    if (fetchError) throw fetchError;

    if (existing) {
      return existing;
    }

    // Create new budget if doesn't exist
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("User not authenticated");

    const { data: newBudget, error: createError } = await supabase
      .from("monthly_budgets")
      .insert({
        user_id: user.user.id,
        month,
        year,
        budget_amount: 0,
      })
      .select()
      .single();

    if (createError) throw createError;
    return newBudget;
  },

  // Update budget amount
  async updateBudgetAmount(budgetId: string, amount: number): Promise<void> {
    const { error } = await supabase
      .from("monthly_budgets")
      .update({ budget_amount: amount })
      .eq("id", budgetId);

    if (error) throw error;
  },

  // Get transactions for a budget
  async getTransactions(budgetId: string): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("monthly_budget_id", budgetId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data || []) as Transaction[];
  },

  // Add transaction
  async addTransaction(
    budgetId: string,
    title: string,
    amount: number,
    type: "expense" | "income"
  ): Promise<Transaction> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("transactions")
      .insert({
        user_id: user.user.id,
        monthly_budget_id: budgetId,
        title,
        amount,
        type,
      })
      .select()
      .single();

    if (error) throw error;
    return data as Transaction;
  },

  // Update transaction
  async updateTransaction(
    id: string,
    title: string,
    amount: number
  ): Promise<void> {
    const { error } = await supabase
      .from("transactions")
      .update({ title, amount })
      .eq("id", id);

    if (error) throw error;
  },

  // Delete transaction
  async deleteTransaction(id: string): Promise<void> {
    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },

  // Get cumulative data (all budgets and transactions)
  async getCumulativeData(): Promise<{
    totalBudget: number;
    totalExpenses: number;
    totalIncome: number;
  }> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("User not authenticated");

    // Get all budgets
    const { data: budgets, error: budgetError } = await supabase
      .from("monthly_budgets")
      .select("budget_amount")
      .eq("user_id", user.user.id);

    if (budgetError) throw budgetError;

    // Get all transactions
    const { data: transactions, error: transError } = await supabase
      .from("transactions")
      .select("amount, type")
      .eq("user_id", user.user.id);

    if (transError) throw transError;

    const totalBudget = budgets?.reduce((sum, b) => sum + Number(b.budget_amount), 0) || 0;
    const totalExpenses =
      transactions
        ?.filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + Number(t.amount), 0) || 0;
    const totalIncome =
      transactions
        ?.filter((t) => t.type === "income")
        .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

    return { totalBudget, totalExpenses, totalIncome };
  },
};
