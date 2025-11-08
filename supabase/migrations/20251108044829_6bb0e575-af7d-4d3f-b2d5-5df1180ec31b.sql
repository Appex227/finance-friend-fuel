-- Increase precision to prevent currency conversion drift
BEGIN;

-- budgets: store up to 6 fractional digits
ALTER TABLE public.monthly_budgets
  ALTER COLUMN budget_amount TYPE NUMERIC(18,6) USING budget_amount::numeric(18,6),
  ALTER COLUMN budget_amount SET DEFAULT 0;

-- transactions: match precision for consistency
ALTER TABLE public.transactions
  ALTER COLUMN amount TYPE NUMERIC(18,6) USING amount::numeric(18,6);

COMMIT;