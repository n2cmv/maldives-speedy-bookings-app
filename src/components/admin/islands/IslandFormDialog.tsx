
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Island } from "@/types/island";

interface IslandFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentIsland: Island | null;
  islandForm: Island;
  onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: () => Promise<void>;
  onCancel: () => void;
}

const IslandFormDialog = ({
  isOpen,
  onOpenChange,
  currentIsland,
  islandForm,
  onFormChange,
  onSubmit,
  onCancel,
}: IslandFormDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {currentIsland ? "Edit Island" : "Add New Island"}
          </DialogTitle>
          <DialogDescription>
            {currentIsland
              ? "Update island details"
              : "Enter island information"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Island Name
            </label>
            <Input
              id="name"
              name="name"
              value={islandForm.name}
              onChange={onFormChange}
              placeholder="Island name"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="description"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              value={islandForm.description}
              onChange={onFormChange}
              placeholder="Describe the island"
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="image_url"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Image URL
            </label>
            <Input
              id="image_url"
              name="image_url"
              value={islandForm.image_url || ""}
              onChange={onFormChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default IslandFormDialog;
