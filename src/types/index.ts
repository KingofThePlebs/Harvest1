
import type { LucideIcon } from 'lucide-react';

export interface Crop {
  id: string;
  name: string;
  growTime: number; // in milliseconds
  sellPrice: number;
  seedPrice: number; // Cost to buy the seed
  icon?: LucideIcon; // For crops that use Lucide icons

  // Specific images for different contexts
  seedShopImageUrl?: string; // Image shown in the seed shop AND in "My Seeds" inventory (e.g., seed packet)
  harvestedCropImageUrl?: string; // Image shown in sell market inventory (e.g., the harvested crop)
  farmPlotImageUrls?: string[]; // Array of 5 image URLs for growth stages on the farm plot
  
  // Corresponding AI hints for image generation
  dataAiHintSeedShop?: string; // For seed packet/bag
  dataAiHintHarvestedCrop?: string; // For harvested crop
  dataAiHintFarmPlot?: string; // General hint for the growing plant across stages

  // Fallback if specific images are not provided (less preferred now)
  imageUrl?: string; 
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

