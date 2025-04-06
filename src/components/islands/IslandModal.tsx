
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import IslandDetails from "./IslandDetails";

interface IslandModalProps {
  islandName: string | '';
  isOpen: boolean;
  onClose: () => void;
}

const IslandModal = ({ islandName, isOpen, onClose }: IslandModalProps) => {
  if (!islandName) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-ocean-dark">Island Information</DialogTitle>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" className="absolute right-4 top-4">
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>
        </DialogHeader>
        <div className="mt-2">
          <IslandDetails islandName={islandName} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IslandModal;
