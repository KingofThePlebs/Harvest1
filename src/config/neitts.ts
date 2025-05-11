
import type { NeittType } from '@/types';
import { Smile, Ghost, Flame, Droplet, Cloud } from 'lucide-react'; // Smile is appropriate for Neitt

export const NEITTS_DATA: NeittType[] = [
  {
    id: 'green_neitt',
    name: 'Green Neitt',
    description: 'A basic, bouncy neitt. Loves to smile!',
    cost: 10,
    icon: Smile,
    color: '#4CAF50', // Green
    imageUrl: 'https://picsum.photos/seed/greenneitt/64/64',
    dataAiHint: 'green neitt',
    producesNitId: 'green_nit',
    productionTime: 35 * 1000, // 35 seconds per Nit
    productionCapacity: 5, // Produces 5 Nits per feeding cycle
  },
  {
    id: 'blue_neitt',
    name: 'Aqua Neitt',
    description: 'A cool and collected watery neitt.',
    cost: 25,
    icon: Droplet,
    color: '#2196F3', // Blue
    imageUrl: 'https://picsum.photos/seed/blueneitt/64/64',
    dataAiHint: 'blue neitt',
    producesNitId: 'blue_nit',
    productionTime: 45 * 1000, // 45 seconds per Nit
    productionCapacity: 5,
  },
  {
    id: 'red_neitt',
    name: 'Magma Neitt',
    description: 'A fiery neitt, warm to the touch!',
    cost: 50,
    icon: Flame,
    color: '#F44336', // Red
    imageUrl: 'https://picsum.photos/seed/redneitt/64/64',
    dataAiHint: 'red neitt',
    producesNitId: 'red_nit',
    productionTime: 55 * 1000, // 55 seconds per Nit
    productionCapacity: 5,
  },
  {
    id: 'purple_neitt',
    name: 'Shadow Neitt',
    description: 'A mysterious neitt that lurks in the dark.',
    cost: 75,
    icon: Ghost,
    color: '#9C27B0', // Purple
    imageUrl: 'https://picsum.photos/seed/purpleneitt/64/64',
    dataAiHint: 'purple neitt',
    producesNitId: 'purple_nit',
    productionTime: 65 * 1000, // 65 seconds per Nit
    productionCapacity: 5,
  },
  {
    id: 'yellow_neitt',
    name: 'Spark Neitt',
    description: 'An energetic neitt, full of zappy power.',
    cost: 100,
    icon: Cloud, // Using Cloud as a stand-in for electric/spark
    color: '#FFEB3B', // Yellow
    imageUrl: 'https://picsum.photos/seed/yellowneitt/64/64',
    dataAiHint: 'yellow neitt',
    producesNitId: 'yellow_nit',
    productionTime: 75 * 1000, // 75 seconds per Nit
    productionCapacity: 5,
  },
];
