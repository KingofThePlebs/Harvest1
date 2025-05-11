
import type { StaticImageData } from 'next/image';
import type { LucideIcon } from 'lucide-react';

export interface Crop {
  id: string;
  name: string;
  growTime: number; // in milliseconds
  sellPrice: number;
  seedPrice: number; // Cost to buy the seed
  icon?: LucideIcon; // For crops that use Lucide icons as a fallback

  // Specific images for different contexts, now using StaticImageData
  seedShopImageUrl?: StaticImageData; 
  harvestedCropImageUrl?: StaticImageData; 
  farmPlotImageUrls?: StaticImageData[]; 
  
  // Corresponding AI hints for image generation (if ever used with AI image gen)
  dataAiHintSeedShop?: string; 
  dataAiHintHarvestedCrop?: string; 
  dataAiHintFarmPlot?: string; 

  // Fallback if specific images are not provided
  imageUrl?: StaticImageData; // Changed from string
  dataAiHint?: string; 
}

export interface PlotState {
  id: string; // e.g. "plot-1", "plot-2"
  cropId?: string; // ID of the crop planted here
  plantTime?: number; // Timestamp when planted
  isHarvestable?: boolean; // Added for clarity, can be derived but useful for state
}

export interface InventoryItem {
  cropId: string;
  quantity: number;
}

// Defines the state of all upgrades in the game
export interface UpgradesState {
  fertilizer: boolean;
  negotiationSkills: boolean;
  bulkDiscount: boolean;
  expandFarm: boolean; // New upgrade for more plots
}

// Defines the possible IDs for upgrades, derived from UpgradesState keys
export type UpgradeId = keyof UpgradesState;

// Defines the structure for an upgrade's static data
export interface UpgradeDefinition {
  id: UpgradeId;
  name: string;
  description: string;
  cost: number;
  icon: LucideIcon;
}
