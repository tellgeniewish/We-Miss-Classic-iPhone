
-- Create votes table for tracking fingerprint-based votes
CREATE TABLE public.votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  fingerprint TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- Anyone can read the vote count
CREATE POLICY "Anyone can read vote count"
  ON public.votes FOR SELECT
  USING (true);

-- Anyone can insert a vote (fingerprint uniqueness prevents duplicates)
CREATE POLICY "Anyone can insert a vote"
  ON public.votes FOR INSERT
  WITH CHECK (true);
