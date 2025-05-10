import type { UpgradeDefinition } from '@/types';
import { Droplets, Award, Tag, LandPlot } from 'lucide-react';

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
    id: 'expandFarm',
    name: 'Expand Farm',
    description: 'Adds 3 more plots to your farm.',
    cost: 20,
    icon: LandPlot,
  },
];
