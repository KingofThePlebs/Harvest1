
import type { Crop } from '@/types';
import { Carrot, Wheat } from 'lucide-react'; // Lucide icons can still be fallbacks

// --- Carrot Images ---
import carrotSeedImg from '@/images/crops/carrot/seed.png';
import carrotHarvestedImg from '@/images/crops/carrot/harvested.png';
import carrotPlot1Img from '@/images/crops/carrot/plot_stage_1.png';
import carrotPlot2Img from '@/images/crops/carrot/plot_stage_2.png';
import carrotPlot3Img from '@/images/crops/carrot/plot_stage_3.png';
import carrotPlot4Img from '@/images/crops/carrot/plot_stage_4.png';
import carrotPlot5Img from '@/images/crops/carrot/plot_stage_5.png';

// --- Radish Images ---
import radishSeedImg from '@/images/crops/radish/seed.png';
import radishHarvestedImg from '@/images/crops/radish/harvested.png';
import radishPlot1Img from '@/images/crops/radish/plot_stage_1.png';
import radishPlot2Img from '@/images/crops/radish/plot_stage_2.png';
import radishPlot3Img from '@/images/crops/radish/plot_stage_3.png';
import radishPlot4Img from '@/images/crops/radish/plot_stage_4.png';
import radishPlot5Img from '@/images/crops/radish/plot_stage_5.png';

// --- Wheat Images ---
import wheatSeedImg from '@/images/crops/wheat/seed.png';
import wheatHarvestedImg from '@/images/crops/wheat/harvested.png';
import wheatPlot1Img from '@/images/crops/wheat/plot_stage_1.png';
import wheatPlot2Img from '@/images/crops/wheat/plot_stage_2.png';
import wheatPlot3Img from '@/images/crops/wheat/plot_stage_3.png';
import wheatPlot4Img from '@/images/crops/wheat/plot_stage_4.png';
import wheatPlot5Img from '@/images/crops/wheat/plot_stage_5.png';

// --- Potato Images ---
import potatoSeedImg from '@/images/crops/potato/seed.png';
import potatoHarvestedImg from '@/images/crops/potato/harvested.png';
import potatoPlot1Img from '@/images/crops/potato/plot_stage_1.png';
import potatoPlot2Img from '@/images/crops/potato/plot_stage_2.png';
import potatoPlot3Img from '@/images/crops/potato/plot_stage_3.png';
import potatoPlot4Img from '@/images/crops/potato/plot_stage_4.png';
import potatoPlot5Img from '@/images/crops/potato/plot_stage_5.png';

// --- Onion Images ---
import onionSeedImg from '@/images/crops/onion/seed.png';
import onionHarvestedImg from '@/images/crops/onion/harvested.png';
import onionPlot1Img from '@/images/crops/onion/plot_stage_1.png';
import onionPlot2Img from '@/images/crops/onion/plot_stage_2.png';
import onionPlot3Img from '@/images/crops/onion/plot_stage_3.png';
import onionPlot4Img from '@/images/crops/onion/plot_stage_4.png';
import onionPlot5Img from '@/images/crops/onion/plot_stage_5.png';

// --- Tomato Images ---
import tomatoSeedImg from '@/images/crops/tomato/seed.png';
import tomatoHarvestedImg from '@/images/crops/tomato/harvested.png';
import tomatoPlot1Img from '@/images/crops/tomato/plot_stage_1.png';
import tomatoPlot2Img from '@/images/crops/tomato/plot_stage_2.png';
import tomatoPlot3Img from '@/images/crops/tomato/plot_stage_3.png';
import tomatoPlot4Img from '@/images/crops/tomato/plot_stage_4.png';
import tomatoPlot5Img from '@/images/crops/tomato/plot_stage_5.png';

