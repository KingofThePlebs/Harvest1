
import type { Nit } from '@/types';
import { Gem } from 'lucide-react'; // Using Gem as a generic icon for Nits

// Placeholder images - replace with actual StaticImageData imports if available
// import greenNitImg from '@/images/nits/green_nit.png';
// import blueNitImg from '@/images/nits/blue_nit.png';
// etc.

export const NITS_DATA: Nit[] = [
  { 
    id: 'green_nit', 
    name: 'Green Nit', 
    sellPrice: 2, 
    icon: Gem, 
    // imageUrl: greenNitImg, 
    dataAiHint: 'green gem' 
  },
  { 
    id: 'blue_nit', 
    name: 'Aqua Nit', 
    sellPrice: 5, 
    icon: Gem, 
    // imageUrl: blueNitImg, 
    dataAiHint: 'blue gem' 
  },
  { 
    id: 'red_nit', 
    name: 'Magma Nit', 
    sellPrice: 10, 
    icon: Gem, 
    // imageUrl: redNitImg, 
    dataAiHint: 'red gem' 
  },
  { 
    id: 'purple_nit', 
    name: 'Shadow Nit', 
    sellPrice: 15, 
    icon: Gem, 
    // imageUrl: purpleNitImg, 
    dataAiHint: 'purple gem' 
  },
  { 
    id: 'yellow_nit', 
    name: 'Spark Nit', 
    sellPrice: 20, 
    icon: Gem, 
    // imageUrl: yellowNitImg, 
    dataAiHint: 'yellow gem' 
  },
];
