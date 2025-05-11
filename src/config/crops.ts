
import type { Crop } from '@/types';
import { Carrot } from 'lucide-react'; // Lucide icons can still be fallbacks

// --- Carrot Images ---
import carrotSeedImg from '@/images/crops/carrot/seed.png';
import carrotHarvestedImg from '@/images/crops/carrot/harvested.png';
import carrotPlot1Img from '@/images/crops/carrot/plant1.png';
import carrotPlot2Img from '@/images/crops/carrot/plant2.png';
import carrotPlot3Img from '@/images/crops/carrot/plant3.png';
import carrotPlot4Img from '@/images/crops/carrot/plant4.png';
import carrotPlot5Img from '@/images/crops/carrot/plant5.png';

// Radish Images - Removed
// Wheat Images - Removed
// Potato Images - Removed
// Onion Images - Removed
// Tomato Images - Removed
// Broccoli Images - Removed
// Cucumber Images - Removed
// Garlic Images - Removed
// Strawberry Images - Removed
// Bell Pepper Images - Removed
// Corn Images - Removed
// Cabbage Images - Removed
// Eggplant Images - Removed
// Pumpkin Images - Removed


export const CROPS_DATA: Crop[] = [
  {
    id: 'carrot',
    name: 'Carrot',
    growTime: 5 * 1000, // 5 seconds
    sellPrice: 5,
    seedPrice: 1,
    icon: Carrot,
    seedShopImageUrl: carrotSeedImg, 
    dataAiHintSeedShop: 'carrot seedpacket',
    harvestedCropImageUrl: carrotHarvestedImg, 
    dataAiHintHarvestedCrop: 'carrot vegetable',
    farmPlotImageUrls: [
      carrotPlot1Img,
      carrotPlot2Img,
      carrotPlot3Img,
      carrotPlot4Img,
      carrotPlot5Img,
    ],
    dataAiHintFarmPlot: 'carrot plant',
  },
  // All other crop objects have been removed.
].sort((a, b) => a.seedPrice - b.seedPrice);
