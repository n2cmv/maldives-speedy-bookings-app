
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
import { Textarea } from "@/components/ui/textarea";
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
import { Search, Edit, Trash2, Plus } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const islandSchema = z.object({
  name: z.string().min(1, "Island name is required"),
  description: z.string().min(1, "Description is required"),
  image_url: z.string().optional(),
});

type IslandFormValues = z.infer<typeof islandSchema>;

const IslandsManager = () => {
  const { toast } = useToast();
  const [islands, setIslands] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [currentIsland, setCurrentIsland] = useState<any | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [islandToDelete, setIslandToDelete] = useState<string | null>(null);
  
  const form = useForm<IslandFormValues>({
    resolver: zodResolver(islandSchema),
    defaultValues: {
      name: "",
      description: "",
      image_url: "",
    },
  });

  useEffect(() => {
    fetchIslands();
  }, []);

  useEffect(() => {
    if (currentIsland) {
      form.reset({
        name: currentIsland.name,
        description: currentIsland.description,
        image_url: currentIsland.image_url || "",
      });
    } else {
      form.reset({
        name: "",
        description: "",
        image_url: "",
      });
    }
  }, [currentIsland, form]);

  const fetchIslands = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('islands')
        .select('*')
        .order('name');

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

  const onSubmit = async (values: IslandFormValues) => {
    try {
      if (currentIsland) {
        // Update existing island
        const { error } = await supabase
          .from('islands')
          .update({
            name: values.name,
            description: values.description,
            image_url: values.image_url,
          })
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
          .insert({
            name: values.name,
            description: values.description,
            image_url: values.image_url,
          });
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Island has been created",
        });
      }
      
      setIsFormOpen(false);
      setCurrentIsland(null);
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

  const handleEdit = (island: any) => {
    setCurrentIsland(island);
    setIsFormOpen(true);
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
        <Button onClick={() => {
          setCurrentIsland(null);
          setIsFormOpen(true);
        }}>
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
                    <TableCell className="max-w-md truncate">{island.description}</TableCell>
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
                  <TableCell colSpan={3} className="text-center py-4">
                    No islands found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-md">
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
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Island Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter island name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter island description" 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="image_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter image URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsFormOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </form>
          </Form>
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
