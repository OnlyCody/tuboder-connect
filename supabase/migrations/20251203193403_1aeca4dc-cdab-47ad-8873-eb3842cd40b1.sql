-- Create bosnia_images table for Bosnia Herzegovina promotion images
CREATE TABLE public.bosnia_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title_tr TEXT NOT NULL,
  title_en TEXT NOT NULL,
  title_bs TEXT NOT NULL,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.bosnia_images ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view active bosnia images" 
ON public.bosnia_images 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage bosnia images" 
ON public.bosnia_images 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_bosnia_images_updated_at
BEFORE UPDATE ON public.bosnia_images
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();