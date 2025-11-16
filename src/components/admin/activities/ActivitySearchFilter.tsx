import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchBar from "../common/SearchBar";

interface ActivitySearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddActivityClick: () => void;
}

const ActivitySearchFilter = ({
  searchQuery,
  onSearchChange,
  onAddActivityClick,
}: ActivitySearchFilterProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <SearchBar
        value={searchQuery}
        onChange={onSearchChange}
        placeholder="Search activities..."
      />
      <Button onClick={onAddActivityClick}>
        <Plus className="h-4 w-4 mr-2" />
        Add Activity
      </Button>
    </div>
  );
};

export default ActivitySearchFilter;
