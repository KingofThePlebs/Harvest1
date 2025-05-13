
import type { NeittType } from '@/types';
import { Smile } from 'lucide-react'; // Smile is appropriate for Neitt

export const NEITTS_DATA: NeittType[] = [
  {
    id: 'green_neitt',
    name: 'Green Neitt',
    description: 'A basic, bouncy neitt. Loves to eat carrots!',
    cost: 10,
    icon: Smile,
    color: '#4CAF50', // Green
    imageUrl: 'https://picsum.photos/seed/greenneitt/64/64',
    dataAiHint: 'green neitt',
    producesNitId: 'green_nit',
    productionTime: 35 * 1000, // 35 seconds per Nit
    minProductionCapacity: 1, 
    maxProductionCapacity: 3, 
    feedCropId: 'carrot', // Eats carrots
    neittFeedXpYield: 15, // Green Neitts give 15 XP per feed
  },
  // Other Neitts removed as per request
];
