
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { motion } from 'framer-motion';
import { Anchor, Ship } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Route {
  from_location: string;
  to_location: string;
  price: number;
  duration: number;
}

const SpeedboatRoutes = () => {
  const [popularRoutes, setPopularRoutes] = useState<Route[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPopularRoutes() {
      try {
        const { data, error } = await supabase
          .from('routes')
          .select('from_location, to_location, price, duration')
          .order('display_order', { ascending: true })
          .limit(8);

        if (error) {
          throw error;
        }

        if (data) {
          setPopularRoutes(data);
        }
      } catch (error) {
        console.error('Error fetching popular routes:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPopularRoutes();
  }, []);

  const handleSelectRoute = (from: string, to: string) => {
    navigate(`/booking?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
  };

  if (isLoading) {
    return (
      <div className="py-12 px-4 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">Popular Speedboat Routes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="h-32 bg-gray-100 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl font-bold text-center mb-2">Popular Speedboat Routes</h2>
        <p className="text-gray-600 text-center mb-8">Book your transfer to these destinations</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularRoutes.map((route, index) => (
            <motion.div
              key={`${route.from_location}-${route.to_location}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleSelectRoute(route.from_location, route.to_location)}
            >
              <div className="bg-gradient-to-r from-[#0AB3B8]/80 to-[#005C99]/80 p-4 text-white">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{route.from_location}</h3>
                    <div className="flex items-center text-xs">
                      <Anchor className="h-3 w-3 mr-1" />
                      <span>to</span>
                    </div>
                    <h3 className="font-medium">{route.to_location}</h3>
                  </div>
                  <Ship className="h-10 w-10 opacity-70" />
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Price</p>
                    <p className="font-bold text-[#005C99]">${route.price}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-medium">{route.duration} min</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <button 
            onClick={() => navigate('/booking')}
            className="bg-[#0066CC] hover:bg-[#004C99] text-white px-6 py-3 rounded-full transition-colors shadow-md"
          >
            View All Routes
          </button>
        </div>
      </motion.div>
    </section>
  );
};

export default SpeedboatRoutes;
