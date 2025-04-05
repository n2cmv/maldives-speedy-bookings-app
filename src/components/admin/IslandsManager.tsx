
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Search, Edit, Trash2, Plus } from "lucide-react";
import { Island } from "@/types/island";

const IslandsManager = () => {
  const { toast } = useToast();
  const [islands, setIslands] = useState<Island[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
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

  useEffect(() => {
    fetchIslands();
  }, []);

  const fetchIslands = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("islands")
        .select("*")
        .order("name");

      if (error) {
        throw error;
      }

      setIslands(data || []);
    } catch (error) {
      console.error("Error fetching islands:", error);
      toast({
        title: "Error",
        description: "Failed to fetch islands",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (island: Island) => {
    setCurrentIsland(island);
    setIslandForm({
      name: island.name,
      description: island.description,
      image_url: island.image_url || "",
    });
    setIsIslandFormOpen(true);
  };

  const handleDelete = async () => {
    if (!islandToDelete) return;

    try {
      const { error } = await supabase
        .from("islands")
        .delete()
        .eq("id", islandToDelete);

      if (error) {
        throw error;
      }

      setIslands(islands.filter((island) => island.id !== islandToDelete));
      toast({
        title: "Success",
        description: "Island has been deleted",
      });
    } catch (error) {
      console.error("Error deleting island:", error);
      toast({
        title: "Error",
        description: "Failed to delete island",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setIslandToDelete(null);
    }
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setIslandForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (currentIsland?.id) {
        // Update existing island
        const { error } = await supabase
          .from("islands")
          .update({
            name: islandForm.name,
            description: islandForm.description,
            image_url: islandForm.image_url || null,
          })
          .eq("id", currentIsland.id);

        if (error) {
          throw error;
        }

        toast({
          title: "Success",
          description: "Island has been updated",
        });
      } else {
        // Create new island
        const { error } = await supabase
          .from("islands")
          .insert({
            name: islandForm.name,
            description: islandForm.description,
            image_url: islandForm.image_url || null,
          });

        if (error) {
          throw error;
        }

        toast({
          title: "Success",
          description: "Island has been created",
        });
      }

      // Reset form and fetch updated islands
      setIsIslandFormOpen(false);
      setCurrentIsland(null);
      setIslandForm({ name: "", description: "", image_url: "" });
      fetchIslands();
    } catch (error) {
      console.error("Error saving island:", error);
      toast({
        title: "Error",
        description: "Failed to save island",
        variant: "destructive",
      });
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
      <div className="flex justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search islands..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button
          onClick={() => {
            setCurrentIsland(null);
            setIslandForm({ name: "", description: "", image_url: "" });
            setIsIslandFormOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Island
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Image URL</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIslands.length > 0 ? (
                filteredIslands.map((island) => (
                  <TableRow key={island.id}>
                    <TableCell className="font-medium">{island.name}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {island.description}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {island.image_url || "N/A"}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(island)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setIslandToDelete(island.id);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    No islands found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isIslandFormOpen} onOpenChange={setIsIslandFormOpen}>
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
                onChange={handleFormChange}
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
                onChange={handleFormChange}
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
                onChange={handleFormChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsIslandFormOpen(false);
                setCurrentIsland(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default IslandsManager;
