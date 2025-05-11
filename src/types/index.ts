
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

export interface NeittType {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: LucideIcon;
  color?: string; // Optional: for styling the icon or UI elements
  imageUrl?: string; 
  dataAiHint?: string;
  producesNitId: string; // ID of the Nit this Neitt produces
  productionTime: number; // Time in milliseconds to produce one Nit
  productionCapacity: number; // How many Nits it produces per feeding cycle (e.g., 5)
}

export interface OwnedNeitt { // Represents an individual Neitt instance
  instanceId: string; // Unique ID for this specific Neitt
  neittTypeId: string;
  lastProductionCycleStartTime: number; // Timestamp when the current *Nit's* production cycle started
  nitsLeftToProduce: number; // How many nits this Neitt will produce before needing to be fed again. 0 means hungry.
}

export interface Nit {
  id: string;
  name: string;
  sellPrice: number;
  icon?: LucideIcon; // Optional icon for the Nit
  imageUrl?: StaticImageData; // Optional image for the Nit
  dataAiHint?: string;
}

export interface OwnedNit {
  nitId: string;
  quantity: number;
}
