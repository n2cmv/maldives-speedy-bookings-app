
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import IslandPageTemplate from '@/components/islands/IslandPageTemplate';
import { IslandDetails } from '@/types/island';
import { useToast } from "@/hooks/use-toast";

const IslandDetailsPage = () => {
  const { slug } = useParams();
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
          setIslandData({
            name: data.name,
            tagline: data.tagline || "",
            slug: data.slug || "",
            fullDescription: data.full_description || "",
            heroImage: data.hero_image || "",
            galleryImages: data.gallery_images || [],
            location: data.location || { atoll: "Unknown" },
            travelInfo: data.travel_info || {
              fromMale: "Contact for details",
              bestWayToReach: "Contact for details"
            },
            activities: data.activities || [],
            accommodation: data.accommodation || [],
            dining: data.dining || [],
            weather: data.weather || {
              bestTime: "Year-round",
              temperature: "25°C - 31°C",
              rainfall: "Varies by season"
            },
            essentialInfo: data.essential_info || [],
            quickFacts: data.quick_facts || [],
            faqs: data.faqs || []
          });
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
  }, [slug]);

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
