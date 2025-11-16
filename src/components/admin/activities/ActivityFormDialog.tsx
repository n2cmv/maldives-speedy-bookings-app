import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ActivityForm from "./ActivityForm";
import { ActivityData } from "./hooks/useActivityManager";

interface ActivityFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentActivity: ActivityData | null;
  onSave: (values: any) => Promise<void>;
  onCancel: () => void;
}

const ActivityFormDialog = ({
  isOpen,
  onOpenChange,
  currentActivity,
  onSave,
  onCancel
}: ActivityFormDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {currentActivity ? "Edit Activity" : "Add New Activity"}
          </DialogTitle>
          <DialogDescription>
            {currentActivity
              ? "Update activity details"
              : "Enter new activity information"}
          </DialogDescription>
        </DialogHeader>
        
        <ActivityForm 
          activity={currentActivity} 
          onSave={onSave}
          onCancel={onCancel}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ActivityFormDialog;
