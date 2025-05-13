import type { ProductionBuildingType } from '@/types';
import { Factory } from 'lucide-react';

export const PRODUCTION_BUILDING_TYPES_DATA: ProductionBuildingType[] = [
  {
    id: 'factory_basic',
    name: 'Basic Factory',
    description: 'A simple factory where Neitts can be assigned to work. (Further functionality to be added)',
    cost: 1000,
    icon: Factory,
    capacity: 2, // Example: Basic factory can hold 2 Neitts
  },
  // Add more factory/production building types here later
];
