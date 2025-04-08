
import Header from "@/components/Header";
import WelcomeSection from "@/components/WelcomeSection";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Ship } from "lucide-react";

const Index = () => {
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

      <div className="relative z-10 w-full flex flex-col items-center justify-center pb-8 pt-4 text-sm text-[#86868B]">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Ship className="h-4 w-4 text-[#0066CC]" />
          <span className="font-medium text-[#1D1D1F]">Retour Maldives</span>
        </div>
        <p>© 2025 Retour Maldives - Premium Speedboat Transfers</p>
      </div>
      
      {/* WhatsApp Button - Replace the phone number with your actual WhatsApp number */}
      <WhatsAppButton 
        phoneNumber="9601234567" 
        welcomeMessage="Hello! I'm interested in booking a speedboat transfer with Retour Maldives."
      />
    </div>
  );
};

export default Index;
