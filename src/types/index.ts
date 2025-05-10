import type { LucideIcon } from 'lucide-react';

export interface Crop {
  id: string;
  name: string;
  growTime: number; // in milliseconds
  sellPrice: number;
  icon?: LucideIcon;
  imageUrl?: string;
  dataAiHint?: string; 
}

export interface PlotState {
  id: string; // e.g. "plot-1", "plot-2"
  cropId?: string; // ID of the crop planted here
  plantTime?: number; // Timestamp when planted
}

export interface InventoryItem {
  cropId: string;
  quantity: number;
}
