import { useState } from "react";
import { ModelCard } from "@/components/model-card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { Model } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export default function Gallery() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: models = [] } = useQuery<Model[]>({
    queryKey: ["/api/models"],
  });

  const filteredModels = models.filter(model =>
    model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    model.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    model.baseModel.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewModel = (id: string) => {
    setLocation(`/model/${id}`);
  };

  const handleDeleteModel = async (id: string) => {
    try {
      await apiRequest("DELETE", `/api/models/${id}`);
    } catch (error) {
      console.error("Failed to delete model:", error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Model Gallery</h1>
          <p className="text-sm text-muted-foreground">
            Browse and manage your downloaded models
          </p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search models..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            data-testid="input-search-models"
          />
        </div>
      </div>

      {filteredModels.length === 0 ? (
        <div className="text-center py-20">
          <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-lg font-semibold mb-2">
            {models.length === 0 ? "No models yet" : "No models found"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {models.length === 0 
              ? "Download models from the dashboard to get started"
              : `No models match "${searchQuery}"`
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredModels.map(model => (
            <ModelCard
              key={model.id}
              model={model}
              onView={handleViewModel}
              onDelete={handleDeleteModel}
            />
          ))}
        </div>
      )}
    </div>
  );
}
