
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import IslandPageTemplate from '@/components/islands/IslandPageTemplate';
import { IslandDetails } from '@/types/island';
import { useToast } from "@/hooks/use-toast";

const IslandDetailsPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const [islandData, setIslandData] = useState<IslandDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIslandDetails = async () => {
      try {
        const { data, error } = await supabase
          .from('islands')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) throw error;

        if (data) {
          // Map the database fields to our IslandDetails type
          const mappedData: IslandDetails = {
            name: data.name,
            tagline: data.tagline || "",
            slug: data.slug || slug || "",
            fullDescription: data.full_description || data.description || "",
            heroImage: data.hero_image || data.image_url || "",
            galleryImages: Array.isArray(data.gallery_images) ? data.gallery_images : [],
            location: {
              atoll: typeof data.location === 'object' && data.location !== null && !Array.isArray(data.location) && 'atoll' in data.location 
                ? String(data.location.atoll) 
                : "Maldives"
            },
            travelInfo: {
              fromMale: typeof data.travel_info === 'object' && data.travel_info !== null && !Array.isArray(data.travel_info) && 'fromMale' in data.travel_info
                ? String(data.travel_info.fromMale)
                : "Contact for details",
              bestWayToReach: typeof data.travel_info === 'object' && data.travel_info !== null && !Array.isArray(data.travel_info) && 'bestWayToReach' in data.travel_info
                ? String(data.travel_info.bestWayToReach)
                : "Speedboat transfer"
            },
            activities: Array.isArray(data.activities) ? data.activities.map((act: any) => ({
              name: act.name || "",
              description: act.description || "",
              image: act.image || ""
            })) : [],
            accommodation: Array.isArray(data.accommodation) ? data.accommodation.map((acc: any) => ({
              type: acc.type || "",
              description: acc.description || "",
              priceRange: acc.priceRange || ""
            })) : [],
            dining: Array.isArray(data.dining) ? data.dining.map((din: any) => ({
              type: din.type || "",
              description: din.description || ""
            })) : [],
            weather: typeof data.weather === 'object' && data.weather !== null && !Array.isArray(data.weather) ? {
              bestTime: 'bestTime' in data.weather ? String(data.weather.bestTime) : "Year-round",
              temperature: 'temperature' in data.weather ? String(data.weather.temperature) : "25°C - 31°C",
              rainfall: 'rainfall' in data.weather ? String(data.weather.rainfall) : "Varies by season"
            } : {
              bestTime: "Year-round",
              temperature: "25°C - 31°C",
              rainfall: "Varies by season"
            },
            essentialInfo: Array.isArray(data.essential_info) ? data.essential_info.map((info: any) => ({
              title: info.title || "",
              description: info.description || "",
              icon: info.icon || ""
            })) : [],
            quickFacts: Array.isArray(data.quick_facts) ? data.quick_facts.map((fact: any) => ({
              label: fact.label || "",
              value: fact.value || "",
              icon: fact.icon || "info"
            })) : [],
            faqs: Array.isArray(data.faqs) ? data.faqs.map((faq: any) => ({
              question: faq.question || "",
              answer: faq.answer || ""
            })) : []
          };
          
          setIslandData(mappedData);
        }
      } catch (error) {
        console.error('Error fetching island details:', error);
        toast({
          title: "Error",
          description: "Failed to load island details",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchIslandDetails();
    }
  }, [slug, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-12 w-12 border-4 border-t-ocean border-opacity-50 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!islandData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Island Not Found</h1>
          <p className="text-gray-600">The island you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return <IslandPageTemplate islandData={islandData} />;
};

export default IslandDetailsPage;
