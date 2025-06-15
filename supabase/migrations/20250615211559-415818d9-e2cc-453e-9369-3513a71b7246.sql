
-- Create a table for user wants/wishlist
CREATE TABLE public.user_wants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  product_name TEXT NOT NULL,
  product_url TEXT NOT NULL,
  product_image_url TEXT,
  category TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to ensure users can only see their own wants
ALTER TABLE public.user_wants ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to SELECT their own wants
CREATE POLICY "Users can view their own wants" 
  ON public.user_wants 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to INSERT their own wants
CREATE POLICY "Users can create their own wants" 
  ON public.user_wants 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to UPDATE their own wants
CREATE POLICY "Users can update their own wants" 
  ON public.user_wants 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy that allows users to DELETE their own wants
CREATE POLICY "Users can delete their own wants" 
  ON public.user_wants 
  FOR DELETE 
  USING (auth.uid() = user_id);
