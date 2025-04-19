
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
      if (!slug) {
        setLoading(false);
        return;
      }
      
      try {
        // First try with exact slug
        let { data, error } = await supabase
          .from('islands')
          .select('*')
          .eq('slug', slug)
          .maybeSingle();

        // If not found, try with lowercase slug
        if (!data) {
          const { data: dataByLowerSlug, error: errorByLowerSlug } = await supabase
            .from('islands')
            .select('*')
            .eq('slug', slug.toLowerCase())
            .maybeSingle();
            
          if (dataByLowerSlug) {
            data = dataByLowerSlug;
            error = null;
          }
        }
        
        // If still not found, try with a partial match
        if (!data) {
          // Extract simplified slug - e.g., "dhigurah" from "a.dh-dhigurah"
          const simplifiedSlug = slug.toLowerCase().split(/[-_.]/)[slug.toLowerCase().split(/[-_.]/).length - 1]; // Split by common separators
          
          if (simplifiedSlug && simplifiedSlug.length > 3) {
            const { data: dataByPartialSlug } = await supabase
              .from('islands')
              .select('*')
              .ilike('slug', `%${simplifiedSlug}%`);
              
            if (dataByPartialSlug && dataByPartialSlug.length > 0) {
              data = dataByPartialSlug[0];
              error = null;
            }
          }
        }
        
        // Last resort, just fetch any island if nothing found and we're using a placeholder slug
        if (!data && (slug === ':slug' || slug === 'undefined')) {
          const { data: anyIsland } = await supabase
            .from('islands')
            .select('*')
            .limit(1);
            
          if (anyIsland && anyIsland.length > 0) {
            data = anyIsland[0];
          }
        }

        if (data) {
          // Use the mapping function to properly convert database data to Island type
          const mappedData = mapDatabaseIslandToIslandType(data);
          setIslandData(mappedData);
          console.log('Island found and mapped:', mappedData.name);
        } else {
          console.error('Island not found for slug:', slug);
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

    fetchIslandDetails();
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