// --- Broccoli Images ---
import broccoliSeedImg from '@/images/crops/broccoli/seed.png';
import broccoliHarvestedImg from '@/images/crops/broccoli/harvested.png';
import broccoliPlot1Img from '@/images/crops/broccoli/plot_stage_1.png';
import broccoliPlot2Img from '@/images/crops/broccoli/plot_stage_2.png';
import broccoliPlot3Img from '@/images/crops/broccoli/plot_stage_3.png';
import broccoliPlot4Img from '@/images/crops/broccoli/plot_stage_4.png';
import broccoliPlot5Img from '@/images/crops/broccoli/plot_stage_5.png';

// --- Cucumber Images ---
import cucumberSeedImg from '@/images/crops/cucumber/seed.png';
import cucumberHarvestedImg from '@/images/crops/cucumber/harvested.png';
import cucumberPlot1Img from '@/images/crops/cucumber/plot_stage_1.png';
import cucumberPlot2Img from '@/images/crops/cucumber/plot_stage_2.png';
import cucumberPlot3Img from '@/images/crops/cucumber/plot_stage_3.png';
import cucumberPlot4Img from '@/images/crops/cucumber/plot_stage_4.png';
import cucumberPlot5Img from '@/images/crops/cucumber/plot_stage_5.png';

// --- Garlic Images ---
import garlicSeedImg from '@/images/crops/garlic/seed.png';
import garlicHarvestedImg from '@/images/crops/garlic/harvested.png';
import garlicPlot1Img from '@/images/crops/garlic/plot_stage_1.png';
import garlicPlot2Img from '@/images/crops/garlic/plot_stage_2.png';
import garlicPlot3Img from '@/images/crops/garlic/plot_stage_3.png';
import garlicPlot4Img from '@/images/crops/garlic/plot_stage_4.png';
import garlicPlot5Img from '@/images/crops/garlic/plot_stage_5.png';

// --- Strawberry Images ---
import strawberrySeedImg from '@/images/crops/strawberry/seed.png';
import strawberryHarvestedImg from '@/images/crops/strawberry/harvested.png';
import strawberryPlot1Img from '@/images/crops/strawberry/plot_stage_1.png';
import strawberryPlot2Img from '@/images/crops/strawberry/plot_stage_2.png';
import strawberryPlot3Img from '@/images/crops/strawberry/plot_stage_3.png';
import strawberryPlot4Img from '@/images/crops/strawberry/plot_stage_4.png';
import strawberryPlot5Img from '@/images/crops/strawberry/plot_stage_5.png';

// --- Bell Pepper Images ---
// import bellPepperSeedImg from '@/images/crops/bellPepper/seed.png'; // Removed due to Module Not Found
// import bellPepperHarvestedImg from '@/images/crops/bellPepper/harvested.png'; // Removed due to Module Not Found
// import bellPepperPlot1Img from '@/images/crops/bellPepper/plot_stage_1.png'; // Removed due to Module Not Found
// import bellPepperPlot2Img from '@/images/crops/bellPepper/plot_stage_2.png'; // Removed due to Module Not Found
// import bellPepperPlot3Img from '@/images/crops/bellPepper/plot_stage_3.png'; // Removed due to Module Not Found
// import bellPepperPlot4Img from '@/images/crops/bellPepper/plot_stage_4.png'; // Removed due to Module Not Found
// import bellPepperPlot5Img from '@/images/crops/bellPepper/plot_stage_5.png'; // Removed due to Module Not Found

// --- Corn Images ---
import cornSeedImg from '@/images/crops/corn/seed.png';
import cornHarvestedImg from '@/images/crops/corn/harvested.png';
import cornPlot1Img from '@/images/crops/corn/plot_stage_1.png';
import cornPlot2Img from '@/images/crops/corn/plot_stage_2.png';
import cornPlot3Img from '@/images/crops/corn/plot_stage_3.png';
import cornPlot4Img from '@/images/crops/corn/plot_stage_4.png';
import cornPlot5Img from '@/images/crops/corn/plot_stage_5.png';

