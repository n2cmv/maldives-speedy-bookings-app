
import React from "react";

interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
}

const LoadingSpinner = ({ 
  message = "Loading...", 
  fullScreen = false 
}: LoadingSpinnerProps) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-black/20 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          <p>{message}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex justify-center py-8">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
    </div>
  );
};

export default LoadingSpinner;
