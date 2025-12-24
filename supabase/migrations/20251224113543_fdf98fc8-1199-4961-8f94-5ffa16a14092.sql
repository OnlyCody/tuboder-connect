-- Kategoriler tablosu
CREATE TABLE public.business_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name_tr TEXT NOT NULL,
  name_en TEXT NOT NULL,
  name_bs TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- İşyerleri tablosu
CREATE TABLE public.member_businesses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES public.business_categories(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS aktif et
ALTER TABLE public.business_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_businesses ENABLE ROW LEVEL SECURITY;

-- Kategoriler için RLS
CREATE POLICY "Anyone can view active categories"
ON public.business_categories
FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage categories"
ON public.business_categories
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- İşyerleri için RLS
CREATE POLICY "Anyone can view active businesses"
ON public.member_businesses
FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage businesses"
ON public.member_businesses
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Updated_at trigger
CREATE TRIGGER update_business_categories_updated_at
BEFORE UPDATE ON public.business_categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_member_businesses_updated_at
BEFORE UPDATE ON public.member_businesses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();