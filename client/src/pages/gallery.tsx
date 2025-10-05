import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Masonry from "react-masonry-css";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { motion } from "framer-motion";
import { ImageMetadata } from "@shared/schema";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Heart, ThumbsUp, Laugh, ImageIcon } from "lucide-react";

export default function Gallery() {
  const [includeNSFW, setIncludeNSFW] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { data: images = [], isLoading } = useQuery<ImageMetadata[]>({
    queryKey: ["/api/gallery/images", { includeNSFW }],
    queryFn: async () => {
      const response = await fetch(`/api/gallery/images?includeNSFW=${includeNSFW}&limit=100`);
      if (!response.ok) throw new Error("Failed to fetch images");
      return response.json();
    },
  });

  const breakpointColumns = {
    default: 5,
    1536: 4,
    1280: 3,
    1024: 2,
    640: 1,
  };

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const slides = images.map(img => ({
    src: img.url,
    width: img.width,
    height: img.height,
  }));

  return (
    <div className="space-y-6">
      <motion.div
        className="flex items-start justify-between gap-6 flex-wrap"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Image Gallery</h1>
          <p className="text-sm text-muted-foreground">
            Top {images.length} images from your downloaded models, sorted by popularity
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="nsfw-toggle"
            checked={includeNSFW}
            onCheckedChange={setIncludeNSFW}
            data-testid="switch-nsfw-toggle"
          />
          <Label htmlFor="nsfw-toggle" className="cursor-pointer">
            Include NSFW
          </Label>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : images.length === 0 ? (
        <motion.div
          className="text-center py-20"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-lg font-semibold mb-2">No images yet</h3>
          <p className="text-sm text-muted-foreground">
            Download models with gallery images to see them here
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Masonry
            breakpointCols={breakpointColumns}
            className="flex -ml-4 w-auto"
            columnClassName="pl-4 bg-clip-padding"
          >
            {images.map((image, index) => (
              <motion.div
                key={image.id}
                className="mb-4 group relative cursor-pointer overflow-hidden rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.02 }}
                onClick={() => handleImageClick(index)}
                data-testid={`image-gallery-${image.id}`}
              >
                <img
                  src={image.url}
                  alt={`Gallery image ${index + 1}`}
                  className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <div className="flex items-center gap-3 text-sm">
                      {image.stats && (
                        <>
                          {image.stats.likeCount > 0 && (
                            <div className="flex items-center gap-1" data-testid={`likes-${image.id}`}>
                              <ThumbsUp className="h-4 w-4" />
                              <span>{image.stats.likeCount}</span>
                            </div>
                          )}
                          {image.stats.heartCount > 0 && (
                            <div className="flex items-center gap-1" data-testid={`hearts-${image.id}`}>
                              <Heart className="h-4 w-4" />
                              <span>{image.stats.heartCount}</span>
                            </div>
                          )}
                          {image.stats.laughCount > 0 && (
                            <div className="flex items-center gap-1" data-testid={`laughs-${image.id}`}>
                              <Laugh className="h-4 w-4" />
                              <span>{image.stats.laughCount}</span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    <div className="mt-2 text-xs opacity-75" data-testid={`score-${image.id}`}>
                      Score: {image.positiveScore}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </Masonry>
        </motion.div>
      )}

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={slides}
        index={currentImageIndex}
        data-testid="lightbox-gallery"
      />
    </div>
  );
}
