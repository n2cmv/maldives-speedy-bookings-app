import { GripVertical, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PackageData } from "./hooks/usePackageManager";

interface PackageTableProps {
  packages: PackageData[];
  onEdit: (pkg: PackageData) => void;
  onDelete: (packageId: string) => void;
  onDragStart: (index: number) => void;
  onDragEnter: (index: number) => void;
  onDragEnd: () => void;
  onDragOver: (e: React.DragEvent) => void;
}

const PackageTable = ({
  packages,
  onEdit,
  onDelete,
  onDragStart,
  onDragEnter,
  onDragEnd,
  onDragOver,
}: PackageTableProps) => {
  if (packages.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No packages found. Add your first tour package!
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10"></TableHead>
          <TableHead>Image</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Price/Person</TableHead>
          <TableHead>Min Pax</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {packages.map((pkg, index) => (
          <TableRow
            key={pkg.id}
            draggable
            onDragStart={() => onDragStart(index)}
            onDragEnter={() => onDragEnter(index)}
            onDragEnd={onDragEnd}
            onDragOver={onDragOver}
            className="cursor-move"
          >
            <TableCell>
              <GripVertical className="h-4 w-4 text-gray-400" />
            </TableCell>
            <TableCell>
              {pkg.image_url ? (
                <img
                  src={pkg.image_url}
                  alt={pkg.name}
                  className="w-16 h-12 object-cover rounded"
                />
              ) : (
                <div className="w-16 h-12 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">
                  No image
                </div>
              )}
            </TableCell>
            <TableCell className="font-medium">{pkg.name}</TableCell>
            <TableCell>{pkg.duration}</TableCell>
            <TableCell>${pkg.price_per_person}</TableCell>
            <TableCell>{pkg.min_pax}</TableCell>
            <TableCell>
              <Badge variant={pkg.is_active ? "default" : "secondary"}>
                {pkg.is_active ? "Active" : "Inactive"}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(pkg)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(pkg.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PackageTable;
