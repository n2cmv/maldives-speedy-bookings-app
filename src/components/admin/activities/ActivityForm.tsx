import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ActivityData } from "./hooks/useActivityManager";

const activityFormSchema = z.object({
  activity_id: z.string().min(1, "Activity ID is required"),
  name: z.string().min(1, "Name is required"),
  price: z.coerce.number().min(0, "Price must be positive"),
  description: z.string().min(1, "Description is required"),
  icon: z.string().nullable(),
  is_active: z.boolean(),
});

type ActivityFormValues = z.infer<typeof activityFormSchema>;

const iconOptions = [
  { value: "anchor", label: "Anchor" },
  { value: "sailboat", label: "Sailboat" },
  { value: "turtle", label: "Turtle" },
  { value: "umbrella", label: "Umbrella" },
  { value: "building", label: "Building" },
  { value: "sunset", label: "Sunset" },
];

interface ActivityFormProps {
  activity: ActivityData | null;
  onSave: (values: ActivityFormValues) => Promise<void>;
  onCancel: () => void;
}

const ActivityForm = ({ activity, onSave, onCancel }: ActivityFormProps) => {
  const form = useForm<ActivityFormValues>({
    resolver: zodResolver(activityFormSchema),
    defaultValues: {
      activity_id: activity?.activity_id || "",
      name: activity?.name || "",
      price: activity?.price || 0,
      description: activity?.description || "",
      icon: activity?.icon || null,
      is_active: activity?.is_active !== undefined ? activity.is_active : true,
    },
  });

  const onSubmit = async (values: ActivityFormValues) => {
    await onSave(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="activity_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Activity ID</FormLabel>
              <FormControl>
                <Input placeholder="e.g., whale_shark" {...field} />
              </FormControl>
              <FormDescription>
                Unique identifier for the activity (used in URLs)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Activity name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price (USD)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="0.00" {...field} />
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
                  placeholder="Describe the activity..."
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
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Icon</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || undefined}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an icon" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {iconOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Active</FormLabel>
                <FormDescription>
                  Display this activity to customers
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex gap-4 justify-end">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {activity ? "Update Activity" : "Create Activity"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ActivityForm;
