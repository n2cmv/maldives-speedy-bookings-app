
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Trash2, Plus, Search } from "lucide-react";

interface Island {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

const IslandsManager = () => {
  const { toast } = useToast();
  const [islands, setIslands] = useState<Island[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [currentIsland, setCurrentIsland] = useState<Island | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [islandToDelete, setIslandToDelete] = useState<string | null>(null);

  // Form state
  const [islandName, setIslandName] = useState<string>("");
  const [islandDescription, setIslandDescription] = useState<string>("");
  const [islandImageUrl, setIslandImageUrl] = useState<string>("");

  useEffect(() => {
    fetchIslands();
  }, []);

  const fetchIslands = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('islands')
        .select('*')
        .order('name', { ascending: true });

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

  const handleEditIsland = (island: Island) => {
    setCurrentIsland(island);
    setIslandName(island.name);
    setIslandDescription(island.description);
    setIslandImageUrl(island.image_url || "");
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setCurrentIsland(null);
    setIslandName("");
    setIslandDescription("");
    setIslandImageUrl("");
    setIsDialogOpen(true);
  };

  const handleSaveIsland = async () => {
    if (!islandName || !islandDescription) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const islandData = {
        name: islandName,
        description: islandDescription,
        image_url: islandImageUrl || null,
      };

      if (currentIsland) {
        // Update existing island
        const { error } = await supabase
          .from('islands')
          .update(islandData)
          .eq('id', currentIsland.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Island has been updated",
        });
      } else {
        // Create new island
        const { error } = await supabase
          .from('islands')
          .insert(islandData);

        if (error) throw error;

        toast({
          title: "Success",
          description: "New island has been created",
        });
      }

      setIsDialogOpen(false);
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

  const handleDelete = async () => {
    if (!islandToDelete) return;

    try {
      const { error } = await supabase
        .from('islands')
        .delete()
        .eq('id', islandToDelete);

      if (error) {
        throw error;
      }

      setIslands(islands.filter(island => island.id !== islandToDelete));
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

  const filteredIslands = islands.filter(island => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      island.name.toLowerCase().includes(query) ||
      island.description.toLowerCase().includes(query)
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
        <Button onClick={handleAddNew}>
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
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIslands.length > 0 ? (
                filteredIslands.map((island) => (
                  <TableRow key={island.id}>
                    <TableCell className="font-medium">{island.name}</TableCell>
                    <TableCell className="max-w-md truncate">
                      {island.description}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEditIsland(island)}
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
                  <TableCell colSpan={3} className="text-center py-4">
                    No islands found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
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
              <Label htmlFor="islandName">Island Name</Label>
              <Input
                id="islandName"
                value={islandName}
                onChange={(e) => setIslandName(e.target.value)}
                placeholder="e.g., Maafushi"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="islandDescription">Description</Label>
              <Textarea
                id="islandDescription"
                value={islandDescription}
                onChange={(e) => setIslandDescription(e.target.value)}
                placeholder="Describe the island..."
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="islandImageUrl">Image URL (optional)</Label>
              <Input
                id="islandImageUrl"
                value={islandImageUrl}
                onChange={(e) => setIslandImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveIsland}>
              {currentIsland ? "Update Island" : "Add Island"}
            </Button>
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
