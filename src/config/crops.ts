
import type { Crop, CropId } from '@/types';
import { Carrot } from 'lucide-react';

// --- Carrot Images ---
import carrotSeedImg from '@/images/crops/carrot/seed.png';
import carrotHarvestedImg from '@/images/crops/carrot/harvested.png';
import carrotPlot1Img from '@/images/crops/carrot/plant1.png';
import carrotPlot2Img from '@/images/crops/carrot/plant2.png';
import carrotPlot3Img from '@/images/crops/carrot/plant3.png';
import carrotPlot4Img from '@/images/crops/carrot/plant4.png';
import carrotPlot5Img from '@/images/crops/carrot/plant5.png';

// --- Potato Images ---
import potatoSeedImg from '@/images/crops/potato/seed.png';
import potatoHarvestedImg from '@/images/crops/potato/harvested.png';
import potatoPlot1Img from '@/images/crops/potato/plant1.png';
import potatoPlot2Img from '@/images/crops/potato/plant2.png';
import potatoPlot3Img from '@/images/crops/potato/plant3.png';
import potatoPlot4Img from '@/images/crops/potato/plant4.png';
import potatoPlot5Img from '@/images/crops/potato/plant5.png';


export const CROPS_DATA: Crop[] = [
  // All other crop objects have been removed.

  {
    id: 'carrot',
    name: 'Carrot',
    growTime: 5 * 1000, // 5 seconds
    sellPrice: 2,
    seedPrice: 1,
    icon: Carrot,
    xpYield: 10, // Carrots give 10 XP per harvest
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
    tier: 1,
    seedsPerPurchase: 0.5,
    minFarmLevelForQuest: 1,
    dataAiHintFarmPlot: 'carrot plant',
  },
  {
    id: 'potato',
    name: 'Potato',
    growTime: 10 * 1000, // 10 seconds
    sellPrice: 5,
    seedPrice: 3,
    icon: Carrot, // Using Carrot as a placeholder, replace with a Potato icon if available
    xpYield: 15, // Potatoes give 15 XP per harvest
    seedShopImageUrl: potatoSeedImg,
    dataAiHintSeedShop: 'potato seedpacket',
    harvestedCropImageUrl: potatoHarvestedImg,
    dataAiHintHarvestedCrop: 'potato vegetable',
    farmPlotImageUrls: [
      potatoPlot1Img,
      potatoPlot2Img,
      potatoPlot3Img,
      potatoPlot4Img,
      potatoPlot5Img,
    ],
    tier: 1,
    seedsPerPurchase: 0.5,
    minFarmLevelForQuest: 1,
    dataAiHintFarmPlot: 'potato plant',
  },
].sort((a, b) => a.seedPrice - b.seedPrice);
