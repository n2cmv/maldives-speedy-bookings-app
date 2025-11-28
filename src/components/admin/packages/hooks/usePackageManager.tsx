import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface PackageData {
  id: string;
  name: string;
  description: string | null;
  price_per_person: number;
  duration: string;
  min_pax: number;
  inclusions: string[];
  rules: string[];
  image_url: string | null;
  gallery_images: string[];
  is_active: boolean;
  display_order: number | null;
}

export const usePackageManager = () => {
  const [packages, setPackages] = useState<PackageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  useEffect(() => {
    fetchPackages();

    const channel = supabase
      .channel("tour_packages_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tour_packages" },
        () => {
          fetchPackages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchPackages = async () => {
    try {
      const { data, error } = await supabase
        .from("tour_packages")
        .select("*")
        .order("display_order", { ascending: true, nullsFirst: false });

      if (error) throw error;
      setPackages(data || []);
    } catch (error) {
      console.error("Error fetching packages:", error);
      toast.error("Failed to fetch packages");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragStart = (index: number) => {
    dragItem.current = index;
  };

  const handleDragEnter = (index: number) => {
    dragOverItem.current = index;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragEnd = async () => {
    if (dragItem.current === null || dragOverItem.current === null) return;

    const newPackages = [...packages];
    const draggedItem = newPackages[dragItem.current];
    newPackages.splice(dragItem.current, 1);
    newPackages.splice(dragOverItem.current, 0, draggedItem);

    const updatedPackages = newPackages.map((pkg, index) => ({
      ...pkg,
      display_order: index + 1,
    }));

    setPackages(updatedPackages);

    try {
      for (const pkg of updatedPackages) {
        await supabase
          .from("tour_packages")
          .update({ display_order: pkg.display_order })
          .eq("id", pkg.id);
      }
      toast.success("Package order updated");
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order");
      fetchPackages();
    }

    dragItem.current = null;
    dragOverItem.current = null;
  };

  const handleDeletePackage = async (packageId: string) => {
    try {
      const { error } = await supabase
        .from("tour_packages")
        .delete()
        .eq("id", packageId);

      if (error) throw error;
      toast.success("Package deleted successfully");
    } catch (error) {
      console.error("Error deleting package:", error);
      toast.error("Failed to delete package");
    }
  };

  const handleSavePackage = async (values: any, existingId?: string) => {
    setIsSaving(true);
    try {
      const packageData = {
        name: values.name,
        description: values.description || null,
        price_per_person: parseFloat(values.price_per_person),
        duration: values.duration,
        min_pax: parseInt(values.min_pax) || 1,
        inclusions: values.inclusions || [],
        rules: values.rules || [],
        image_url: values.image_url || null,
        gallery_images: values.gallery_images || [],
        is_active: values.is_active ?? true,
      };

      if (existingId) {
        const { error } = await supabase
          .from("tour_packages")
          .update(packageData)
          .eq("id", existingId);

        if (error) throw error;
        toast.success("Package updated successfully");
      } else {
        const maxOrder = Math.max(...packages.map((p) => p.display_order || 0), 0);
        const { error } = await supabase
          .from("tour_packages")
          .insert({ ...packageData, display_order: maxOrder + 1 });

        if (error) throw error;
        toast.success("Package created successfully");
      }
    } catch (error) {
      console.error("Error saving package:", error);
      toast.error("Failed to save package");
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    packages,
    isLoading,
    isSaving,
    handleSavePackage,
    handleDeletePackage,
    handleDragStart,
    handleDragEnter,
    handleDragEnd,
    handleDragOver,
  };
};
