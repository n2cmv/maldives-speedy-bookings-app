
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import IslandPageTemplate from '@/components/islands/IslandPageTemplate';
import { IslandDetails, mapDatabaseIslandToIslandType } from '@/types/island';
import { useToast } from "@/hooks/use-toast";

const IslandDetailsPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [islandData, setIslandData] = useState<IslandDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIslandDetails = async () => {
      if (!slug) return;
      
      try {
        // First try with exact slug
        let { data, error } = await supabase
          .from('islands')
          .select('*')
          .eq('slug', slug)
          .maybeSingle();

        // If not found, try with slug conversion (handle cases like "a.dh-dhigurah" -> "dhigurah")
        if (!data && error?.code === 'PGRST116') {
          // Extract simplified slug - e.g., "dhigurah" from "a.dh-dhigurah"
          const simplifiedSlug = slug.toLowerCase().split('-').pop();
          
          if (simplifiedSlug) {
            const { data: dataBySimpleSlug, error: errorBySimpleSlug } = await supabase
              .from('islands')
              .select('*')
              .ilike('slug', `%${simplifiedSlug}%`)
              .maybeSingle();
              
            if (dataBySimpleSlug) {
              data = dataBySimpleSlug;
              error = null;
            }
          }
        }

        if (data) {
          // Use the mapping function to properly convert database data to Island type
          const mappedData = mapDatabaseIslandToIslandType(data);
          setIslandData(mappedData);
        } else {
          console.error('Island not found:', slug);
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
          <p className="text-gray-600 mb-6">The island you're looking for doesn't exist or has been moved.</p>
          <button
            onClick={() => navigate('/islands')}
            className="bg-ocean hover:bg-ocean-dark text-white px-4 py-2 rounded-md transition-colors"
          >
            View All Islands
          </button>
        </div>
      </div>
    );
  }

  // Ensure all required nested objects exist to prevent errors
  const safeIslandData: IslandDetails = {
    ...islandData,
    location: islandData.location || { atoll: 'Unknown' },
    travelInfo: islandData.travelInfo || { fromMale: '', bestWayToReach: '' },
    weather: islandData.weather || { bestTime: '', temperature: '', rainfall: '' },
    activities: islandData.activities || [],
    accommodation: islandData.accommodation || [],
    dining: islandData.dining || [],
    essentialInfo: islandData.essentialInfo || [],
    quickFacts: islandData.quickFacts || [],
    galleryImages: islandData.galleryImages || [],
    faqs: islandData.faqs || []
  };

  return <IslandPageTemplate islandData={safeIslandData} />;
};

export default IslandDetailsPage;
