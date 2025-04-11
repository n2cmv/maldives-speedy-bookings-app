import { toast as sonnerToast } from "sonner";

type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  action?: React.ReactNode;
};

const toast = (props: ToastProps) => {
  const { title, description, variant } = props;
  
  if (variant === "destructive") {
    return sonnerToast.error(title, {
      description
    });
  }
  
  return sonnerToast(title, {
    description
  });
};

export { toast, sonnerToast };
