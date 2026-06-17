-- Add the senha_bolao column to the public.users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS senha_bolao TEXT;
