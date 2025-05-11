
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
    seedShopImageUrl: 'https://picsum.photos/seed/carrot-packet/64/64', // Seed packet
    dataAiHintSeedShop: 'carrot seedpacket',
    harvestedCropImageUrl: 'https://picsum.photos/seed/carrot-item/64/64', // Harvested carrot
    dataAiHintHarvestedCrop: 'carrot vegetable',
    farmPlotImageUrl: 'https://picsum.photos/seed/carrot-plant/64/64', // Carrot plant
    dataAiHintFarmPlot: 'carrot plant',
  },
  {
    id: 'radish',
    name: 'Radish',
    growTime: 6 * 1000,
    sellPrice: 7,
    seedPrice: 1,
    seedShopImageUrl: 'https://picsum.photos/seed/radish-packet/64/64', // Seed packet
    dataAiHintSeedShop: 'radish seedpacket',
    harvestedCropImageUrl: 'https://picsum.photos/seed/radish-item/64/64', // Harvested radish
    dataAiHintHarvestedCrop: 'radish vegetable',
    farmPlotImageUrl: 'https://picsum.photos/seed/radish-plant/64/64', // Radish plant
    dataAiHintFarmPlot: 'radish plant',
  },
  {
    id: 'wheat',
    name: 'Wheat',
    growTime: 10 * 1000, // 10 seconds
    sellPrice: 10,
    seedPrice: 2,
    icon: Wheat, 
    seedShopImageUrl: 'https://picsum.photos/seed/wheat-seedbag/64/64', // Seed bag
    dataAiHintSeedShop: 'wheat seedbag',
    harvestedCropImageUrl: 'https://picsum.photos/seed/wheat-sheaf/64/64', // Harvested wheat sheaf
    dataAiHintHarvestedCrop: 'wheat sheaf',
    farmPlotImageUrl: 'https://picsum.photos/seed/wheat-field/64/64', // Wheat plant/stalk
    dataAiHintFarmPlot: 'wheat stalk',
  },
  {
    id: 'potato',
    name: 'Potato',
    growTime: 8 * 1000, // 8 seconds
    sellPrice: 8,
    seedPrice: 2,
    seedShopImageUrl: 'https://picsum.photos/seed/potato-seedbag/64/64', // Seed bag
    dataAiHintSeedShop: 'potato seedbag',
    harvestedCropImageUrl: 'https://picsum.photos/seed/potato-item/64/64', // Harvested potato
    dataAiHintHarvestedCrop: 'potato vegetable',
    farmPlotImageUrl: 'https://picsum.photos/seed/potato-sprout/64/64',  // Potato plant
    dataAiHintFarmPlot: 'potato plant',
  },
  {
    id: 'onion',
    name: 'Onion',
    growTime: 10 * 1000,
    sellPrice: 9,
    seedPrice: 2,
    seedShopImageUrl: 'https://picsum.photos/seed/onion-set/64/64', // Onion sets (seeds)
    dataAiHintSeedShop: 'onion sets',
    harvestedCropImageUrl: 'https://picsum.photos/seed/onion-bulb/64/64', // Harvested onion bulb
    dataAiHintHarvestedCrop: 'onion bulb',
    farmPlotImageUrl: 'https://picsum.photos/seed/onion-green/64/64', // Onion plant
    dataAiHintFarmPlot: 'onion plant',
  },
  {
    id: 'tomato',
    name: 'Tomato',
    growTime: 15 * 1000, // 15 seconds
    sellPrice: 15,
    seedPrice: 3,
    seedShopImageUrl: 'https://picsum.photos/seed/tomato-seedpacket/64/64', // Seed packet
    dataAiHintSeedShop: 'tomato seedpacket',
    harvestedCropImageUrl: 'https://picsum.photos/seed/tomato-fruit/64/64',  // Harvested tomato
    dataAiHintHarvestedCrop: 'tomato fruit',
    farmPlotImageUrl: 'https://picsum.photos/seed/tomato-vine/64/64', // Tomato plant
    dataAiHintFarmPlot: 'tomato plant',
  },
  {
    id: 'broccoli',
    name: 'Broccoli',
    growTime: 16 * 1000,
    sellPrice: 18,
    seedPrice: 3,
    seedShopImageUrl: 'https://picsum.photos/seed/broccoli-seeds/64/64', // Seed packet
    dataAiHintSeedShop: 'broccoli seeds',
    harvestedCropImageUrl: 'https://picsum.photos/seed/broccoli-floret/64/64', // Harvested broccoli
    dataAiHintHarvestedCrop: 'broccoli floret',
    farmPlotImageUrl: 'https://picsum.photos/seed/broccoli-head/64/64', // Broccoli plant
    dataAiHintFarmPlot: 'broccoli plant',
  },
  {
    id: 'cucumber',
    name: 'Cucumber',
    growTime: 14 * 1000,
    sellPrice: 16,
    seedPrice: 3,
    seedShopImageUrl: 'https://picsum.photos/seed/cucumber-pack/64/64', // Seed packet
    dataAiHintSeedShop: 'cucumber seedpacket',
    harvestedCropImageUrl: 'https://picsum.photos/seed/cucumber-slice/64/64', // Harvested cucumber
    dataAiHintHarvestedCrop: 'cucumber fruit',
    farmPlotImageUrl: 'https://picsum.photos/seed/cucumber-vine/64/64', // Cucumber plant
    dataAiHintFarmPlot: 'cucumber plant',
  },
  {
    id: 'garlic',
    name: 'Garlic',
    growTime: 12 * 1000,
    sellPrice: 11,
    seedPrice: 3,
    seedShopImageUrl: 'https://picsum.photos/seed/garlic-seed/64/64', // Garlic seed clove
    dataAiHintSeedShop: 'garlic seedclove',
    harvestedCropImageUrl: 'https://picsum.photos/seed/garlic-clove/64/64', // Harvested garlic bulb
    dataAiHintHarvestedCrop: 'garlic bulb',
    farmPlotImageUrl: 'https://picsum.photos/seed/garlic-scape/64/64', // Garlic plant
    dataAiHintFarmPlot: 'garlic plant',
  },
  {
    id: 'strawberry',
    name: 'Strawberry',
    growTime: 12 * 1000, // 12 seconds
    sellPrice: 12,
    seedPrice: 4,
    seedShopImageUrl: 'https://picsum.photos/seed/strawberry-seedpacket/64/64', // Seed packet
    dataAiHintSeedShop: 'strawberry seedpacket',
    harvestedCropImageUrl: 'https://picsum.photos/seed/strawberry-fruit/64/64', // Harvested strawberry
    dataAiHintHarvestedCrop: 'strawberry fruit',
    farmPlotImageUrl: 'https://picsum.photos/seed/strawberry-bush/64/64', // Strawberry plant
    dataAiHintFarmPlot: 'strawberry plant',
  },
  {
    id: 'bellPepper',
    name: 'Bell Pepper',
    growTime: 18 * 1000,
    sellPrice: 20,
    seedPrice: 4,
    seedShopImageUrl: 'https://picsum.photos/seed/pepper-seeds/64/64', // Seed packet
    dataAiHintSeedShop: 'pepper seedpacket',
    harvestedCropImageUrl: 'https://picsum.photos/seed/bellpepper-item/64/64', // Harvested bell pepper
    dataAiHintHarvestedCrop: 'bell pepper',
    farmPlotImageUrl: 'https://picsum.photos/seed/pepper-plant/64/64', // Pepper plant
    dataAiHintFarmPlot: 'pepper plant',
  },
  {
    id: 'corn',
    name: 'Corn',
    growTime: 20 * 1000, 
    sellPrice: 25,
    seedPrice: 5,
    seedShopImageUrl: 'https://picsum.photos/seed/corn-seedpacket/64/64', // Seed packet
    dataAiHintSeedShop: 'corn seedpacket',
    harvestedCropImageUrl: 'https://picsum.photos/seed/corn-cob/64/64', // Harvested corn cob
    dataAiHintHarvestedCrop: 'corn cob',
    farmPlotImageUrl: 'https://picsum.photos/seed/corn-stalk/64/64', // Corn stalk
    dataAiHintFarmPlot: 'corn stalk',
  },
  {
    id: 'cabbage',
    name: 'Cabbage',
    growTime: 22 * 1000,
    sellPrice: 28,
    seedPrice: 6,
    seedShopImageUrl: 'https://picsum.photos/seed/cabbage-seedpacket/64/64', // Seed packet
    dataAiHintSeedShop: 'cabbage seedpacket',
    harvestedCropImageUrl: 'https://picsum.photos/seed/cabbage-head/64/64', // Harvested cabbage
    dataAiHintHarvestedCrop: 'cabbage head',
    farmPlotImageUrl: 'https://picsum.photos/seed/cabbage-leaf/64/64', // Cabbage plant
    dataAiHintFarmPlot: 'cabbage plant',
  },
  {
    id: 'eggplant',
    name: 'Eggplant',
    growTime: 25 * 1000,
    sellPrice: 30,
    seedPrice: 7,
    seedShopImageUrl: 'https://picsum.photos/seed/eggplant-seedpacket/64/64', // Seed packet
    dataAiHintSeedShop: 'eggplant seedpacket',
    harvestedCropImageUrl: 'https://picsum.photos/seed/eggplant-veg/64/64', // Harvested eggplant
    dataAiHintHarvestedCrop: 'eggplant vegetable',
    farmPlotImageUrl: 'https://picsum.photos/seed/eggplant-bush/64/64', // Eggplant plant
    dataAiHintFarmPlot: 'eggplant plant',
  },
  {
    id: 'pumpkin',
    name: 'Pumpkin',
    growTime: 30 * 1000,
    sellPrice: 40,
    seedPrice: 8,
    seedShopImageUrl: 'https://picsum.photos/seed/pumpkin-seedpacket/64/64', // Seed packet
    dataAiHintSeedShop: 'pumpkin seedpacket',
    harvestedCropImageUrl: 'https://picsum.photos/seed/pumpkin-fruit/64/64', // Harvested pumpkin
    dataAiHintHarvestedCrop: 'pumpkin fruit',
    farmPlotImageUrl: 'https://picsum.photos/seed/pumpkin-vine/64/64', // Pumpkin plant
    dataAiHintFarmPlot: 'pumpkin plant',
  },
].sort((a, b) => a.seedPrice - b.seedPrice);