// --- Cabbage Images ---
import cabbageSeedImg from '@/images/crops/cabbage/seed.png';
import cabbageHarvestedImg from '@/images/crops/cabbage/harvested.png';
import cabbagePlot1Img from '@/images/crops/cabbage/plot_stage_1.png';
import cabbagePlot2Img from '@/images/crops/cabbage/plot_stage_2.png';
import cabbagePlot3Img from '@/images/crops/cabbage/plot_stage_3.png';
import cabbagePlot4Img from '@/images/crops/cabbage/plot_stage_4.png';
import cabbagePlot5Img from '@/images/crops/cabbage/plot_stage_5.png';

// --- Eggplant Images ---
import eggplantSeedImg from '@/images/crops/eggplant/seed.png';
import eggplantHarvestedImg from '@/images/crops/eggplant/harvested.png';
import eggplantPlot1Img from '@/images/crops/eggplant/plot_stage_1.png';
import eggplantPlot2Img from '@/images/crops/eggplant/plot_stage_2.png';
import eggplantPlot3Img from '@/images/crops/eggplant/plot_stage_3.png';
import eggplantPlot4Img from '@/images/crops/eggplant/plot_stage_4.png';
import eggplantPlot5Img from '@/images/crops/eggplant/plot_stage_5.png';

