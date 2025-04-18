
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";

interface IslandSearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onAddClick: () => void;
}

const IslandSearchBar = ({
  searchQuery,
  onSearchChange,
  onAddClick,
}: IslandSearchBarProps) => {
  return (
    <div className="flex justify-between">
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search islands..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Button onClick={onAddClick}>
        <Plus className="mr-2 h-4 w-4" /> Add Island
      </Button>
    </div>
  );
};

export default IslandSearchBar;
