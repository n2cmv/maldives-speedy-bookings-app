
import React from "react";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/admin/common/SearchBar";
import { Plus } from "lucide-react";

interface RouteSearchFilterProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onAddRouteClick: () => void;
}

const RouteSearchFilter = ({
  searchQuery,
  onSearchChange,
  onAddRouteClick,
}: RouteSearchFilterProps) => {
  return (
    <div className="flex justify-between">
      <SearchBar 
        placeholder="Search routes..."
        value={searchQuery}
        onChange={onSearchChange}
      />
      <Button onClick={onAddRouteClick}>
        <Plus className="mr-2 h-4 w-4" /> Add Route
      </Button>
    </div>
  );
};

export default RouteSearchFilter;
