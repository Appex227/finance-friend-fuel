import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { budgetQueries } from "@/integrations/supabase/queries";
import { toast } from "sonner";

export const useBudgetData = (month: number, year: number) => {
  const queryClient = useQueryClient();

  // Get or create monthly budget
  const { data: budget, isLoading: budgetLoading } = useQuery({
    queryKey: ["monthly-budget", month, year],
    queryFn: () => budgetQueries.getOrCreateMonthlyBudget(month, year),
  });

  // Get transactions for this budget
  const { data: transactions = [], isLoading: transactionsLoading } = useQuery({
    queryKey: ["transactions", budget?.id],
    queryFn: () => budgetQueries.getTransactions(budget!.id),
    enabled: !!budget?.id,
  });

  // Get cumulative data
  const { data: cumulativeData } = useQuery({
    queryKey: ["cumulative-data"],
    queryFn: () => budgetQueries.getCumulativeData(),
  });

  // Update budget amount
  const updateBudgetMutation = useMutation({
    mutationFn: (amount: number) =>
      budgetQueries.updateBudgetAmount(budget!.id, amount),
    onMutate: async (amount: number) => {
      await queryClient.cancelQueries({ queryKey: ["monthly-budget", month, year] });
      const previous = queryClient.getQueryData(["monthly-budget", month, year]);
      // Optimistically update cache
      queryClient.setQueryData(["monthly-budget", month, year], (old: any) => ({
        ...(old || {}),
        id: old?.id ?? budget?.id,
        budget_amount: amount,
      }));
      return { previous };
    },
    onError: (_error, _amount, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["monthly-budget", month, year], context.previous);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["monthly-budget", month, year] });
      queryClient.invalidateQueries({ queryKey: ["cumulative-data"] });
      toast.success("Budget updated successfully");
    },
  });

  // Add transaction
  const addTransactionMutation = useMutation({
    mutationFn: ({
      title,
      amount,
      type,
    }: {
      title: string;
      amount: number;
      type: "expense" | "income";
    }) => budgetQueries.addTransaction(budget!.id, title, amount, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions", budget?.id] });
      queryClient.invalidateQueries({ queryKey: ["cumulative-data"] });
      toast.success("Transaction added successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to add transaction");
    },
  });

  // Update transaction
  const updateTransactionMutation = useMutation({
    mutationFn: ({
      id,
      title,
      amount,
    }: {
      id: string;
      title: string;
      amount: number;
    }) => budgetQueries.updateTransaction(id, title, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions", budget?.id] });
      queryClient.invalidateQueries({ queryKey: ["cumulative-data"] });
      toast.success("Transaction updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update transaction");
    },
  });

  // Delete transaction
  const deleteTransactionMutation = useMutation({
    mutationFn: (id: string) => budgetQueries.deleteTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions", budget?.id] });
      queryClient.invalidateQueries({ queryKey: ["cumulative-data"] });
      toast.success("Transaction deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete transaction");
    },
  });

  return {
    budget,
    transactions,
    cumulativeData,
    isLoading: budgetLoading || transactionsLoading,
    updateBudget: updateBudgetMutation.mutate,
    addTransaction: addTransactionMutation.mutate,
    updateTransaction: updateTransactionMutation.mutate,
    deleteTransaction: deleteTransactionMutation.mutate,
  };
};
