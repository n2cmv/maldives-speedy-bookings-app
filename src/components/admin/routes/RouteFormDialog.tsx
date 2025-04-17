
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import RouteForm, { Route, RouteFormValues } from "./RouteForm";

interface RouteFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentRoute: Route | null;
  onSave: (values: RouteFormValues) => Promise<void>;
  onCancel: () => void;
}

const RouteFormDialog = ({
  isOpen,
  onOpenChange,
  currentRoute,
  onSave,
  onCancel
}: RouteFormDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {currentRoute ? "Edit Route" : "Add New Route"}
          </DialogTitle>
          <DialogDescription>
            {currentRoute
              ? "Update route details"
              : "Enter new route information"}
          </DialogDescription>
        </DialogHeader>
        
        <RouteForm 
          route={currentRoute} 
          onSave={onSave}
          onCancel={onCancel}
        />
      </DialogContent>
    </Dialog>
  );
};

export default RouteFormDialog;
