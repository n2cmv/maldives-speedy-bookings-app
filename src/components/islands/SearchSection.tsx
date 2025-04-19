
import { useState } from "react";

interface SearchSectionProps {
  onSearch: (term: string) => void;
}

const SearchSection = ({ onSearch }: SearchSectionProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div className="relative h-[50vh] overflow-hidden">
      <img 
        src="/lovable-uploads/27ce4c27-189a-4273-8543-5feed6b2ad3e.png" 
        alt="Maldives Palm Tree Beach" 
        className="w-full h-full object-cover" 
      />
      <div className="absolute inset-0 bg-black/20 flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-4 text-slate-50 md:text-6xl">
              Explore Maldives Islands
            </h1>
            <p className="text-lg md:text-xl text-white mb-8">
              Discover paradise on Earth with our comprehensive guide to the local islands of the Maldives. 
              Find your perfect island getaway.
            </p>
            
            <div className="relative max-w-lg bg-white/20 backdrop-blur-md rounded-full overflow-hidden">
              <input 
                type="text" 
                placeholder="Search islands..." 
                value={searchTerm} 
                onChange={e => handleSearch(e.target.value)} 
                className="w-full py-4 pl-6 pr-12 rounded-full bg-transparent text-white placeholder:text-white/70 focus:outline-none" 
              />
              <svg className="absolute right-5 top-4 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchSection;
