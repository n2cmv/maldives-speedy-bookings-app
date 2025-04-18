
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Island } from "@/types/island";

interface IslandTableProps {
  islands: Island[];
  onEdit: (island: Island) => void;
  onDelete: (id: string) => void;
}

const IslandTable = ({ islands, onEdit, onDelete }: IslandTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Image URL</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {islands.length > 0 ? (
            islands.map((island) => (
              <TableRow key={island.id}>
                <TableCell className="font-medium">{island.name}</TableCell>
                <TableCell className="max-w-xs truncate">
                  {island.description}
                </TableCell>
                <TableCell className="max-w-xs truncate">
                  {island.image_url || "N/A"}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onEdit(island)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onDelete(island.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4">
                No islands found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default IslandTable;
