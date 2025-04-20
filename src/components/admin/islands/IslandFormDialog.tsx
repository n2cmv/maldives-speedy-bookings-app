
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from "@/components/ui/tabs";
import { Island } from "@/types/island";
import { Form } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, Image } from "lucide-react";

interface IslandFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentIsland: Island | null;
  islandForm: Island;
  onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: () => Promise<void>;
  onCancel: () => void;
  onArrayItemAdd: (field: keyof Island, item: any) => void;
  onArrayItemRemove: (field: keyof Island, index: number) => void;
  onNestedFieldChange: (parentField: keyof Island, key: string, value: any) => void;
}

const IslandFormDialog = ({
  isOpen,
  onOpenChange,
  currentIsland,
  islandForm,
  onFormChange,
  onSubmit,
  onCancel,
  onArrayItemAdd,
  onArrayItemRemove,
  onNestedFieldChange,
}: IslandFormDialogProps) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  const handleImageUpload = async (file: File, type: 'heroImage' | 'galleryImage') => {
    if (!file) return null;

    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error } = await supabase.storage
        .from('island-images')
        .upload(filePath, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('island-images')
        .getPublicUrl(filePath);

      if (type === 'heroImage') {
        onFormChange({
          target: { name: 'heroImage', value: publicUrl }
        } as React.ChangeEvent<HTMLInputElement>);
      } else {
        const currentImages = islandForm.galleryImages || [];
        onFormChange({
          target: { name: 'galleryImages', value: [...currentImages, publicUrl] }
        } as unknown as React.ChangeEvent<HTMLInputElement>);
      }

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Check if required fields are filled
  const isFormValid = islandForm.name && islandForm.description;

  const renderFieldHeader = (title: string) => (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <div className="h-px flex-1 bg-gray-200 mx-4" />
    </div>
  );

  const renderImagePreview = (url: string, onRemove?: () => void) => (
    <div className="relative group">
      <img 
        src={url} 
        alt="Preview" 
        className="h-24 w-24 object-cover rounded-lg border border-gray-200"
      />
      {onRemove && (
        <button
          onClick={onRemove}
          className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {currentIsland ? "Edit Island" : "Add New Island"}
          </DialogTitle>
          <DialogDescription>
            {currentIsland
              ? "Update the island details below"
              : "Fill in the island information"}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-200px)] pr-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 w-full bg-gray-50 p-1 rounded-lg mb-6">
              <TabsTrigger 
                value="basic"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Basic Info
              </TabsTrigger>
              <TabsTrigger 
                value="details"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Media & Location
              </TabsTrigger>
              <TabsTrigger 
                value="features"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Features
              </TabsTrigger>
              <TabsTrigger 
                value="faq"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                FAQ & Facts
              </TabsTrigger>
            </TabsList>
            
            {/* Basic Information Tab */}
            <TabsContent value="basic" className="space-y-6">
              <Card className="p-6">
                {renderFieldHeader("Essential Details")}
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Island Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="name"
                      value={islandForm.name || ""}
                      onChange={onFormChange}
                      placeholder="Enter island name"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      name="description"
                      value={islandForm.description || ""}
                      onChange={onFormChange}
                      placeholder="Brief description of the island"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Tagline
                    </label>
                    <Input
                      name="tagline"
                      value={islandForm.tagline || ""}
                      onChange={onFormChange}
                      placeholder="A catchy tagline for the island"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      URL Slug
                    </label>
                    <Input
                      name="slug"
                      value={islandForm.slug || ""}
                      onChange={onFormChange}
                      placeholder="island-name"
                      className="font-mono"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Used in URL: /islands/your-slug
                    </p>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Media & Location Tab */}
            <TabsContent value="details" className="space-y-6">
              <Card className="p-6">
                {renderFieldHeader("Media")}
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Hero Image
                    </label>
                    <div className="flex items-center space-x-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = 'image/*';
                          input.onchange = (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0];
                            if (file) handleImageUpload(file, 'heroImage');
                          };
                          input.click();
                        }}
                        disabled={isUploading}
                        className="flex items-center space-x-2"
                      >
                        <Image className="h-4 w-4" />
                        <span>Upload Hero Image</span>
                      </Button>
                      {islandForm.heroImage && (
                        <div className="flex-shrink-0">
                          {renderImagePreview(islandForm.heroImage)}
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Gallery Images
                    </label>
                    <div className="space-y-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = 'image/*';
                          input.multiple = true;
                          input.onchange = (e) => {
                            const files = (e.target as HTMLInputElement).files;
                            if (files) {
                              Array.from(files).forEach(file => 
                                handleImageUpload(file, 'galleryImage')
                              );
                            }
                          };
                          input.click();
                        }}
                        disabled={isUploading}
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Gallery Images
                      </Button>
                      
                      {islandForm.galleryImages && islandForm.galleryImages.length > 0 && (
                        <div className="grid grid-cols-4 gap-4 mt-4">
                          {islandForm.galleryImages.map((imageUrl, index) => (
                            renderImagePreview(
                              imageUrl,
                              () => {
                                const newImages = [...(islandForm.galleryImages || [])];
                                newImages.splice(index, 1);
                                onFormChange({
                                  target: { name: 'galleryImages', value: newImages }
                                } as unknown as React.ChangeEvent<HTMLInputElement>);
                              }
                            )
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Location Details
                      </label>
                      <div className="space-y-3">
                        <Input
                          value={islandForm.location?.atoll || ""}
                          onChange={(e) => onNestedFieldChange('location', 'atoll', e.target.value)}
                          placeholder="Atoll (e.g., North Malé Atoll)"
                        />
                        <Input
                          value={islandForm.location?.coordinates || ""}
                          onChange={(e) => onNestedFieldChange('location', 'coordinates', e.target.value)}
                          placeholder="Coordinates"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Travel Information
                      </label>
                      <div className="space-y-3">
                        <Input
                          value={islandForm.travelInfo?.fromMale || ""}
                          onChange={(e) => onNestedFieldChange('travelInfo', 'fromMale', e.target.value)}
                          placeholder="Distance from Malé"
                        />
                        <Input
                          value={islandForm.travelInfo?.bestWayToReach || ""}
                          onChange={(e) => onNestedFieldChange('travelInfo', 'bestWayToReach', e.target.value)}
                          placeholder="Best way to reach"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Features Tab */}
            <TabsContent value="features" className="space-y-6">
              <Card className="p-6">
                {renderFieldHeader("Activities & Accommodation")}
                
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-sm font-medium">Activities</label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onArrayItemAdd('activities', { name: '', description: '', image: '' })}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Activity
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      {(islandForm.activities || []).map((activity, index) => (
                        <Card key={index} className="p-4 relative">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                            onClick={() => onArrayItemRemove('activities', index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <div className="space-y-3 pr-8">
                            <Input
                              value={activity.name || ""}
                              onChange={(e) => {
                                const updated = [...(islandForm.activities || [])];
                                updated[index] = { ...activity, name: e.target.value };
                                onFormChange({
                                  target: { name: 'activities', value: updated }
                                } as unknown as React.ChangeEvent<HTMLInputElement>);
                              }}
                              placeholder="Activity name"
                            />
                            <Textarea
                              value={activity.description || ""}
                              onChange={(e) => {
                                const updated = [...(islandForm.activities || [])];
                                updated[index] = { ...activity, description: e.target.value };
                                onFormChange({
                                  target: { name: 'activities', value: updated }
                                } as unknown as React.ChangeEvent<HTMLTextAreaElement>);
                              }}
                              placeholder="Activity description"
                              rows={2}
                            />
                            <Input
                              value={activity.image || ""}
                              onChange={(e) => {
                                const updated = [...(islandForm.activities || [])];
                                updated[index] = { ...activity, image: e.target.value };
                                onFormChange({
                                  target: { name: 'activities', value: updated }
                                } as unknown as React.ChangeEvent<HTMLInputElement>);
                              }}
                              placeholder="Activity image URL"
                            />
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-sm font-medium">Accommodation</label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onArrayItemAdd('accommodation', { type: '', description: '', image: '' })}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Accommodation
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      {(islandForm.accommodation || []).map((item, index) => (
                        <Card key={index} className="p-4 relative">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                            onClick={() => onArrayItemRemove('accommodation', index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <div className="space-y-3 pr-8">
                            <Input
                              value={item.type || ""}
                              onChange={(e) => {
                                const updated = [...(islandForm.accommodation || [])];
                                updated[index] = { ...item, type: e.target.value };
                                onFormChange({
                                  target: { name: 'accommodation', value: updated }
                                } as unknown as React.ChangeEvent<HTMLInputElement>);
                              }}
                              placeholder="Accommodation type"
                            />
                            <Textarea
                              value={item.description || ""}
                              onChange={(e) => {
                                const updated = [...(islandForm.accommodation || [])];
                                updated[index] = { ...item, description: e.target.value };
                                onFormChange({
                                  target: { name: 'accommodation', value: updated }
                                } as unknown as React.ChangeEvent<HTMLTextAreaElement>);
                              }}
                              placeholder="Description"
                              rows={2}
                            />
                            <Input
                              value={item.image || ""}
                              onChange={(e) => {
                                const updated = [...(islandForm.accommodation || [])];
                                updated[index] = { ...item, image: e.target.value };
                                onFormChange({
                                  target: { name: 'accommodation', value: updated }
                                } as unknown as React.ChangeEvent<HTMLInputElement>);
                              }}
                              placeholder="Image URL"
                            />
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* FAQ & Quick Facts Tab */}
            <TabsContent value="faq" className="space-y-6">
              <Card className="p-6">
                {renderFieldHeader("Quick Facts & FAQs")}
                
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-sm font-medium">Quick Facts</label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onArrayItemAdd('quickFacts', { label: '', value: '', icon: '' })}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Quick Fact
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      {(islandForm.quickFacts || []).map((fact, index) => (
                        <Card key={index} className="p-4 relative">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                            onClick={() => onArrayItemRemove('quickFacts', index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <div className="grid grid-cols-3 gap-3 pr-8">
                            <Input
                              value={fact.label || ""}
                              onChange={(e) => {
                                const updated = [...(islandForm.quickFacts || [])];
                                updated[index] = { ...fact, label: e.target.value };
                                onFormChange({
                                  target: { name: 'quickFacts', value: updated }
                                } as unknown as React.ChangeEvent<HTMLInputElement>);
                              }}
                              placeholder="Label"
                            />
                            <Input
                              value={fact.value || ""}
                              onChange={(e) => {
                                const updated = [...(islandForm.quickFacts || [])];
                                updated[index] = { ...fact, value: e.target.value };
                                onFormChange({
                                  target: { name: 'quickFacts', value: updated }
                                } as unknown as React.ChangeEvent<HTMLInputElement>);
                              }}
                              placeholder="Value"
                            />
                            <Input
                              value={fact.icon || ""}
                              onChange={(e) => {
                                const updated = [...(islandForm.quickFacts || [])];
                                updated[index] = { ...fact, icon: e.target.value };
                                onFormChange({
                                  target: { name: 'quickFacts', value: updated }
                                } as unknown as React.ChangeEvent<HTMLInputElement>);
                              }}
                              placeholder="Icon name"
                            />
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-sm font-medium">FAQs</label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onArrayItemAdd('faqs', { question: '', answer: '' })}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add FAQ
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      {(islandForm.faqs || []).map((faq, index) => (
                        <Card key={index} className="p-4 relative">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                            onClick={() => onArrayItemRemove('faqs', index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <div className="space-y-3 pr-8">
                            <Input
                              value={faq.question || ""}
                              onChange={(e) => {
                                const updated = [...(islandForm.faqs || [])];
                                updated[index] = { ...faq, question: e.target.value };
                                onFormChange({
                                  target: { name: 'faqs', value: updated }
                                } as unknown as React.ChangeEvent<HTMLInputElement>);
                              }}
                              placeholder="Question"
                            />
                            <Textarea
                              value={faq.answer || ""}
                              onChange={(e) => {
                                const updated = [...(islandForm.faqs || [])];
                                updated[index] = { ...faq, answer: e.target.value };
                                onFormChange({
                                  target: { name: 'faqs', value: updated }
                                } as unknown as React.ChangeEvent<HTMLTextAreaElement>);
                              }}
                              placeholder="Answer"
                              rows={3}
                            />
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </ScrollArea>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            onClick={onSubmit} 
            disabled={!isFormValid || isUploading}
            className="ml-2"
          >
            {isUploading ? "Uploading..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default IslandFormDialog;
