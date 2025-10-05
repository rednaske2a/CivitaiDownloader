# CivitAI Model Manager

A self-hosted web application for downloading and organizing AI models from CivitAI, with automatic ComfyUI integration.

## Project Overview

This is a full-stack TypeScript application that allows users to:
- Download models from CivitAI via URL input
- Automatically scan and import existing models from ComfyUI installation on startup
- Automatically organize models into ComfyUI's directory structure by type and base model
- Download top 100 most popular gallery images for each model with NSFW filtering
- View activation tags and model descriptions
- Manage download queue with real-time progress tracking
- Analyze storage statistics by model type and base model
- Configure CivitAI API key, ComfyUI installation path, and image download preferences

## Technology Stack

**Frontend:**
- React with TypeScript
- Wouter for routing
- TanStack Query for data fetching
- Shadcn UI components with Tailwind CSS
- WebSocket for real-time updates (with polling fallback)
- React Masonry CSS for responsive image galleries
- Yet Another React Lightbox for image viewing

**Backend:**
- Node.js with Express
- TypeScript
- In-memory storage (MemStorage)
- WebSocket Server for real-time progress updates
- CivitAI API integration
- File system operations for model downloads

## Architecture

### Storage
- Uses in-memory storage for models, download queue, and settings
- For production with real file downloads, configure a valid ComfyUI path
- Without a configured path, the app simulates downloads and tracks metadata only

### Model Scanner
- Automatically scans ComfyUI installation path on app startup
- Detects existing model files (.safetensors, .ckpt, .pt, .pth)
- Infers model type and base model from folder structure and category mappings
- Re-scans when ComfyUI path is updated in settings
- Adds pre-existing models to the app's model library

### Download Flow
1. User pastes a CivitAI model URL
2. System fetches model metadata from CivitAI API
3. Task is added to the download queue
4. Download manager processes queue (max 2 concurrent downloads)
5. Files are organized into ComfyUI folder structure:
   - LORAs: `models/loras/{BaseModel}/`
   - Checkpoints: `models/checkpoints/{BaseModel}/`
   - etc.
6. Gallery images (top 100 by popularity) are downloaded to `gallery/{ModelName}/`
7. Model metadata is stored and displayed in the gallery

### Image Download System
- Fetches images using CivitAI's /api/v1/images endpoint with pagination
- Sorts images by popularity score (likes + hearts + laughs)
- Supports NSFW filtering (configurable in settings)
- Limits to top N images per model (configurable 10-200, default 100)
- Automatically deduplicates images when merging NSFW and SFW results

### Real-Time Updates
- WebSocket connection for instant progress updates
- Automatic fallback to polling if WebSocket fails
- Updates for queue changes, progress, completions, and statistics

## Configuration

### Required Settings
1. **CivitAI API Key**: Get from https://civitai.com/user/account
   - Required for downloading models
   - Configure in Settings page

2. **ComfyUI Path**: Path to your ComfyUI installation
   - Optional: Leave empty to simulate downloads
   - Example: `C:/ComfyUI` or `/home/user/ComfyUI`
   - Must be writable

### Category Mappings
Models are organized by type and base model:
- `LORA_Illustrious` → `models/loras/Illustrious`
- `LORA_SDXL` → `models/loras/SDXL`
- `Checkpoint_SDXL` → `models/checkpoints/SDXL`
- etc.

## Key Features

### Dashboard
- Quick statistics (total models, storage, active downloads, queue length)
- URL input for adding models
- Active downloads with real-time progress

### Gallery (Image Gallery)
- Full-width responsive masonry layout displaying top 100 images from all downloaded models
- Images sorted by popularity score (likes + hearts + laughs)
- Lightbox viewer for full-screen image viewing
- NSFW content toggle filter
- Image statistics overlay on hover (likes, hearts, laughs, total score)
- Smooth animations and transitions

### Model Detail
- Full model description
- Activation tags (click to copy)
- Gallery images
- Model information (size, path, download date)
- Actions (re-download, open folder, delete)

### Queue Management
- View all queued downloads
- Drag to reorder (future feature)
- Remove individual items or clear entire queue

### Storage Statistics
- Total storage and model count
- Distribution by model type (pie charts)
- Distribution by base model
- Detailed breakdown table

### Settings
- **CivitAI API Configuration**: Manage API key for model downloads
- **ComfyUI Configuration**: Set installation path (triggers model scan when saved)
- **Image Download Preferences**:
  - Include NSFW images toggle
  - Maximum gallery images slider (10-200)
  - Auto-download images toggle
- **Category Mappings**: Customize model organization structure

## Development

### Running the Application
```bash
npm run dev
```

The app runs on port 5000 (both frontend and backend).

### Code Structure
```
client/
  src/
    components/    # Reusable UI components
    pages/         # Page components (Dashboard, Gallery, etc.)
    hooks/         # Custom hooks (WebSocket)
    lib/           # Query client, utilities
server/
  services/        # CivitAI API, Download Manager, Model Scanner
    civitai.ts     # CivitAI API integration with image fetching
    download-manager.ts  # Queue processing and file downloads
    model-scanner.ts     # Scans existing models in ComfyUI folder
  storage.ts       # In-memory storage implementation
  routes.ts        # API endpoints and WebSocket
  index.ts         # Server entry point
shared/
  schema.ts        # TypeScript types shared between frontend and backend
```

### API Endpoints
- `GET /api/settings` - Get current settings
- `POST /api/settings` - Update settings
- `GET /api/models` - List all models
- `GET /api/models/:id` - Get specific model
- `DELETE /api/models/:id` - Delete model
- `GET /api/queue` - Get download queue
- `POST /api/queue` - Add model to queue
- `DELETE /api/queue/:id` - Cancel download
- `DELETE /api/queue` - Clear queue
- `GET /api/statistics` - Get storage statistics
- `GET /api/gallery/images` - Get top gallery images (params: limit, includeNSFW)
- `WS /ws` - WebSocket for real-time updates

## Design System

See `design_guidelines.md` for complete design specifications.

Key design principles:
- Professional spacing (8px page padding, 6px grid gaps)
- Clean card-based layouts
- Generous white space
- Consistent typography hierarchy
- Subtle interactions
- Dark mode optimized

## Notes

- Storage is in-memory, data is lost on server restart (but model scanner re-imports existing models)
- For production use, configure a valid ComfyUI path to enable file downloads and model scanning
- WebSocket automatically falls back to polling if connection fails
- Download manager processes up to 2 concurrent downloads
- Image downloads are configurable (default 100 images per model)
- Model scanner runs on startup and when ComfyUI path is saved in settings
- Image fetching uses efficient pagination to minimize API calls and respects maxImages limit
