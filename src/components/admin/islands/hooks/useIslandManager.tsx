
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Island } from "@/types/island";

export const useIslandManager = () => {
  const { toast } = useToast();
  const [islands, setIslands] = useState<Island[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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

      setIslands(data || []);
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

      if (error) {
        throw error;
      }

      setIslands(islands.filter((island) => island.id !== islandId));
      toast({
        title: "Success",
        description: "Island has been deleted",
      });
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
      if (currentIslandId) {
        // Update existing island
        const { error } = await supabase
          .from("islands")
          .update(islandData)
          .eq("id", currentIslandId);

        if (error) {
          throw error;
        }

        toast({
          title: "Success",
          description: "Island has been updated",
        });
      } else {
        // Create new island
        const { error } = await supabase
          .from("islands")
          .insert(islandData);

        if (error) {
          throw error;
        }

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
        description: "Failed to save island",
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
    handleDelete,
    handleSubmit,
    fetchIslands
  };
};
