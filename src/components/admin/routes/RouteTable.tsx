
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2, Clock } from "lucide-react";
import { Route } from "./RouteForm";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface RouteTableProps {
  routes: Route[];
  onEdit: (route: Route) => void;
  onDelete: (routeId: string) => void;
}

const RouteTable = ({ routes, onEdit, onDelete }: RouteTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>From</TableHead>
            <TableHead>To</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Ferry Timings</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {routes.length > 0 ? (
            routes.map((route) => (
              <TableRow key={route.id}>
                <TableCell>{route.from_location}</TableCell>
                <TableCell>{route.to_location}</TableCell>
                <TableCell>${route.price.toFixed(2)}</TableCell>
                <TableCell>{route.duration} minutes</TableCell>
                <TableCell>
                  {route.timings && route.timings.length > 0 ? (
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {route.timings.length <= 3 ? (
                        route.timings.map((time, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" /> {time}
                          </Badge>
                        ))
                      ) : (
                        <>
                          {route.timings.slice(0, 2).map((time, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              <Clock className="h-3 w-3 mr-1" /> {time}
                            </Badge>
                          ))}
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge variant="outline" className="text-xs">
                                  +{route.timings.length - 2} more
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <div className="space-y-1">
                                  {route.timings.slice(2).map((time, index) => (
                                    <div key={index} className="flex items-center text-xs">
                                      <Clock className="h-3 w-3 mr-1" /> {time}
                                    </div>
                                  ))}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">No timings</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onEdit(route)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onDelete(route.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4">
                No routes found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default RouteTable;
