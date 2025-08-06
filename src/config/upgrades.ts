
import type { UpgradeDefinition } from '@/types';
import { Droplets, Award, Tag, LandPlot, PlusSquare } from 'lucide-react';

 
import CheapSeedImage from '../images/upgrades/CheapSeed.png';
import FertilizerImage from '../images/upgrades/Fertilizer.png';
import TraderCharmImage from '../images/upgrades/TraderCharm.png';
import BiggerFarm from '../images/upgrades/FarmUp.png';

export const UPGRADES_DATA: UpgradeDefinition[] = [

  {
    id: 'fertilizer',
    name: 'Fertilizer Tier 1',
    description: 'Crops grow 20% faster.',
    cost: 1,
    icon: FertilizerImage,
  },
  {
    id: 'fertilizer2',
    name: 'Fertilizer Tier 2',
    description: 'Crops grow 24% faster.',
    cost: 1,
    icon: FertilizerImage,
    isUnlocked: (upgrades) => upgrades.fertilizer,
  },
  {
    id: 'fertilizer3', // Keep ID consistent for logic
    name: 'Fertilizer Tier 3',
    description: 'Crops grow 50% faster.',
    cost: 10,
    icon: FertilizerImage,
    isUnlocked: (upgrades) => upgrades.fertilizer2,
  },
  {
    id: 'fertilizer4', // Keep ID consistent for logic
    name: 'Fertilizer Tier 4',
    description: 'Crops grow 50% faster.',
    cost: 10,
    icon: FertilizerImage,
    isUnlocked: (upgrades) => upgrades.fertilizer3,
  },
  {
    id: 'fertilizer5', // Keep ID consistent for logic
    name: 'Fertilizer Tier 5',
    description: 'Crops grow 50% faster.',
    cost: 10,
    icon: FertilizerImage,
    isUnlocked: (upgrades) => upgrades.fertilizer4,
  },
  {
    id: 'fertilizer6', // Keep ID consistent for logic
    name: 'Fertilizer Tier 6',
    description: 'Crops grow 50% faster.',
    cost: 10,
    icon: FertilizerImage,
    isUnlocked: (upgrades) => upgrades.fertilizer5,
  },
  {
    id: 'fertilizer7', // Keep ID consistent for logic
    name: 'Fertilizer Tier 7',
    description: 'Crops grow 50% faster.',
    cost: 10,
    icon: FertilizerImage,
    isUnlocked: (upgrades) => upgrades.fertilizer6,
  },
  {
    id: 'fertilizer8', // Keep ID consistent for logic
    name: 'Fertilizer Tier 8',
    description: 'Crops grow 50% faster.',
    cost: 10,
    icon: FertilizerImage,
    isUnlocked: (upgrades) => upgrades.fertilizer7,
  },
  {
    id: 'fertilizer9',
    name: 'Fertilizer Tier 9',
    description: 'Crops grow 50% faster.',
    cost: 10,
    icon: FertilizerImage,
    isUnlocked: (upgrades) => upgrades.fertilizer8,
  },
  {
    id: 'fertilizer10',
    name: 'Fertilizer Tier 10',
    description: 'Crops grow 50% faster.',
    cost: 10,
    icon: FertilizerImage,
    isUnlocked: (upgrades) => upgrades.fertilizer9,
  },

  {
    id: 'traderCharm',
    name: 'Trader charm Tier 1',
    description: 'Sell crops for 15% more gold.',
    cost: 1,
    icon: TraderCharmImage,
  },
  {
    id: 'traderCharm2',
    name: 'Trader charm Tier 2',
    description: 'Sell crops for 15% more gold.',
    cost: 1,
    icon: TraderCharmImage,
    isUnlocked: (upgrades) => upgrades.traderCharm,
  },
  {
    id: 'traderCharm3',
    name: 'Trader charm Tier 3',
    description: 'Sell crops for 15% more gold.',
    cost: 1,
    icon: TraderCharmImage,
    isUnlocked: (upgrades) => upgrades.traderCharm2,
  },
  {
    id: 'traderCharm4',
    name: 'Trader charm Tier 4',
    description: 'Sell crops for 15% more gold.',
    cost: 1,
    icon: TraderCharmImage,
    isUnlocked: (upgrades) => upgrades.traderCharm3,
  },
  {
    id: 'traderCharm5',
    name: 'Trader charm Tier 5',
    description: 'Sell crops for 15% more gold.',
    cost: 1,
    icon: TraderCharmImage,
    isUnlocked: (upgrades) => upgrades.traderCharm4,
  },
  {
    id: 'traderCharm6',
    name: 'Trader charm Tier 6',
    description: 'Sell crops for 15% more gold.',
    cost: 1,
    icon: TraderCharmImage,
    isUnlocked: (upgrades) => upgrades.traderCharm5,
  },
  {
    id: 'traderCharm7',
    name: 'Trader charm Tier 7',
    description: 'Sell crops for 15% more gold.',
    cost: 1,
    icon: TraderCharmImage,
    isUnlocked: (upgrades) => upgrades.traderCharm6,
  },
  {
    id: 'traderCharm8',
    name: 'Trader charm Tier 8',
    description: 'Sell crops for 15% more gold.',
    cost: 1,
    icon: TraderCharmImage,
    isUnlocked: (upgrades) => upgrades.traderCharm7,
  },
  {
    id: 'traderCharm9',
    name: 'Trader charm Tier 9',
    description: 'Sell crops for 15% more gold.',
    cost: 1,
    icon: TraderCharmImage,
    isUnlocked: (upgrades) => upgrades.traderCharm8,
  },
  {
    id: 'traderCharm10',
    name: 'Trader charm Tier 10',
    description: 'Sell crops for 15% more gold.',
    cost: 1,
    icon: TraderCharmImage,
    isUnlocked: (upgrades) => upgrades.traderCharm9,
  },

  {
    id: 'cheapSeed',
    name: 'Cheap Seeds Tier 1',
    description: 'Seeds cost 10% less.',
    cost: 1,
    icon: CheapSeedImage,
  },
  {
    id: 'cheapSeed2',
    name: 'Cheap Seeds Tier 2',
    description: 'Seeds are cheaper',
    cost: 1,
    icon: CheapSeedImage,
    isUnlocked: (upgrades) => upgrades.cheapSeed,
  },
  {
    id: 'cheapSeed3',
    name: 'Cheap Seeds Tier 3',
    description: 'Seeds are cheaper',
    cost: 1,
    icon: CheapSeedImage,
    isUnlocked: (upgrades) => upgrades.cheapSeed2,
  },
  {
    id: 'cheapSeed4',
    name: 'Cheap Seeds Tier 4',
    description: 'Seeds are cheaper',
    cost: 1,
    icon: CheapSeedImage,
    isUnlocked: (upgrades) => upgrades.cheapSeed3,
  },
  {
    id: 'cheapSeed5',
    name: 'Cheap Seeds Tier 5',
    description: 'Seeds are cheaper',
    cost: 1,
    icon: CheapSeedImage,
    isUnlocked: (upgrades) => upgrades.cheapSeed4,
  },
  {
    id: 'unlockFarm2',
    name: 'Unlock Farm 2',
    description: 'Unlocks a new farm area with 6 plots.',
    cost: 500, 
    icon: BiggerFarm,
    isUnlocked: (upgrades) => !upgrades.unlockFarm2, 
  },
  {
    id: 'unlockFarm3',
    name: 'Unlock Farm 3',
    description: 'Unlocks another new farm area with 6 plots.',
    cost: 2000, 
    icon: BiggerFarm,
    isUnlocked: (upgrades) => upgrades.unlockFarm2 && !upgrades.unlockFarm3, 
  },
];
