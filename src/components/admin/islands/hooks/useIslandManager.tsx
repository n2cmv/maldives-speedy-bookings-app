
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Island, mapDatabaseIslandToIslandType } from "@/types/island";

export const useIslandManager = () => {
  const [islands, setIslands] = useState<Island[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchIslands = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("islands")
        .select("*")
        .order("name");

      if (error) {
        throw error;
      }

      if (data) {
        // Map database islands to our Island type
        const mappedIslands = data.map(dbIsland => mapDatabaseIslandToIslandType(dbIsland));
        setIslands(mappedIslands);
      }
    } catch (error) {
      console.error("Error fetching islands:", error);
      toast({
        title: "Error",
        description: "Failed to fetch islands",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (islandId: string) => {
    try {
      const { error } = await supabase
        .from("islands")
        .delete()
        .eq("id", islandId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Island has been deleted",
      });

      await fetchIslands();
      return true;
    } catch (error) {
      console.error("Error deleting island:", error);
      toast({
        title: "Error",
        description: "Failed to delete island",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleSubmit = async (islandData: Partial<Island>, currentIslandId?: string) => {
    try {
      // Include all new fields in the submission
      const submissionData = {
        name: islandData.name,
        description: islandData.description,
        image_url: islandData.image_url,
        tagline: islandData.tagline,
        slug: islandData.slug,
        full_description: islandData.fullDescription,
        hero_image: islandData.heroImage,
        gallery_images: islandData.galleryImages,
        activities: islandData.activities,
        accommodation: islandData.accommodation,
        dining: islandData.dining,
        location: islandData.location,
        travel_info: islandData.travelInfo,
        weather: islandData.weather,
        essential_info: islandData.essentialInfo,
        quick_facts: islandData.quickFacts,
        faqs: islandData.faqs
      };
  
      if (currentIslandId) {
        const { error } = await supabase
          .from("islands")
          .update(submissionData)
          .eq("id", currentIslandId);
  
        if (error) throw error;
  
        toast({
          title: "Success",
          description: "Island has been updated",
        });
      } else {
        const { error } = await supabase
          .from("islands")
          .insert(submissionData);
  
        if (error) throw error;
  
        toast({
          title: "Success",
          description: "Island has been created",
        });
      }
  
      await fetchIslands();
      return true;
    } catch (error) {
      console.error("Error saving island:", error);
      toast({
        title: "Error",
        description: typeof error === 'object' && error !== null && 'message' in error 
          ? String(error.message) 
          : "Failed to save island",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchIslands();
  }, []);

  return {
    islands,
    isLoading,
    fetchIslands,
    handleDelete,
    handleSubmit,
  };
};
