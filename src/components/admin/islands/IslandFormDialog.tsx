
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Island } from "@/types/island";

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
          target: { 
            name: 'heroImage', 
            value: publicUrl 
          }
        } as React.ChangeEvent<HTMLInputElement>);
      } else {
        const currentImages = islandForm.galleryImages || [];
        // Using as unknown as first to avoid type errors
        onFormChange({
          target: { 
            name: 'galleryImages', 
            value: [...currentImages, publicUrl] 
          }
        } as unknown as React.ChangeEvent<HTMLInputElement>);
      }

      toast({
        title: "Image Uploaded",
        description: "Image uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Check if required fields are filled
  const isFormValid = islandForm.name && islandForm.description;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="details">Details & Images</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="faq">FAQ & Facts</TabsTrigger>
          </TabsList>
          
          {/* Basic Information Tab */}
          <TabsContent value="basic" className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Island Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="name"
                name="name"
                value={islandForm.name || ""}
                onChange={onFormChange}
                placeholder="Island name"
                required
              />
              {!islandForm.name && (
                <p className="text-xs text-red-500">Name is required</p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="description"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Short Description <span className="text-red-500">*</span>
              </label>
              <Textarea
                id="description"
                name="description"
                value={islandForm.description || ""}
                onChange={onFormChange}
                placeholder="Brief description"
                rows={3}
                required
              />
              {!islandForm.description && (
                <p className="text-xs text-red-500">Description is required</p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="image_url"
                className="text-sm font-medium leading-none"
              >
                Main Image URL
              </label>
              <Input
                id="image_url"
                name="image_url"
                value={islandForm.image_url || ""}
                onChange={onFormChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="tagline"
                className="text-sm font-medium leading-none"
              >
                Tagline
              </label>
              <Input
                id="tagline"
                name="tagline"
                value={islandForm.tagline || ""}
                onChange={onFormChange}
                placeholder="A short catchy tagline"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="slug"
                className="text-sm font-medium leading-none"
              >
                URL Slug
              </label>
              <Input
                id="slug"
                name="slug"
                value={islandForm.slug || ""}
                onChange={onFormChange}
                placeholder="island-name"
              />
              <p className="text-xs text-muted-foreground">
                Used in the URL: /islands/your-slug
              </p>
            </div>
          </TabsContent>

          {/* Details & Images Tab */}
          <TabsContent value="details" className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="full_description"
                className="text-sm font-medium leading-none"
              >
                Full Description
              </label>
              <Textarea
                id="full_description"
                name="fullDescription"
                value={islandForm.fullDescription || ""}
                onChange={onFormChange}
                placeholder="Detailed description of the island"
                rows={6}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="hero_image"
                className="text-sm font-medium leading-none"
              >
                Hero Image Upload
              </label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file, 'heroImage');
                }}
                disabled={isUploading}
              />
              {islandForm.heroImage && (
                <img 
                  src={islandForm.heroImage} 
                  alt="Hero" 
                  className="mt-2 max-h-48 object-cover" 
                />
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none block mb-2">
                Gallery Images Upload
              </label>
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = e.target.files;
                  if (files) {
                    Array.from(files).forEach(file => 
                      handleImageUpload(file, 'galleryImage')
                    );
                  }
                }}
                disabled={isUploading}
              />
              {islandForm.galleryImages && islandForm.galleryImages.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {islandForm.galleryImages.map((imageUrl, index) => (
                    <img 
                      key={index} 
                      src={imageUrl} 
                      alt={`Gallery ${index + 1}`} 
                      className="h-24 w-24 object-cover rounded"
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none block mb-2">
                  Location Information
                </label>
                <div className="pl-2 border-l-2 border-muted space-y-2">
                  <div>
                    <label htmlFor="location_atoll" className="text-xs text-muted-foreground">Atoll</label>
                    <Input
                      id="location_atoll"
                      value={islandForm.location?.atoll || ""}
                      onChange={(e) => onNestedFieldChange('location', 'atoll', e.target.value)}
                      placeholder="North Malé Atoll"
                    />
                  </div>
                  <div>
                    <label htmlFor="location_coordinates" className="text-xs text-muted-foreground">Coordinates</label>
                    <Input
                      id="location_coordinates"
                      value={islandForm.location?.coordinates || ""}
                      onChange={(e) => onNestedFieldChange('location', 'coordinates', e.target.value)}
                      placeholder="4.1755° N, 73.5093° E"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none block mb-2">
                  Travel Information
                </label>
                <div className="pl-2 border-l-2 border-muted space-y-2">
                  <div>
                    <label htmlFor="travel_from_male" className="text-xs text-muted-foreground">From Malé</label>
                    <Input
                      id="travel_from_male"
                      value={islandForm.travelInfo?.fromMale || ""}
                      onChange={(e) => onNestedFieldChange('travelInfo', 'fromMale', e.target.value)}
                      placeholder="20 minutes by speedboat"
                    />
                  </div>
                  <div>
                    <label htmlFor="travel_best_way" className="text-xs text-muted-foreground">Best Way to Reach</label>
                    <Input
                      id="travel_best_way"
                      value={islandForm.travelInfo?.bestWayToReach || ""}
                      onChange={(e) => onNestedFieldChange('travelInfo', 'bestWayToReach', e.target.value)}
                      placeholder="Speedboat transfer from Malé"
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Features Tab */}
          <TabsContent value="features" className="space-y-6">
            {/* Activities Section */}
            <div className="space-y-3">
              <label className="text-sm font-medium leading-none block">
                Activities
              </label>
              {(islandForm.activities || []).map((activity, index) => (
                <div key={index} className="border rounded-md p-3 relative">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    className="absolute top-2 right-2 text-destructive h-6 w-6 p-0"
                    onClick={() => onArrayItemRemove('activities', index)}
                  >
                    ×
                  </Button>
                  <div className="space-y-2">
                    <Input
                      value={activity.name || ""}
                      onChange={(e) => {
                        const updatedActivities = [...(islandForm.activities || [])];
                        updatedActivities[index] = { ...activity, name: e.target.value };
                        // Using as unknown as to avoid type errors
                        onFormChange({
                          target: { name: 'activities', value: updatedActivities }
                        } as unknown as React.ChangeEvent<HTMLInputElement>);
                      }}
                      placeholder="Activity Name"
                      className="mb-2"
                    />
                    <Textarea
                      value={activity.description || ""}
                      onChange={(e) => {
                        const updatedActivities = [...(islandForm.activities || [])];
                        updatedActivities[index] = { ...activity, description: e.target.value };
                        // Using as unknown as to avoid type errors
                        onFormChange({
                          target: { name: 'activities', value: updatedActivities }
                        } as unknown as React.ChangeEvent<HTMLTextAreaElement>);
                      }}
                      placeholder="Activity Description"
                      rows={2}
                      className="mb-2"
                    />
                    <Input
                      value={activity.image || ""}
                      onChange={(e) => {
                        const updatedActivities = [...(islandForm.activities || [])];
                        updatedActivities[index] = { ...activity, image: e.target.value };
                        // Using as unknown as to avoid type errors
                        onFormChange({
                          target: { name: 'activities', value: updatedActivities }
                        } as unknown as React.ChangeEvent<HTMLInputElement>);
                      }}
                      placeholder="Activity Image URL"
                    />
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onArrayItemAdd('activities', { name: '', description: '', image: '' })}
                className="w-full"
              >
                Add Activity
              </Button>
            </div>

            {/* Accommodation Section */}
            <div className="space-y-3">
              <label className="text-sm font-medium leading-none block">
                Accommodation
              </label>
              {(islandForm.accommodation || []).map((item, index) => (
                <div key={index} className="border rounded-md p-3 relative">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    className="absolute top-2 right-2 text-destructive h-6 w-6 p-0"
                    onClick={() => onArrayItemRemove('accommodation', index)}
                  >
                    ×
                  </Button>
                  <div className="space-y-2">
                    <Input
                      value={item.type || ""}
                      onChange={(e) => {
                        const updated = [...(islandForm.accommodation || [])];
                        updated[index] = { ...item, type: e.target.value };
                        // Using as unknown as to avoid type errors
                        onFormChange({
                          target: { name: 'accommodation', value: updated }
                        } as unknown as React.ChangeEvent<HTMLInputElement>);
                      }}
                      placeholder="Accommodation Type"
                      className="mb-2"
                    />
                    <Textarea
                      value={item.description || ""}
                      onChange={(e) => {
                        const updated = [...(islandForm.accommodation || [])];
                        updated[index] = { ...item, description: e.target.value };
                        // Using as unknown as to avoid type errors
                        onFormChange({
                          target: { name: 'accommodation', value: updated }
                        } as unknown as React.ChangeEvent<HTMLTextAreaElement>);
                      }}
                      placeholder="Description"
                      rows={2}
                      className="mb-2"
                    />
                    <Input
                      value={item.priceRange || ""}
                      onChange={(e) => {
                        const updated = [...(islandForm.accommodation || [])];
                        updated[index] = { ...item, priceRange: e.target.value };
                        // Using as unknown as to avoid type errors
                        onFormChange({
                          target: { name: 'accommodation', value: updated }
                        } as unknown as React.ChangeEvent<HTMLInputElement>);
                      }}
                      placeholder="Price Range"
                    />
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onArrayItemAdd('accommodation', { type: '', description: '', priceRange: '' })}
                className="w-full"
              >
                Add Accommodation
              </Button>
            </div>

            {/* Dining Section */}
            <div className="space-y-3">
              <label className="text-sm font-medium leading-none block">
                Dining
              </label>
              {(islandForm.dining || []).map((item, index) => (
                <div key={index} className="border rounded-md p-3 relative">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    className="absolute top-2 right-2 text-destructive h-6 w-6 p-0"
                    onClick={() => onArrayItemRemove('dining', index)}
                  >
                    ×
                  </Button>
                  <div className="space-y-2">
                    <Input
                      value={item.type || ""}
                      onChange={(e) => {
                        const updated = [...(islandForm.dining || [])];
                        updated[index] = { ...item, type: e.target.value };
                        // Using as unknown as to avoid type errors
                        onFormChange({
                          target: { name: 'dining', value: updated }
                        } as unknown as React.ChangeEvent<HTMLInputElement>);
                      }}
                      placeholder="Dining Type"
                      className="mb-2"
                    />
                    <Textarea
                      value={item.description || ""}
                      onChange={(e) => {
                        const updated = [...(islandForm.dining || [])];
                        updated[index] = { ...item, description: e.target.value };
                        // Using as unknown as to avoid type errors
                        onFormChange({
                          target: { name: 'dining', value: updated }
                        } as unknown as React.ChangeEvent<HTMLTextAreaElement>);
                      }}
                      placeholder="Description"
                      rows={2}
                    />
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onArrayItemAdd('dining', { type: '', description: '' })}
                className="w-full"
              >
                Add Dining
              </Button>
            </div>

            {/* Weather Section */}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none block mb-2">
                Weather Information
              </label>
              <div className="pl-2 border-l-2 border-muted space-y-2">
                <div>
                  <label htmlFor="weather_best_time" className="text-xs text-muted-foreground">Best Time to Visit</label>
                  <Input
                    id="weather_best_time"
                    value={islandForm.weather?.bestTime || ""}
                    onChange={(e) => onNestedFieldChange('weather', 'bestTime', e.target.value)}
                    placeholder="November to April"
                  />
                </div>
                <div>
                  <label htmlFor="weather_temperature" className="text-xs text-muted-foreground">Temperature</label>
                  <Input
                    id="weather_temperature"
                    value={islandForm.weather?.temperature || ""}
                    onChange={(e) => onNestedFieldChange('weather', 'temperature', e.target.value)}
                    placeholder="24°C to 33°C"
                  />
                </div>
                <div>
                  <label htmlFor="weather_rainfall" className="text-xs text-muted-foreground">Rainfall</label>
                  <Input
                    id="weather_rainfall"
                    value={islandForm.weather?.rainfall || ""}
                    onChange={(e) => onNestedFieldChange('weather', 'rainfall', e.target.value)}
                    placeholder="Heaviest in May to November"
                  />
                </div>
              </div>
            </div>

            {/* Essential Info Section */}
            <div className="space-y-3">
              <label className="text-sm font-medium leading-none block">
                Essential Information
              </label>
              {(islandForm.essentialInfo || []).map((item, index) => (
                <div key={index} className="border rounded-md p-3 relative">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    className="absolute top-2 right-2 text-destructive h-6 w-6 p-0"
                    onClick={() => onArrayItemRemove('essentialInfo', index)}
                  >
                    ×
                  </Button>
                  <div className="space-y-2">
                    <Input
                      value={item.title || ""}
                      onChange={(e) => {
                        const updated = [...(islandForm.essentialInfo || [])];
                        updated[index] = { ...item, title: e.target.value };
                        // Using as unknown as to avoid type errors
                        onFormChange({
                          target: { name: 'essentialInfo', value: updated }
                        } as unknown as React.ChangeEvent<HTMLInputElement>);
                      }}
                      placeholder="Title"
                      className="mb-2"
                    />
                    <Textarea
                      value={item.description || ""}
                      onChange={(e) => {
                        const updated = [...(islandForm.essentialInfo || [])];
                        updated[index] = { ...item, description: e.target.value };
                        // Using as unknown as to avoid type errors
                        onFormChange({
                          target: { name: 'essentialInfo', value: updated }
                        } as unknown as React.ChangeEvent<HTMLTextAreaElement>);
                      }}
                      placeholder="Description"
                      rows={2}
                      className="mb-2"
                    />
                    <Input
                      value={item.icon || ""}
                      onChange={(e) => {
                        const updated = [...(islandForm.essentialInfo || [])];
                        updated[index] = { ...item, icon: e.target.value };
                        // Using as unknown as to avoid type errors
                        onFormChange({
                          target: { name: 'essentialInfo', value: updated }
                        } as unknown as React.ChangeEvent<HTMLInputElement>);
                      }}
                      placeholder="Icon name (e.g., 'wifi', 'clock')"
                    />
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onArrayItemAdd('essentialInfo', { title: '', description: '', icon: '' })}
                className="w-full"
              >
                Add Essential Info
              </Button>
            </div>
          </TabsContent>

          {/* FAQ and Quick Facts Tab */}
          <TabsContent value="faq" className="space-y-6">
            {/* Quick Facts Section */}
            <div className="space-y-3">
              <label className="text-sm font-medium leading-none block">
                Quick Facts
              </label>
              {(islandForm.quickFacts || []).map((fact, index) => (
                <div key={index} className="border rounded-md p-3 relative">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    className="absolute top-2 right-2 text-destructive h-6 w-6 p-0"
                    onClick={() => onArrayItemRemove('quickFacts', index)}
                  >
                    ×
                  </Button>
                  <div className="space-y-2">
                    <Input
                      value={fact.label || ""}
                      onChange={(e) => {
                        const updated = [...(islandForm.quickFacts || [])];
                        updated[index] = { ...fact, label: e.target.value };
                        // Using as unknown as to avoid type errors
                        onFormChange({
                          target: { name: 'quickFacts', value: updated }
                        } as unknown as React.ChangeEvent<HTMLInputElement>);
                      }}
                      placeholder="Label"
                      className="mb-2"
                    />
                    <Input
                      value={fact.value || ""}
                      onChange={(e) => {
                        const updated = [...(islandForm.quickFacts || [])];
                        updated[index] = { ...fact, value: e.target.value };
                        // Using as unknown as to avoid type errors
                        onFormChange({
                          target: { name: 'quickFacts', value: updated }
                        } as unknown as React.ChangeEvent<HTMLInputElement>);
                      }}
                      placeholder="Value"
                      className="mb-2"
                    />
                    <Input
                      value={fact.icon || ""}
                      onChange={(e) => {
                        const updated = [...(islandForm.quickFacts || [])];
                        updated[index] = { ...fact, icon: e.target.value };
                        // Using as unknown as to avoid type errors
                        onFormChange({
                          target: { name: 'quickFacts', value: updated }
                        } as unknown as React.ChangeEvent<HTMLInputElement>);
                      }}
                      placeholder="Icon name (e.g., 'map-pin', 'users')"
                    />
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onArrayItemAdd('quickFacts', { label: '', value: '', icon: '' })}
                className="w-full"
              >
                Add Quick Fact
              </Button>
            </div>

            {/* FAQs Section */}
            <div className="space-y-3">
              <label className="text-sm font-medium leading-none block">
                Frequently Asked Questions
              </label>
              {(islandForm.faqs || []).map((faq, index) => (
                <div key={index} className="border rounded-md p-3 relative">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    className="absolute top-2 right-2 text-destructive h-6 w-6 p-0"
                    onClick={() => onArrayItemRemove('faqs', index)}
                  >
                    ×
                  </Button>
                  <div className="space-y-2">
                    <Input
                      value={faq.question || ""}
                      onChange={(e) => {
                        const updated = [...(islandForm.faqs || [])];
                        updated[index] = { ...faq, question: e.target.value };
                        // Using as unknown as to avoid type errors
                        onFormChange({
                          target: { name: 'faqs', value: updated }
                        } as unknown as React.ChangeEvent<HTMLInputElement>);
                      }}
                      placeholder="Question"
                      className="mb-2"
                    />
                    <Textarea
                      value={faq.answer || ""}
                      onChange={(e) => {
                        const updated = [...(islandForm.faqs || [])];
                        updated[index] = { ...faq, answer: e.target.value };
                        // Using as unknown as to avoid type errors
                        onFormChange({
                          target: { name: 'faqs', value: updated }
                        } as unknown as React.ChangeEvent<HTMLTextAreaElement>);
                      }}
                      placeholder="Answer"
                      rows={3}
                    />
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onArrayItemAdd('faqs', { question: '', answer: '' })}
                className="w-full"
              >
                Add FAQ
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            onClick={onSubmit} 
            disabled={!isFormValid}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default IslandFormDialog;
