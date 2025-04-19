
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import IslandPageTemplate from '@/components/islands/IslandPageTemplate';
import { IslandDetails, mapDatabaseIslandToIslandType } from '@/types/island';
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
          // Use the mapping function to properly convert database data to Island type
          const mappedData = mapDatabaseIslandToIslandType(data);
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
