-- Add is_instagram_only column to events table
ALTER TABLE public.events 
ADD COLUMN is_instagram_only boolean DEFAULT false;