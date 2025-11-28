import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchBar from "./common/SearchBar";
import LoadingSpinner from "./common/LoadingSpinner";
import PackageTable from "./packages/PackageTable";
import PackageFormDialog from "./packages/PackageFormDialog";
import DeletePackageDialog from "./packages/DeletePackageDialog";
import { usePackageManager, PackageData } from "./packages/hooks/usePackageManager";

const TourPackagesManager = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentPackage, setCurrentPackage] = useState<PackageData | null>(null);
  const [packageToDelete, setPackageToDelete] = useState<string | null>(null);

  const {
    packages,
    isLoading,
    isSaving,
    handleSavePackage,
    handleDeletePackage,
    handleDragStart,
    handleDragEnter,
    handleDragEnd,
    handleDragOver,
  } = usePackageManager();

  const filteredPackages = packages.filter((pkg) =>
    pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pkg.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (pkg: PackageData) => {
    setCurrentPackage(pkg);
    setIsFormOpen(true);
  };

  const handleDelete = (packageId: string) => {
    setPackageToDelete(packageId);
    setIsDeleteOpen(true);
  };

  const handleAddNew = () => {
    setCurrentPackage(null);
    setIsFormOpen(true);
  };

  const handleSave = async (values: any) => {
    await handleSavePackage(values, currentPackage?.id);
    setIsFormOpen(false);
    setCurrentPackage(null);
  };

  const confirmDelete = async () => {
    if (packageToDelete) {
      await handleDeletePackage(packageToDelete);
      setIsDeleteOpen(false);
      setPackageToDelete(null);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search packages..."
        />
        <Button onClick={handleAddNew}>
          <Plus className="h-4 w-4 mr-2" />
          Add Package
        </Button>
      </div>

      {isSaving && (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-ocean" />
          <span className="ml-2 text-gray-600">Saving...</span>
        </div>
      )}

      <PackageTable
        packages={filteredPackages}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDragStart={handleDragStart}
        onDragEnter={handleDragEnter}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      />

      <PackageFormDialog
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        currentPackage={currentPackage}
        onSave={handleSave}
        onCancel={() => {
          setIsFormOpen(false);
          setCurrentPackage(null);
        }}
      />

      <DeletePackageDialog
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onDelete={confirmDelete}
      />
    </div>
  );
};

export default TourPackagesManager;
