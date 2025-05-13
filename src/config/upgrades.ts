import type { UpgradeDefinition } from '@/types';
import { Droplets, Award, Tag, LandPlot, PlusSquare, Home } from 'lucide-react';

export const UPGRADES_DATA: UpgradeDefinition[] = [
  {
    id: 'fertilizer',
    name: 'Super Fertilizer',
    description: 'Crops grow 20% faster.',
    cost: 100,
    icon: Droplets,
  },
  {
    id: 'negotiationSkills',
    name: 'Negotiation Skills',
    description: 'Sell crops for 15% more gold.',
    cost: 150,
    icon: Award,
  },
  {
    id: 'bulkDiscount',
    name: 'Bulk Seed Discount',
    description: 'Seeds cost 10% less.',
    cost: 75,
    icon: Tag,
  },
  {
    id: 'unlockFarm2',
    name: 'Unlock Farm 2',
    description: 'Unlocks a new farm area with 6 plots.',
    cost: 500, 
    icon: LandPlot,
    isUnlocked: (upgrades) => !upgrades.unlockFarm2, 
  },
  {
    id: 'unlockFarm3',
    name: 'Unlock Farm 3',
    description: 'Unlocks another new farm area with 6 plots.',
    cost: 2000, 
    icon: PlusSquare,
    isUnlocked: (upgrades) => upgrades.unlockFarm2 && !upgrades.unlockFarm3, 
  },
  {
    id: 'buildHouse',
    name: 'Build a House',
    description: 'Build a house for a Neitt to move into town. One Neitt will move in over time.',
    cost: 750,
    icon: Home,
    isUnlocked: (upgrades) => !upgrades.buildHouse, // Only show if not already built
  },
];
