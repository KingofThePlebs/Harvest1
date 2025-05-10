import type { Crop } from '@/types';
import { Carrot, Wheat, Sprout } from 'lucide-react'; // Sprout as a generic plant icon

export const CROPS_DATA: Crop[] = [
  {
    id: 'carrot',
    name: 'Carrot',
    growTime: 5 * 1000, // 5 seconds
    sellPrice: 5,
    icon: Carrot,
  },
  {
    id: 'wheat',
    name: 'Wheat',
    growTime: 10 * 1000, // 10 seconds
    sellPrice: 10,
    icon: Wheat,
  },
  {
    id: 'tomato',
    name: 'Tomato',
    growTime: 15 * 1000, // 15 seconds
    sellPrice: 15,
    imageUrl: 'https://picsum.photos/id/1080/64/64', // Specific image for tomato
    dataAiHint: 'tomato plant',
  },
  {
    id: 'potato',
    name: 'Potato',
    growTime: 8 * 1000, // 8 seconds
    sellPrice: 8,
    imageUrl: 'https://picsum.photos/id/1060/64/64', // Specific image for potato
    dataAiHint: 'potato plant',
  },
  {
    id: 'strawberry',
    name: 'Strawberry',
    growTime: 12 * 1000, // 12 seconds
    sellPrice: 12,
    icon: Sprout, // Using Sprout as a placeholder, specific icon recommended
    //imageUrl: 'https://picsum.photos/seed/strawberry/64/64',
    //dataAiHint: 'strawberry plant',
  },
];
