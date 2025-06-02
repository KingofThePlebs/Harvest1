
import type { Nit } from '@/types';
import { Gem } from 'lucide-react'; // Using Gem as a generic icon for Nits

export const NITS_DATA: Nit[] = [
  {
    id: 'green_nit',
    name: 'Green Nit',
    sellPrice: 1,
    icon: Gem,
    // imageUrl: undefined, // Explicitly undefined or remove if no image is available
    dataAiHint: 'green gem',
    minFarmLevelForQuest: 2, // Added for quest availability
  },
  // Other Nits (blue, red, purple, yellow) have been removed 
  // as only green_neitt exists and produces green_nit.
];
