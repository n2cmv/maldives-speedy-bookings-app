import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PackageForm from "./PackageForm";
import { PackageData } from "./hooks/usePackageManager";

interface PackageFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentPackage: PackageData | null;
  onSave: (values: any) => Promise<void>;
  onCancel: () => void;
}

const PackageFormDialog = ({
  isOpen,
  onOpenChange,
  currentPackage,
  onSave,
  onCancel,
}: PackageFormDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {currentPackage ? "Edit Package" : "Add New Package"}
          </DialogTitle>
          <DialogDescription>
            {currentPackage
              ? "Update package details"
              : "Create a new tour package"}
          </DialogDescription>
        </DialogHeader>

        <PackageForm
          package={currentPackage}
          onSave={onSave}
          onCancel={onCancel}
        />
      </DialogContent>
    </Dialog>
  );
};

export default PackageFormDialog;
