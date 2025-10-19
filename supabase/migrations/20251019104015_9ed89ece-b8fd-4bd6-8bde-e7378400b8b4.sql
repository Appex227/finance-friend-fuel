-- Add server-side validation constraints to enforce data integrity

-- Validate transaction amounts: must be positive and within reasonable bounds
ALTER TABLE transactions
ADD CONSTRAINT valid_amount CHECK (amount > 0 AND amount <= 999999999);

-- Validate transaction titles: must be between 1 and 200 characters
ALTER TABLE transactions
ADD CONSTRAINT valid_title_length CHECK (char_length(title) BETWEEN 1 AND 200);

-- Validate monthly budget amounts: must be non-negative and within reasonable bounds
ALTER TABLE monthly_budgets
ADD CONSTRAINT valid_budget CHECK (budget_amount >= 0 AND budget_amount <= 999999999);

-- Validate profile names: if provided, must not exceed 100 characters
ALTER TABLE profiles
ADD CONSTRAINT valid_name_length CHECK (full_name IS NULL OR char_length(full_name) <= 100);