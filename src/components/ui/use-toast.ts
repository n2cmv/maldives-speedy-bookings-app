
import { toast as sonnerToast } from "sonner";

// Create a wrapper function that matches the expected API
export const toast = (title: string, options?: { description?: string; variant?: "default" | "destructive" }) => {
  if (options?.variant === "destructive") {
    return sonnerToast.error(title, {
      description: options?.description
    });
  }
  
  return sonnerToast(title, {
    description: options?.description
  });
};

export { sonnerToast };
