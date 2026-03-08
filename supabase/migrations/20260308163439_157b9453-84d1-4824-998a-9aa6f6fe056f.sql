-- Create profiles table
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'email');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Add user_id column to votes
ALTER TABLE public.votes ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add unique constraint on user_id
CREATE UNIQUE INDEX votes_user_id_unique ON public.votes (user_id) WHERE user_id IS NOT NULL;

-- Update RLS: only authenticated users can insert votes
DROP POLICY "Anyone can insert a vote" ON public.votes;
CREATE POLICY "Authenticated users can insert a vote"
  ON public.votes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own vote
CREATE POLICY "Users can delete own vote"
  ON public.votes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);