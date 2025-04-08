
import Header from "@/components/Header";
import WelcomeSection from "@/components/WelcomeSection";
import WhatsAppButton from "@/components/WhatsAppButton";
import VideoUploader from "@/components/admin/VideoUploader";
import { Ship } from "lucide-react";
import { useState } from "react";

const Index = () => {
  const [showUploader, setShowUploader] = useState(false);
  
  const toggleUploader = () => {
    setShowUploader(prev => !prev);
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

      {/* Admin controls - normally you'd protect this with authentication */}
      <div className="fixed top-24 right-4 z-50">
        <button
          onClick={toggleUploader}
          className="bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-50 hover:opacity-100"
        >
          {showUploader ? 'Hide Video Uploader' : 'Show Video Uploader'}
        </button>
        
        {showUploader && (
          <div className="mt-2 w-64">
            <VideoUploader />
          </div>
        )}
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
