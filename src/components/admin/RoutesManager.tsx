
import React, { useState } from "react";
import { toast } from "sonner";
import RouteSearchFilter from "./routes/RouteSearchFilter";
import RouteTable from "./routes/RouteTable";
import RouteFormDialog from "./routes/RouteFormDialog";
import DeleteRouteDialog from "./routes/DeleteRouteDialog";
import LoadingSpinner from "./common/LoadingSpinner";
import { useRouteManager } from "./routes/hooks/useRouteManager";
import { Route, RouteFormValues } from "./routes/RouteForm";

const RoutesManager = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isRouteFormOpen, setIsRouteFormOpen] = useState<boolean>(false);
  const [currentRoute, setCurrentRoute] = useState<Route | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [routeToDelete, setRouteToDelete] = useState<string | null>(null);
  
  const {
    routes,
    isLoading,
    isSaving,
    handleDragStart,
    handleDragEnter,
    handleDragEnd,
    handleDragOver,
    handleDeleteRoute,
    handleSaveRoute
  } = useRouteManager();

  const handleEdit = (route: Route) => {
    setCurrentRoute(route);
    setIsRouteFormOpen(true);
  };

  const handleDelete = async () => {
    if (!routeToDelete) return;
    
    const success = await handleDeleteRoute(routeToDelete);
    if (success) {
      setIsDeleteDialogOpen(false);
      setRouteToDelete(null);
    }
  };

  const handleSaveRouteForm = async (values: RouteFormValues) => {
    const success = await handleSaveRoute(values, currentRoute);
    if (success) {
      setIsRouteFormOpen(false);
      setCurrentRoute(null);
    }
  };

  const filteredRoutes = routes.filter(route => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      route.from_location.toLowerCase().includes(query) ||
      route.to_location.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-4">
      <RouteSearchFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddRouteClick={() => {
          setCurrentRoute(null);
          setIsRouteFormOpen(true);
        }}
      />

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <RouteTable 
          routes={filteredRoutes} 
          onEdit={handleEdit} 
          onDelete={(routeId) => {
            setRouteToDelete(routeId);
            setIsDeleteDialogOpen(true);
          }}
          onDragStart={handleDragStart}
          onDragEnter={handleDragEnter}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
        />
      )}

      {isSaving && (
        <LoadingSpinner message="Saving route order..." fullScreen />
      )}

      <RouteFormDialog
        isOpen={isRouteFormOpen}
        onOpenChange={setIsRouteFormOpen}
        currentRoute={currentRoute}
        onSave={handleSaveRouteForm}
        onCancel={() => {
          setIsRouteFormOpen(false);
          setCurrentRoute(null);
        }}
      />

      <DeleteRouteDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default RoutesManager;
