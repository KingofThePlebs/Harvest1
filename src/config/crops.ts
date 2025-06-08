
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

// --- Tomato Images ---
import tomatoSeedImg from '@/images/crops/tomato/seed.png';
import tomatoHarvestedImg from '@/images/crops/tomato/harvested.png';
import tomatoPlot1Img from '@/images/crops/tomato/plant1.png';
import tomatoPlot2Img from '@/images/crops/tomato/plant2.png';
import tomatoPlot3Img from '@/images/crops/tomato/plant3.png';
import tomatoPlot4Img from '@/images/crops/tomato/plant4.png';
import tomatoPlot5Img from '@/images/crops/tomato/plant5.png';

// --- Wheat Images ---
import wheatSeedImg from '@/images/crops/wheat/seed.png';
import wheatHarvestedImg from '@/images/crops/wheat/harvested.png';
import wheatPlot1Img from '@/images/crops/wheat/plant1.png';
import wheatPlot2Img from '@/images/crops/wheat/plant2.png';
import wheatPlot3Img from '@/images/crops/wheat/plant3.png';
import wheatPlot4Img from '@/images/crops/wheat/plant4.png';
import wheatPlot5Img from '@/images/crops/wheat/plant5.png';


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
  {
    id: 'tomato',
    name: 'Tomato',
    growTime: 12 * 1000, // 12 seconds
    sellPrice: 8,
    seedPrice: 5,
    icon: Carrot, // Replace with a Tomato icon if available
    xpYield: 20, // Tomatoes give 20 XP per harvest
    seedShopImageUrl: tomatoSeedImg,
    dataAiHintSeedShop: 'tomato seedpacket',
    harvestedCropImageUrl: tomatoHarvestedImg,
    dataAiHintHarvestedCrop: 'tomato vegetable',
    farmPlotImageUrls: [
      tomatoPlot1Img,
      tomatoPlot2Img,
      tomatoPlot3Img,
      tomatoPlot4Img,
      tomatoPlot5Img,
    ],
    tier: 2, // Assuming tomato is a higher tier crop
    seedsPerPurchase: 0.5,
    minFarmLevelForQuest: 5, // Requires a higher farm level
    dataAiHintFarmPlot: 'tomato plant',
  },
  {
    id: 'wheat',
    name: 'Wheat',
    growTime: 15 * 1000, // 7 seconds
    sellPrice: 12,
    seedPrice: 10,
    icon: Carrot, // Replace with a Wheat icon if available
    xpYield: 12, // Wheat gives 12 XP per harvest
    seedShopImageUrl: wheatSeedImg,
    dataAiHintSeedShop: 'wheat seedpacket',
    harvestedCropImageUrl: wheatHarvestedImg,
    dataAiHintHarvestedCrop: 'wheat grain',
    farmPlotImageUrls: [
      wheatPlot1Img,
      wheatPlot2Img,
      wheatPlot3Img,
      wheatPlot4Img,
      wheatPlot5Img,
    ],
    tier: 1,
    seedsPerPurchase: 0.5,
    minFarmLevelForQuest: 1,
    dataAiHintFarmPlot: 'wheat plant',},
].sort((a, b) => a.seedPrice - b.seedPrice);
