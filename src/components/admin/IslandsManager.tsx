
import React, { useState } from "react";
import { Island } from "@/types/island";
import IslandTable from "./islands/IslandTable";
import IslandFormDialog from "./islands/IslandFormDialog";
import IslandSearchBar from "./islands/IslandSearchBar";
import { useIslandManager } from "./islands/hooks/useIslandManager";
import LoadingSpinner from "./common/LoadingSpinner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const IslandsManager = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isIslandFormOpen, setIsIslandFormOpen] = useState<boolean>(false);
  const [currentIsland, setCurrentIsland] = useState<Island | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [islandToDelete, setIslandToDelete] = useState<string | null>(null);
  const [islandForm, setIslandForm] = useState<Island>({
    name: "",
    description: "",
    image_url: "",
  });

  const { islands, isLoading, handleDelete, handleSubmit } = useIslandManager();

  const handleEdit = (island: Island) => {
    setCurrentIsland(island);
    setIslandForm({
      name: island.name,
      description: island.description,
      image_url: island.image_url || "",
    });
    setIsIslandFormOpen(true);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setIslandForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async () => {
    const success = await handleSubmit(islandForm, currentIsland?.id);
    if (success) {
      setIsIslandFormOpen(false);
      setCurrentIsland(null);
      setIslandForm({ name: "", description: "", image_url: "" });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!islandToDelete) return;
    
    const success = await handleDelete(islandToDelete);
    if (success) {
      setIsDeleteDialogOpen(false);
      setIslandToDelete(null);
    }
  };

  const filteredIslands = islands.filter((island) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      island.name?.toLowerCase().includes(query) ||
      island.description?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-4">
      <IslandSearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddClick={() => {
          setCurrentIsland(null);
          setIslandForm({ name: "", description: "", image_url: "" });
          setIsIslandFormOpen(true);
        }}
      />

      {isLoading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      ) : (
        <IslandTable
          islands={filteredIslands}
          onEdit={handleEdit}
          onDelete={(id) => {
            setIslandToDelete(id);
            setIsDeleteDialogOpen(true);
          }}
        />
      )}

      <IslandFormDialog
        isOpen={isIslandFormOpen}
        onOpenChange={setIsIslandFormOpen}
        currentIsland={currentIsland}
        islandForm={islandForm}
        onFormChange={handleFormChange}
        onSubmit={handleFormSubmit}
        onCancel={() => {
          setIsIslandFormOpen(false);
          setCurrentIsland(null);
        }}
      />

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Island</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this island? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default IslandsManager;
