
import type { Crop } from '@/types';
import { Carrot, Wheat } from 'lucide-react'; // Lucide icons can still be fallbacks or primary if specific images are not set

export const CROPS_DATA: Crop[] = [
  {
    id: 'carrot',
    name: 'Carrot',
    growTime: 5 * 1000, // 5 seconds
    sellPrice: 5,
    seedPrice: 1,
    icon: Carrot,
    seedShopImageUrl: '/images/crops/carrot/seed.png', // Seed packet
    dataAiHintSeedShop: 'carrot seedpacket',
    harvestedCropImageUrl: '/images/crops/carrot/harvested.png', // Harvested carrot
    dataAiHintHarvestedCrop: 'carrot vegetable',
    farmPlotImageUrl: '/images/crops/carrot/plot.png', // Carrot plant
    dataAiHintFarmPlot: 'carrot plant',
  },
  {
    id: 'radish',
    name: 'Radish',
    growTime: 6 * 1000,
    sellPrice: 7,
    seedPrice: 1,
    seedShopImageUrl: '/images/crops/radish/seed.png', // Seed packet
    dataAiHintSeedShop: 'radish seedpacket',
    harvestedCropImageUrl: '/images/crops/radish/harvested.png', // Harvested radish
    dataAiHintHarvestedCrop: 'radish vegetable',
    farmPlotImageUrl: '/images/crops/radish/plot.png', // Radish plant
    dataAiHintFarmPlot: 'radish plant',
  },
  {
    id: 'wheat',
    name: 'Wheat',
    growTime: 10 * 1000, // 10 seconds
    sellPrice: 10,
    seedPrice: 2,
    icon: Wheat,
    seedShopImageUrl: '/images/crops/wheat/seed.png', // Seed bag
    dataAiHintSeedShop: 'wheat seedbag',
    harvestedCropImageUrl: '/images/crops/wheat/harvested.png', // Harvested wheat sheaf
    dataAiHintHarvestedCrop: 'wheat sheaf',
    farmPlotImageUrl: '/images/crops/wheat/plot.png', // Wheat plant/stalk
    dataAiHintFarmPlot: 'wheat stalk',
  },
  {
    id: 'potato',
    name: 'Potato',
    growTime: 8 * 1000, // 8 seconds
    sellPrice: 8,
    seedPrice: 2,
    seedShopImageUrl: '/images/crops/potato/seed.png', // Seed bag
    dataAiHintSeedShop: 'potato seedbag',
    harvestedCropImageUrl: '/images/crops/potato/harvested.png', // Harvested potato
    dataAiHintHarvestedCrop: 'potato vegetable',
    farmPlotImageUrl: '/images/crops/potato/plot.png',  // Potato plant
    dataAiHintFarmPlot: 'potato plant',
  },
  {
    id: 'onion',
    name: 'Onion',
    growTime: 10 * 1000,
    sellPrice: 9,
    seedPrice: 2,
    seedShopImageUrl: '/images/crops/onion/seed.png', // Onion sets (seeds)
    dataAiHintSeedShop: 'onion sets',
    harvestedCropImageUrl: '/images/crops/onion/harvested.png', // Harvested onion bulb
    dataAiHintHarvestedCrop: 'onion bulb',
    farmPlotImageUrl: '/images/crops/onion/plot.png', // Onion plant
    dataAiHintFarmPlot: 'onion plant',
  },
  {
    id: 'tomato',
    name: 'Tomato',
    growTime: 15 * 1000, // 15 seconds
    sellPrice: 15,
    seedPrice: 3,
    seedShopImageUrl: '/images/crops/tomato/seed.png', // Seed packet
    dataAiHintSeedShop: 'tomato seedpacket',
    harvestedCropImageUrl: '/images/crops/tomato/harvested.png',  // Harvested tomato
    dataAiHintHarvestedCrop: 'tomato fruit',
    farmPlotImageUrl: '/images/crops/tomato/plot.png', // Tomato plant
    dataAiHintFarmPlot: 'tomato plant',
  },
  {
    id: 'broccoli',
    name: 'Broccoli',
    growTime: 16 * 1000,
    sellPrice: 18,
    seedPrice: 3,
    seedShopImageUrl: '/images/crops/broccoli/seed.png', // Seed packet
    dataAiHintSeedShop: 'broccoli seeds',
    harvestedCropImageUrl: '/images/crops/broccoli/harvested.png', // Harvested broccoli
    dataAiHintHarvestedCrop: 'broccoli floret',
    farmPlotImageUrl: '/images/crops/broccoli/plot.png', // Broccoli plant
    dataAiHintFarmPlot: 'broccoli plant',
  },
  {
    id: 'cucumber',
    name: 'Cucumber',
    growTime: 14 * 1000,
    sellPrice: 16,
    seedPrice: 3,
    seedShopImageUrl: '/images/crops/cucumber/seed.png', // Seed packet
    dataAiHintSeedShop: 'cucumber seedpacket',
    harvestedCropImageUrl: '/images/crops/cucumber/harvested.png', // Harvested cucumber
    dataAiHintHarvestedCrop: 'cucumber fruit',
    farmPlotImageUrl: '/images/crops/cucumber/plot.png', // Cucumber plant
    dataAiHintFarmPlot: 'cucumber plant',
  },
  {
    id: 'garlic',
    name: 'Garlic',
    growTime: 12 * 1000,
    sellPrice: 11,
    seedPrice: 3,
    seedShopImageUrl: '/images/crops/garlic/seed.png', // Garlic seed clove
    dataAiHintSeedShop: 'garlic seedclove',
    harvestedCropImageUrl: '/images/crops/garlic/harvested.png', // Harvested garlic bulb
    dataAiHintHarvestedCrop: 'garlic bulb',
    farmPlotImageUrl: '/images/crops/garlic/plot.png', // Garlic plant
    dataAiHintFarmPlot: 'garlic plant',
  },
  {
    id: 'strawberry',
    name: 'Strawberry',
    growTime: 12 * 1000, // 12 seconds
    sellPrice: 12,
    seedPrice: 4,
    seedShopImageUrl: '/images/crops/strawberry/seed.png', // Seed packet
    dataAiHintSeedShop: 'strawberry seedpacket',
    harvestedCropImageUrl: '/images/crops/strawberry/harvested.png', // Harvested strawberry
    dataAiHintHarvestedCrop: 'strawberry fruit',
    farmPlotImageUrl: '/images/crops/strawberry/plot.png', // Strawberry plant
    dataAiHintFarmPlot: 'strawberry plant',
  },
  {
    id: 'bellPepper',
    name: 'Bell Pepper',
    growTime: 18 * 1000,
    sellPrice: 20,
    seedPrice: 4,
    seedShopImageUrl: '/images/crops/bellPepper/seed.png', // Seed packet
    dataAiHintSeedShop: 'pepper seedpacket',
    harvestedCropImageUrl: '/images/crops/bellPepper/harvested.png', // Harvested bell pepper
    dataAiHintHarvestedCrop: 'bell pepper',
    farmPlotImageUrl: '/images/crops/bellPepper/plot.png', // Pepper plant
    dataAiHintFarmPlot: 'pepper plant',
  },
  {
    id: 'corn',
    name: 'Corn',
    growTime: 20 * 1000,
    sellPrice: 25,
    seedPrice: 5,
    seedShopImageUrl: '/images/crops/corn/seed.png', // Seed packet
    dataAiHintSeedShop: 'corn seedpacket',
    harvestedCropImageUrl: '/images/crops/corn/harvested.png', // Harvested corn cob
    dataAiHintHarvestedCrop: 'corn cob',
    farmPlotImageUrl: '/images/crops/corn/plot.png', // Corn stalk
    dataAiHintFarmPlot: 'corn stalk',
  },
  {
    id: 'cabbage',
    name: 'Cabbage',
    growTime: 22 * 1000,
    sellPrice: 28,
    seedPrice: 6,
    seedShopImageUrl: '/images/crops/cabbage/seed.png', // Seed packet
    dataAiHintSeedShop: 'cabbage seedpacket',
    harvestedCropImageUrl: '/images/crops/cabbage/harvested.png', // Harvested cabbage
    dataAiHintHarvestedCrop: 'cabbage head',
    farmPlotImageUrl: '/images/crops/cabbage/plot.png', // Cabbage plant
    dataAiHintFarmPlot: 'cabbage plant',
  },
  {
    id: 'eggplant',
    name: 'Eggplant',
    growTime: 25 * 1000,
    sellPrice: 30,
    seedPrice: 7,
    seedShopImageUrl: '/images/crops/eggplant/seed.png', // Seed packet
    dataAiHintSeedShop: 'eggplant seedpacket',
    harvestedCropImageUrl: '/images/crops/eggplant/harvested.png', // Harvested eggplant
    dataAiHintHarvestedCrop: 'eggplant vegetable',
    farmPlotImageUrl: '/images/crops/eggplant/plot.png', // Eggplant plant
    dataAiHintFarmPlot: 'eggplant plant',
  },
  {
    id: 'pumpkin',
    name: 'Pumpkin',
    growTime: 30 * 1000,
    sellPrice: 40,
    seedPrice: 8,
    seedShopImageUrl: '/images/crops/pumpkin/seed.png', // Seed packet
    dataAiHintSeedShop: 'pumpkin seedpacket',
    harvestedCropImageUrl: '/images/crops/pumpkin/harvested.png', // Harvested pumpkin
    dataAiHintHarvestedCrop: 'pumpkin fruit',
    farmPlotImageUrl: '/images/crops/pumpkin/plot.png', // Pumpkin plant
    dataAiHintFarmPlot: 'pumpkin plant',
  },
].sort((a, b) => a.seedPrice - b.seedPrice);
