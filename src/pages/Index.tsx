
import Header from "@/components/Header";
import WelcomeSection from "@/components/WelcomeSection";
import WhatsAppButton from "@/components/WhatsAppButton";
import VideoUploader from "@/components/admin/VideoUploader";
import { Ship } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Index = () => {
  const [showUploader, setShowUploader] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const toggleUploader = () => {
    setShowUploader(prev => !prev);
  };

  const downloadAndUploadVideo = async () => {
    const videoUrl = "https://s3.filebin.net/filebin/8cfb9dca7d0f5da279678fbe7221fb4c9d197b94662fb0379d5599baee7b92fd/b9ffd799a0f82a8fdf873910d611e67ca79ec601c3a3e78478b8f64533848263";
    
    try {
      setIsDownloading(true);
      toast.info("Downloading video...");
      
      // Fetch the video from the URL
      const response = await fetch(videoUrl);
      if (!response.ok) {
        throw new Error(`Failed to download video: ${response.status}`);
      }
      
      // Get the video as a blob
      const videoBlob = await response.blob();
      
      // Create a File object from the blob
      const file = new File([videoBlob], "retourmv_hero.mp4", { type: "video/mp4" });
      
      toast.info("Uploading video to Supabase...");
      
      // Upload to Supabase with the standard name
      const { error } = await supabase.storage
        .from('videos')
        .upload('maldives-background.mp4', file, { 
          cacheControl: '3600',
          upsert: true
        });
        
      if (error) {
        throw error;
      }
      
      toast.success('Video uploaded successfully!', {
        description: 'Your new background video has been set'
      });
      
      // Reload the page to show the new video
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (error) {
      console.error("Error downloading and uploading video:", error);
      toast.error('Failed to process video', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsDownloading(false);
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

      {/* Admin controls - normally you'd protect this with authentication */}
      <div className="fixed top-24 right-4 z-50">
        <div className="flex flex-col gap-2">
          <button
            onClick={toggleUploader}
            className="bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-50 hover:opacity-100"
          >
            {showUploader ? 'Hide Video Uploader' : 'Show Video Uploader'}
          </button>
          
          <button
            onClick={downloadAndUploadVideo}
            disabled={isDownloading}
            className="bg-blue-800 text-white text-xs px-2 py-1 rounded opacity-50 hover:opacity-100 disabled:bg-gray-500"
          >
            {isDownloading ? 'Downloading...' : 'Use Sample Video'}
          </button>
        </div>
        
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
