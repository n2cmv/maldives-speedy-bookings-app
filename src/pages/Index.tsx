
import Header from "@/components/Header";
import WelcomeSection from "@/components/WelcomeSection";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Ship } from "lucide-react";
import { createLowQualityVideo } from "@/utils/videoUtils";
import { toast } from "sonner";
import { useState } from "react";

const Index = () => {
  const [isGeneratingLowQuality, setIsGeneratingLowQuality] = useState(false);
  
  const handleCreateLowQuality = async () => {
    setIsGeneratingLowQuality(true);
    toast.info("Creating low quality version...");
    
    try {
      const success = await createLowQualityVideo();
      
      if (success) {
        toast.success("Low quality video created successfully");
        // Reload the page to show the new video option
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        toast.error("Failed to create low quality video");
      }
    } catch (error) {
      toast.error("Error creating low quality video");
      console.error(error);
    } finally {
      setIsGeneratingLowQuality(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-[#F5F5F7] overflow-hidden relative">
      <div className="absolute top-20 right-10 w-60 h-60 bg-[#A2D2FF]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-[#A2D2FF]/10 rounded-full blur-3xl" />
      
      <div className="relative z-10">
        <Header />
        <main className="pt-16">
          <WelcomeSection />
        </main>
      </div>
      
      {/* Admin controls - hidden in UI but accessible via the function */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={handleCreateLowQuality}
          disabled={isGeneratingLowQuality}
          className="bg-gray-800 text-xs px-3 py-1 rounded text-white opacity-30 hover:opacity-100"
        >
          {isGeneratingLowQuality ? 'Processing...' : 'Create Low Quality Version'}
        </button>
      </div>

      <div className="relative z-10 w-full flex flex-col items-center justify-center pb-8 pt-4 text-sm text-[#86868B]">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Ship className="h-4 w-4 text-[#0066CC]" />
          <span className="font-medium text-[#1D1D1F]">Retour Maldives</span>
        </div>
        <p>© 2025 Retour Maldives - Premium Speedboat Transfers</p>
      </div>
      
      <WhatsAppButton 
        phoneNumber="+960 7443777" 
        welcomeMessage="Hello! I'm interested in booking a speedboat transfer with Retour Maldives."
      />
    </div>
  );
};

export default Index;
