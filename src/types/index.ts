import type { StaticImageData } from 'next/image';
import type { LucideIcon } from 'lucide-react';

export interface Crop {
  id: string;
  name: string;
  growTime: number; // in milliseconds
  sellPrice: number;
  seedPrice: number; // Cost to buy the seed
  icon?: LucideIcon; // For crops that use Lucide icons as a fallback
  xpYield?: number; // XP gained from harvesting this crop

  // Specific images for different contexts, now using StaticImageData
  seedShopImageUrl?: StaticImageData;
  harvestedCropImageUrl?: StaticImageData;
  farmPlotImageUrls?: StaticImageData[];

  // Corresponding AI hints for image generation (if ever used with AI image gen)
  dataAiHintSeedShop?: string;
  dataAiHintHarvestedCrop?: string;
  dataAiHintFarmPlot?: string;

  // Fallback if specific images are not provided
  imageUrl?: StaticImageData; // Deprecated, prefer specific ones
  dataAiHint?: string; // Deprecated, prefer specific ones
}

export interface PlotState {
  id: string; // e.g. "farm-1-plot-1", "farm-2-plot-1" (unique globally or at least per farm)
  cropId?: string; // ID of the crop planted here
  plantTime?: number; // Timestamp when planted
  isHarvestable?: boolean; // Added for clarity, can be derived but useful for state
}

export interface Farm {
  id: string; // e.g., "farm-1", "farm-2"
  name: string; // e.g., "Farm 1", "Farm 2"
  plots: PlotState[];
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
  unlockFarm2: boolean; // New upgrade to unlock Farm 2
  unlockFarm3: boolean; // New upgrade to unlock Farm 3
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
  isUnlocked?: (upgrades: UpgradesState) => boolean; // Optional: to control visibility/availability
}

export interface NeittType {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: LucideIcon;
  color?: string; // Optional: for styling the icon or UI elements
  imageUrl?: string | StaticImageData; // Can be URL string or StaticImageData
  dataAiHint?: string;
  producesNitId: string; // ID of the Nit this Neitt produces
  productionTime: number; // Time in milliseconds to produce one Nit
  minProductionCapacity: number; // Minimum Nits it produces per feeding cycle
  maxProductionCapacity: number; // Maximum Nits it produces per feeding cycle
  feedCropId: string; // ID of the crop this Neitt eats
  neittFeedXpYield?: number; // XP gained from feeding this Neitt
}

export interface OwnedNeitt { // Represents an individual Neitt instance
  instanceId: string; // Unique ID for this specific Neitt
  neittTypeId: string;
  lastProductionCycleStartTime: number; // Timestamp when the current *Nit's* production cycle started
  nitsLeftToProduce: number; // How many nits this Neitt will produce before needing to be fed again. 0 means hungry.
  initialNitsForCycle: number; // Total nits determined for the current feeding cycle
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

// Quest System Types
export interface QuestItemRequirement {
  type: 'crop' | 'nit';
  itemId: string; // cropId or nitId
  quantity: number;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  requirements: QuestItemRequirement[];
  rewardCurrency: number;
  timePosted: number; // Timestamp when the quest was generated/posted
}

// For defining templates from which quests can be generated
export interface QuestTemplate {
  id: string; // Unique ID for the template
  titleGenerator: (item1?: Crop | Nit, item2?: Crop | Nit) => string;
  descriptionGenerator: (qty1: number, item1?: Crop | Nit, qty2?: number, item2?: Crop | Nit) => string;
  requirementGenerator: (
    cropsData: Crop[], nitsData: Nit[],
    getEffectiveCropSellPrice: (basePrice: number) => number,
    playerFarmLevel: number // To potentially scale difficulty or item availability
  ) => { requirements: QuestItemRequirement[], reward: number } | null; // Returns null if quest cannot be generated
  // rewardMultiplier: number; // Multiplier applied to the sum of base sell prices of required items
  // minQuantity?: number;
  // maxQuantity?: number;
  // itemType: 'crop' | 'nit' | 'mixed'; // Type of item(s) this quest template uses
  // specificItemId?: string; // Optional: if the template is for a very specific item
  minFarmLevel?: number; // Minimum farm level to unlock this quest type
}
