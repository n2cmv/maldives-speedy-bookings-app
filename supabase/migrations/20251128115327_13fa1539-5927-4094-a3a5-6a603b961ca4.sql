-- Create tour_packages table
CREATE TABLE public.tour_packages (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price_per_person NUMERIC NOT NULL,
    duration TEXT NOT NULL,
    min_pax INTEGER DEFAULT 1,
    inclusions TEXT[] DEFAULT '{}',
    rules TEXT[] DEFAULT '{}',
    image_url TEXT,
    gallery_images TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tour_packages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view active packages
CREATE POLICY "Anyone can view active packages"
ON public.tour_packages
FOR SELECT
USING (is_active = true);

-- Allow admin users to manage packages
CREATE POLICY "Admin users can manage packages"
ON public.tour_packages
FOR ALL
USING (EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.user_id = auth.uid()
));

-- Create trigger for updated_at
CREATE TRIGGER update_tour_packages_updated_at
BEFORE UPDATE ON public.tour_packages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();