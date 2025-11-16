import React, { useState } from "react";
import ActivitySearchFilter from "./activities/ActivitySearchFilter";
import ActivityTable from "./activities/ActivityTable";
import ActivityFormDialog from "./activities/ActivityFormDialog";
import DeleteActivityDialog from "./activities/DeleteActivityDialog";
import LoadingSpinner from "./common/LoadingSpinner";
import { useActivityManager, ActivityData } from "./activities/hooks/useActivityManager";

const ActivitiesManager = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isActivityFormOpen, setIsActivityFormOpen] = useState<boolean>(false);
  const [currentActivity, setCurrentActivity] = useState<ActivityData | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [activityToDelete, setActivityToDelete] = useState<string | null>(null);
  
  const {
    activities,
    isLoading,
    isSaving,
    handleDragStart,
    handleDragEnter,
    handleDragEnd,
    handleDragOver,
    handleDeleteActivity,
    handleSaveActivity
  } = useActivityManager();

  const handleEdit = (activity: ActivityData) => {
    setCurrentActivity(activity);
    setIsActivityFormOpen(true);
  };

  const handleDelete = async () => {
    if (!activityToDelete) return;
    
    const success = await handleDeleteActivity(activityToDelete);
    if (success) {
      setIsDeleteDialogOpen(false);
      setActivityToDelete(null);
    }
  };

  const handleSaveActivityForm = async (values: any) => {
    const success = await handleSaveActivity(values, currentActivity);
    if (success) {
      setIsActivityFormOpen(false);
      setCurrentActivity(null);
    }
  };

  const filteredActivities = activities.filter(activity => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      activity.name.toLowerCase().includes(query) ||
      activity.description.toLowerCase().includes(query) ||
      activity.activity_id.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-4">
      <ActivitySearchFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddActivityClick={() => {
          setCurrentActivity(null);
          setIsActivityFormOpen(true);
        }}
      />

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <ActivityTable 
          activities={filteredActivities} 
          onEdit={handleEdit} 
          onDelete={(activityId) => {
            setActivityToDelete(activityId);
            setIsDeleteDialogOpen(true);
          }}
          onDragStart={handleDragStart}
          onDragEnter={handleDragEnter}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
        />
      )}

      {isSaving && (
        <LoadingSpinner message="Saving activity order..." fullScreen />
      )}

      <ActivityFormDialog
        isOpen={isActivityFormOpen}
        onOpenChange={setIsActivityFormOpen}
        currentActivity={currentActivity}
        onSave={handleSaveActivityForm}
        onCancel={() => {
          setIsActivityFormOpen(false);
          setCurrentActivity(null);
        }}
      />

      <DeleteActivityDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default ActivitiesManager;
