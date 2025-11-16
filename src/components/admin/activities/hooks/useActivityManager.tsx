import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ActivityData {
  id: string;
  activity_id: string;
  name: string;
  price: number;
  description: string;
  icon: string | null;
  is_active: boolean;
  display_order: number | null;
  created_at: string;
  updated_at: string;
}

export const useActivityManager = () => {
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchActivities();

    // Set up real-time subscription
    const channel = supabase
      .channel('activities-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'activities'
        },
        () => {
          fetchActivities();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchActivities = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('display_order', { ascending: true, nullsFirst: false });

      if (error) throw error;
      setActivities(data || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
      toast.error('Failed to load activities');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedItemIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnter = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItemIndex === null || draggedItemIndex === index) return;

    const newActivities = [...activities];
    const draggedItem = newActivities[draggedItemIndex];
    newActivities.splice(draggedItemIndex, 1);
    newActivities.splice(index, 0, draggedItem);

    setActivities(newActivities);
    setDraggedItemIndex(index);
  };

  const handleDragEnd = async () => {
    if (draggedItemIndex === null) return;

    try {
      setIsSaving(true);
      
      // Update each activity's display_order individually
      const updatePromises = activities.map((activity, index) =>
        supabase
          .from('activities')
          .update({ display_order: index + 1 })
          .eq('id', activity.id)
      );

      const results = await Promise.all(updatePromises);
      const errors = results.filter(r => r.error);
      
      if (errors.length > 0) {
        throw new Error('Failed to update some activities');
      }

      toast.success('Activity order updated successfully');
      await fetchActivities();
    } catch (error) {
      console.error('Error updating activity order:', error);
      toast.error('Failed to update activity order');
      await fetchActivities();
    } finally {
      setDraggedItemIndex(null);
      setIsSaving(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDeleteActivity = async (activityId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('activities')
        .delete()
        .eq('id', activityId);

      if (error) throw error;

      toast.success('Activity deleted successfully');
      await fetchActivities();
      return true;
    } catch (error) {
      console.error('Error deleting activity:', error);
      toast.error('Failed to delete activity');
      return false;
    }
  };

  const handleSaveActivity = async (
    values: Partial<ActivityData>,
    currentActivity: ActivityData | null
  ): Promise<boolean> => {
    try {
      if (currentActivity) {
        const { error } = await supabase
          .from('activities')
          .update({
            activity_id: values.activity_id,
            name: values.name,
            price: values.price,
            description: values.description,
            icon: values.icon,
            is_active: values.is_active,
          })
          .eq('id', currentActivity.id);

        if (error) throw error;
        toast.success('Activity updated successfully');
      } else {
        const maxOrder = activities.length > 0
          ? Math.max(...activities.map(a => a.display_order || 0))
          : 0;

        const { error } = await supabase
          .from('activities')
          .insert({
            activity_id: values.activity_id,
            name: values.name,
            price: values.price,
            description: values.description,
            icon: values.icon,
            is_active: values.is_active !== undefined ? values.is_active : true,
            display_order: maxOrder + 1
          });

        if (error) throw error;
        toast.success('Activity created successfully');
      }

      await fetchActivities();
      return true;
    } catch (error) {
      console.error('Error saving activity:', error);
      toast.error('Failed to save activity');
      return false;
    }
  };

  return {
    activities,
    isLoading,
    isSaving,
    handleDragStart,
    handleDragEnter,
    handleDragEnd,
    handleDragOver,
    handleDeleteActivity,
    handleSaveActivity
  };
};
