-- Create activities table
CREATE TABLE public.activities (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  activity_id text NOT NULL UNIQUE,
  name text NOT NULL,
  price numeric NOT NULL,
  description text NOT NULL,
  icon text,
  is_active boolean DEFAULT true,
  display_order integer,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- Allow anyone to select activities
CREATE POLICY "Anyone can select activities"
ON public.activities
FOR SELECT
USING (is_active = true);

-- Allow admin users to modify activities
CREATE POLICY "Admin users can modify activities"
ON public.activities
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.user_id = auth.uid()
  )
);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_activities_updated_at
BEFORE UPDATE ON public.activities
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial activities data
INSERT INTO public.activities (activity_id, name, price, description, icon, display_order) VALUES
  ('manta', 'Manta', 70, 'Swim with magnificent manta rays in their natural habitat.', 'anchor', 1),
  ('whaleshark', 'Whaleshark', 80, 'Experience the thrill of swimming alongside the gentle giants of the ocean.', 'sailboat', 2),
  ('turtle', 'Turtle', 50, 'Explore turtle habitats and swim with these amazing creatures.', 'turtle', 3),
  ('sandbank_trip', 'Sand Bank Trip', 120, 'Visit a secluded sandbank near Machafushi resort for a private beach experience.', 'umbrella', 4),
  ('resort_day_trip', 'Resort Day Trip', 75, 'Spend a relaxing day at one of the luxury resorts in the Maldives.', 'building', 5),
  ('resort_transfer', 'Resort Transfer', 45, 'Comfortable speedboat transfer to your chosen resort. Price per way.', 'sailboat', 6),
  ('sunset_fishing', 'Sunset Fishing', 55, 'Traditional line fishing experience while enjoying a breathtaking Maldivian sunset.', 'sunset', 7),
  ('nurse_shark', 'Nurse Shark Trip', 80, 'See nurse sharks up close in their natural environment.', 'anchor', 8);