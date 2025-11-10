
import Header from "@/components/Header";
import WelcomeSection from "@/components/WelcomeSection";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Ship, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Helmet } from "react-helmet-async";

const Index = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto'
    });
  }, [location.pathname]);

  // If user lands on homepage with transaction parameter, redirect to payment-confirmation
  useEffect(() => {
    if (location.search.includes('transaction=')) {
      navigate(`/payment-confirmation${location.search}`, {
        replace: true
      });
    }
  }, [location.search, navigate]);

  return <div className="min-h-screen bg-[#F5F5F7] overflow-hidden relative">
      <Helmet>
        <title>Visit Dhigurah | Speedboat Transfers & Whale Shark Tours in Maldives</title>
        <meta name="description" content="Visit Dhigurah Island - Book speedboat transfers from Male Airport, whale shark tours, island excursions. Best rates, expert guides, comfortable boats. Explore pristine beaches and authentic Maldivian culture." />
        <meta name="keywords" content="Visit Dhigurah, Dhigurah Island, Maldives speedboat transfers, whale shark tours, Dhigurah transfers, Maldives islands, local island tours, Dhigurah accommodation, whale shark swimming, Maldives travel" />
        <link rel="canonical" href="https://retourmaldives.com/" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Visit Dhigurah | Speedboat Transfers & Whale Shark Tours in Maldives" />
        <meta property="og:description" content="Visit Dhigurah Island - Book speedboat transfers from Male Airport, whale shark tours, island excursions. Best rates, expert guides, comfortable boats." />
        <meta property="og:url" content="https://retourmaldives.com/" />
        <meta property="og:image" content="https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=3270&auto=format&fit=crop" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Visit Dhigurah | Speedboat Transfers & Whale Shark Tours in Maldives" />
        <meta name="twitter:description" content="Visit Dhigurah Island - Book speedboat transfers from Male Airport, whale shark tours, island excursions. Best rates, expert guides, comfortable boats." />
        <meta name="twitter:image" content="https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=3270&auto=format&fit=crop" />
        
        {/* Structured Data */}
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Visit Dhigurah",
            "url": "https://retourmaldives.com",
            "logo": "https://retourmaldives.com/logo.png",
            "description": "Premier speedboat transfer and tour service to Dhigurah Island in the Maldives",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Dhigurah",
              "addressRegion": "Alif Dhaal Atoll",
              "addressCountry": "MV"
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+960-7443777",
              "contactType": "customer service"
            },
            "sameAs": [
              "https://www.facebook.com/visitdhigurah",
              "https://www.instagram.com/visitdhigurah"
            ]
          }
        `}</script>
      </Helmet>
      
      <div className="absolute top-20 right-10 w-60 h-60 bg-[#A2D2FF]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-[#A2D2FF]/10 rounded-full blur-3xl" />
      
      <div className="relative z-10">
        <Header />
        <main>
          <WelcomeSection />
        </main>
      </div>

      <div className={`relative z-10 w-full flex flex-col items-center justify-center pb-${isMobile ? '20' : '8'} pt-4 text-sm text-[#86868B]`}>
        <div className="flex items-center justify-center gap-2 mb-2">
          <Ship className="h-4 w-4 text-[#0066CC]" />
          <span className="font-medium text-[#1D1D1F]">Visit Dhigurah</span>
        </div>
        <p>© 2025 Visit Dhigurah</p>
      </div>
      
      <WhatsAppButton phoneNumber="+960 7443777" welcomeMessage="Hello! I'm interested in booking a speedboat transfer with Visit Dhigurah." />
    </div>;
};
export default Index;
