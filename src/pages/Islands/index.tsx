
import { useState, useEffect } from "react";
import { useScrollToTop } from "@/hooks/use-scroll-top";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { Island, mapDatabaseIslandToIslandType } from "@/types/island";
import { useToast } from "@/hooks/use-toast";
import SearchSection from "@/components/islands/SearchSection";
import FeaturedIslands from "@/components/islands/FeaturedIslands";
import WhyVisitSection from "@/components/islands/WhyVisitSection";

const Islands = () => {
  useScrollToTop();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [islands, setIslands] = useState<Island[]>([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchIslands = async () => {
      try {
        const { data, error } = await supabase.from('islands').select('*').order('name');
        if (error) throw error;
        
        const mappedIslands = data ? data.map(island => mapDatabaseIslandToIslandType(island)) : [];
        setIslands(mappedIslands);
      } catch (error) {
        console.error('Error fetching islands:', error);
        toast({
          title: "Error",
          description: "Unable to fetch islands. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchIslands();

    const channel = supabase.channel('public:islands').on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'islands'
    }, payload => {
      switch (payload.eventType) {
        case 'INSERT':
          setIslands(prev => [...prev, mapDatabaseIslandToIslandType(payload.new as any)]);
          break;
        case 'UPDATE':
          setIslands(prev => prev.map(island => 
            island.id === payload.new.id ? mapDatabaseIslandToIslandType(payload.new as any) : island
          ));
          break;
        case 'DELETE':
          setIslands(prev => prev.filter(island => island.id !== payload.old.id));
          break;
      }
    }).subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  const filteredIslands = islands.filter(island => {
    if (!searchTerm) return true;
    const query = searchTerm.toLowerCase();
    return island.name?.toLowerCase().includes(query) || island.description?.toLowerCase().includes(query);
  });

  const paginatedIslands = filteredIslands.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(filteredIslands.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="h-16 pb-safe"></div>
      
      <SearchSection onSearch={setSearchTerm} />
      
      <main className="container mx-auto px-4 py-16 max-w-6xl">
        <FeaturedIslands 
          islands={paginatedIslands}
          isLoading={isLoading}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
        
        <WhyVisitSection />
      </main>
    </div>
  );
};

export default Islands;