// --- Pumpkin Images ---
import pumpkinSeedImg from '@/images/crops/pumpkin/seed.png';
import pumpkinHarvestedImg from '@/images/crops/pumpkin/harvested.png';
import pumpkinPlot1Img from '@/images/crops/pumpkin/plot_stage_1.png';
import pumpkinPlot2Img from '@/images/crops/pumpkin/plot_stage_2.png';
import pumpkinPlot3Img from '@/images/crops/pumpkin/plot_stage_3.png';
import pumpkinPlot4Img from '@/images/crops/pumpkin/plot_stage_4.png';
import pumpkinPlot5Img from '@/images/crops/pumpkin/plot_stage_5.png';


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
  {
    id: 'radish',
    name: 'Radish',
    growTime: 6 * 1000,
    sellPrice: 7,
    seedPrice: 1,
    seedShopImageUrl: radishSeedImg, 
    dataAiHintSeedShop: 'radish seedpacket',
    harvestedCropImageUrl: radishHarvestedImg, 
    dataAiHintHarvestedCrop: 'radish vegetable',
    farmPlotImageUrls: [
      radishPlot1Img,
      radishPlot2Img,
      radishPlot3Img,
      radishPlot4Img,
      radishPlot5Img,
    ],
    dataAiHintFarmPlot: 'radish plant',
  },
  {
    id: 'wheat',
    name: 'Wheat',
    growTime: 10 * 1000, // 10 seconds
    sellPrice: 10,
    seedPrice: 2,
    icon: Wheat,
    seedShopImageUrl: wheatSeedImg, 
    dataAiHintSeedShop: 'wheat seedbag',
    harvestedCropImageUrl: wheatHarvestedImg, 
    dataAiHintHarvestedCrop: 'wheat sheaf',
    farmPlotImageUrls: [
      wheatPlot1Img,
      wheatPlot2Img,
      wheatPlot3Img,
      wheatPlot4Img,
      wheatPlot5Img,
    ],
    dataAiHintFarmPlot: 'wheat stalk',
  },
  {
    id: 'potato',
    name: 'Potato',
    growTime: 8 * 1000, // 8 seconds
    sellPrice: 8,
    seedPrice: 2,
    seedShopImageUrl: potatoSeedImg, 
    dataAiHintSeedShop: 'potato seedbag',
    harvestedCropImageUrl: potatoHarvestedImg, 
    dataAiHintHarvestedCrop: 'potato vegetable',
    farmPlotImageUrls: [
      potatoPlot1Img,
      potatoPlot2Img,
      potatoPlot3Img,
      potatoPlot4Img,
      potatoPlot5Img,
    ],
    dataAiHintFarmPlot: 'potato plant',
  },
  {
    id: 'onion',
    name: 'Onion',
    growTime: 10 * 1000,
    sellPrice: 9,
    seedPrice: 2,
    seedShopImageUrl: onionSeedImg, 
    dataAiHintSeedShop: 'onion sets',
    harvestedCropImageUrl: onionHarvestedImg, 
    dataAiHintHarvestedCrop: 'onion bulb',
    farmPlotImageUrls: [
      onionPlot1Img,
      onionPlot2Img,
      onionPlot3Img,
      onionPlot4Img,
      onionPlot5Img,
    ],
    dataAiHintFarmPlot: 'onion plant',
  },
  {
    id: 'tomato',
    name: 'Tomato',
    growTime: 15 * 1000, // 15 seconds
    sellPrice: 15,
    seedPrice: 3,
    seedShopImageUrl: tomatoSeedImg, 
    dataAiHintSeedShop: 'tomato seedpacket',
    harvestedCropImageUrl: tomatoHarvestedImg,  
    dataAiHintHarvestedCrop: 'tomato fruit',
    farmPlotImageUrls: [
      tomatoPlot1Img,
      tomatoPlot2Img,
      tomatoPlot3Img,
      tomatoPlot4Img,
      tomatoPlot5Img,
    ],
    dataAiHintFarmPlot: 'tomato plant',
  },
  {
    id: 'broccoli',
    name: 'Broccoli',
    growTime: 16 * 1000,
    sellPrice: 18,
    seedPrice: 3,
    seedShopImageUrl: broccoliSeedImg, 
    dataAiHintSeedShop: 'broccoli seeds',
    harvestedCropImageUrl: broccoliHarvestedImg, 
    dataAiHintHarvestedCrop: 'broccoli floret',
    farmPlotImageUrls: [
      broccoliPlot1Img,
      broccoliPlot2Img,
      broccoliPlot3Img,
      broccoliPlot4Img,
      broccoliPlot5Img,
    ],
    dataAiHintFarmPlot: 'broccoli plant',
  },
  {
    id: 'cucumber',
    name: 'Cucumber',
    growTime: 14 * 1000,
    sellPrice: 16,
    seedPrice: 3,
    seedShopImageUrl: cucumberSeedImg, 
    dataAiHintSeedShop: 'cucumber seedpacket',
    harvestedCropImageUrl: cucumberHarvestedImg, 
    dataAiHintHarvestedCrop: 'cucumber fruit',
    farmPlotImageUrls: [
      cucumberPlot1Img,
      cucumberPlot2Img,
      cucumberPlot3Img,
      cucumberPlot4Img,
      cucumberPlot5Img,
    ],
    dataAiHintFarmPlot: 'cucumber plant',
  },
  {
    id: 'garlic',
    name: 'Garlic',
    growTime: 12 * 1000,
    sellPrice: 11,
    seedPrice: 3,
    seedShopImageUrl: garlicSeedImg, 
    dataAiHintSeedShop: 'garlic seedclove',
    harvestedCropImageUrl: garlicHarvestedImg, 
    dataAiHintHarvestedCrop: 'garlic bulb',
    farmPlotImageUrls: [
      garlicPlot1Img,
      garlicPlot2Img,
      garlicPlot3Img,
      garlicPlot4Img,
      garlicPlot5Img,
    ],
    dataAiHintFarmPlot: 'garlic plant',
  },
  {
    id: 'strawberry',
    name: 'Strawberry',
    growTime: 12 * 1000, // 12 seconds
    sellPrice: 12,
    seedPrice: 4,
    seedShopImageUrl: strawberrySeedImg, 
    dataAiHintSeedShop: 'strawberry seedpacket',
    harvestedCropImageUrl: strawberryHarvestedImg, 
    dataAiHintHarvestedCrop: 'strawberry fruit',
    farmPlotImageUrls: [
      strawberryPlot1Img,
      strawberryPlot2Img,
      strawberryPlot3Img,
      strawberryPlot4Img,
      strawberryPlot5Img,
    ],
    dataAiHintFarmPlot: 'strawberry plant',
  },
  {
    id: 'bellPepper',
    name: 'Bell Pepper',
    growTime: 18 * 1000,
    sellPrice: 20,
    seedPrice: 4,
    // seedShopImageUrl: bellPepperSeedImg, // Removed due to Module Not Found
    dataAiHintSeedShop: 'pepper seedpacket',
    // harvestedCropImageUrl: bellPepperHarvestedImg, // Removed due to Module Not Found
    dataAiHintHarvestedCrop: 'bell pepper',
    farmPlotImageUrls: [
      // bellPepperPlot1Img, // Removed due to Module Not Found
      // bellPepperPlot2Img, // Removed due to Module Not Found
      // bellPepperPlot3Img, // Removed due to Module Not Found
      // bellPepperPlot4Img, // Removed due to Module Not Found
      // bellPepperPlot5Img, // Removed due to Module Not Found
    ],
    dataAiHintFarmPlot: 'pepper plant',
  },
  {
    id: 'corn',
    name: 'Corn',
    growTime: 20 * 1000,
    sellPrice: 25,
    seedPrice: 5,
    seedShopImageUrl: cornSeedImg, 
    dataAiHintSeedShop: 'corn seedpacket',
    harvestedCropImageUrl: cornHarvestedImg, 
    dataAiHintHarvestedCrop: 'corn cob',
    farmPlotImageUrls: [
      cornPlot1Img,
      cornPlot2Img,
      cornPlot3Img,
      cornPlot4Img,
      cornPlot5Img,
    ],
    dataAiHintFarmPlot: 'corn stalk',
  },
  {
    id: 'cabbage',
    name: 'Cabbage',
    growTime: 22 * 1000,
    sellPrice: 28,
    seedPrice: 6,
    seedShopImageUrl: cabbageSeedImg, 
    dataAiHintSeedShop: 'cabbage seedpacket',
    harvestedCropImageUrl: cabbageHarvestedImg, 
    dataAiHintHarvestedCrop: 'cabbage head',
    farmPlotImageUrls: [
      cabbagePlot1Img,
      cabbagePlot2Img,
      cabbagePlot3Img,
      cabbagePlot4Img,
      cabbagePlot5Img,
    ],
    dataAiHintFarmPlot: 'cabbage plant',
  },
  {
    id: 'eggplant',
    name: 'Eggplant',
    growTime: 25 * 1000,
    sellPrice: 30,
    seedPrice: 7,
    seedShopImageUrl: eggplantSeedImg, 
    dataAiHintSeedShop: 'eggplant seedpacket',
    harvestedCropImageUrl: eggplantHarvestedImg, 
    dataAiHintHarvestedCrop: 'eggplant vegetable',
    farmPlotImageUrls: [
      eggplantPlot1Img,
      eggplantPlot2Img,
      eggplantPlot3Img,
      eggplantPlot4Img,
      eggplantPlot5Img,
    ],
    dataAiHintFarmPlot: 'eggplant plant',
  },
  {
    id: 'pumpkin',
    name: 'Pumpkin',
    growTime: 30 * 1000,
    sellPrice: 40,
    seedPrice: 8,
    seedShopImageUrl: pumpkinSeedImg, 
    dataAiHintSeedShop: 'pumpkin seedpacket',
    harvestedCropImageUrl: pumpkinHarvestedImg, 
    dataAiHintHarvestedCrop: 'pumpkin fruit',
    farmPlotImageUrls: [
      pumpkinPlot1Img,
      pumpkinPlot2Img,
      pumpkinPlot3Img,
      pumpkinPlot4Img,
      pumpkinPlot5Img,
    ],
    dataAiHintFarmPlot: 'pumpkin plant',
  },
].sort((a, b) => a.seedPrice - b.seedPrice);

