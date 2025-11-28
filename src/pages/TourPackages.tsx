import { useState, useEffect } from "react";
import Header from "@/components/Header";
import HeaderExtras from "@/components/HeaderExtras";
import { motion } from "framer-motion";
import { useScrollToTop } from "@/hooks/use-scroll-top";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import PackageCard from "@/components/packages/PackageCard";
import { Loader2 } from "lucide-react";

export interface TourPackage {
  id: string;
  name: string;
  description: string | null;
  price_per_person: number;
  duration: string;
  min_pax: number;
  inclusions: string[];
  rules: string[];
  image_url: string | null;
  gallery_images: string[];
  is_active: boolean;
  display_order: number | null;
}

const TourPackages = () => {
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useScrollToTop();

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const { data, error } = await supabase
        .from("tour_packages")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true, nullsFirst: false });

      if (error) throw error;
      setPackages(data || []);
    } catch (error) {
      console.error("Error fetching packages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <Helmet>
        <title>Tour Packages | Visit Dhigurah Maldives</title>
        <meta name="description" content="Discover curated holiday packages in the Maldives. From romantic getaways to family adventures, find the perfect package with meals, activities, and accommodations included." />
        <meta name="keywords" content="Maldives tour packages, Dhigurah holidays, couple getaway Maldives, Maldives vacation packages" />
        <link rel="canonical" href="https://retourmaldives.com/packages" />
      </Helmet>
      
      <div className="h-16 pb-safe"></div>
      
      <div className="absolute top-4 right-4 z-20">
        <HeaderExtras />
      </div>
      
      <Header />
      
      <main className="pt-24 pb-20 px-4">
        <motion.div 
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-ocean-dark mb-4">
              Tour Packages
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our curated holiday packages designed for unforgettable experiences in the Maldives. 
              Each package includes accommodations, meals, and exciting activities.
            </p>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-ocean" />
            </div>
          ) : packages.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500">No packages available at the moment. Please check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <PackageCard key={pkg.id} package={pkg} />
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default TourPackages;
