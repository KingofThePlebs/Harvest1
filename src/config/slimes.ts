
import type { SlimeType } from '@/types';
import { Smile, Ghost, Flame, Droplet, Cloud } from 'lucide-react';

export const SLIMES_DATA: SlimeType[] = [
  {
    id: 'green_slime',
    name: 'Green Slime',
    description: 'A basic, bouncy slime. Loves to smile!',
    cost: 10,
    icon: Smile,
    color: '#4CAF50', // Green
    imageUrl: 'https://picsum.photos/seed/greenslime/64/64',
    dataAiHint: 'green slime',
  },
  {
    id: 'blue_slime',
    name: 'Aqua Slime',
    description: 'A cool and collected watery slime.',
    cost: 25,
    icon: Droplet,
    color: '#2196F3', // Blue
    imageUrl: 'https://picsum.photos/seed/blueslime/64/64',
    dataAiHint: 'blue slime',
  },
  {
    id: 'red_slime',
    name: 'Magma Slime',
    description: 'A fiery slime, warm to the touch!',
    cost: 50,
    icon: Flame,
    color: '#F44336', // Red
    imageUrl: 'https://picsum.photos/seed/redslime/64/64',
    dataAiHint: 'red slime',
  },
  {
    id: 'purple_slime',
    name: 'Shadow Slime',
    description: 'A mysterious slime that lurks in the dark.',
    cost: 75,
    icon: Ghost,
    color: '#9C27B0', // Purple
    imageUrl: 'https://picsum.photos/seed/purpleslime/64/64',
    dataAiHint: 'purple slime',
  },
  {
    id: 'yellow_slime',
    name: 'Spark Slime',
    description: 'An energetic slime, full of zappy power.',
    cost: 100,
    icon: Cloud, // Using Cloud as a stand-in for electric/spark
    color: '#FFEB3B', // Yellow
    imageUrl: 'https://picsum.photos/seed/yellowslime/64/64',
    dataAiHint: 'yellow slime',
  },
];
