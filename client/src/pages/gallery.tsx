import { useState } from "react";
import { ModelCard } from "@/components/model-card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { Model } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { motion, AnimatePresence } from "framer-motion";

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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="space-y-8">
      <motion.div 
        className="flex items-start justify-between gap-6 flex-wrap"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Model Gallery</h1>
          <p className="text-sm text-muted-foreground">
            Browse and manage your downloaded models
          </p>
        </div>
        <motion.div 
          className="relative w-full md:w-80"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search models..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            data-testid="input-search-models"
          />
        </motion.div>
      </motion.div>

      <AnimatePresence mode="wait">
        {filteredModels.length === 0 ? (
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
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
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {filteredModels.map((model, index) => (
              <motion.div key={model.id} variants={itemVariants}>
                <ModelCard
                  model={model}
                  onView={handleViewModel}
                  onDelete={handleDeleteModel}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
