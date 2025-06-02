import type { QuestTemplate, Crop, Nit, QuestItemRequirement } from '@/types';

export const QUEST_GENERATION_INTERVAL = 2 * 60 * 1000; // 2 minutes
// export const QUEST_GENERATION_INTERVAL = 20 * 1000; // 20 seconds for testing
export const MAX_ACTIVE_QUESTS = 3;
export const QUEST_CHECK_INTERVAL = 15 * 1000; // How often to check if it's time to generate quests

const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const QUEST_TEMPLATES: QuestTemplate[] = [
 {
    id: 'gather_multiple_crops',
    titleGenerator: (item1?: Crop | Nit, item2?: Crop | Nit) => `Variety Harvest: ${item1?.name || 'Crop 1'} & ${item2?.name || 'Crop 2'}!`,
    descriptionGenerator: (qty1: number, item1?: Crop | Nit, qty2?: number, item2?: Crop | Nit) => `A local market is requesting a mix of fresh produce: ${qty1} ${item1?.name || 'item1'} and ${qty2 || 0} ${item2?.name || 'item2'}.`,
    requirementGenerator: (cropsData, _nitsData, getEffectiveCropSellPrice, playerFarmLevel) => {
      const availableCrops = cropsData.filter(c => c.tier <= playerFarmLevel);
      if (availableCrops.length < 2) return null; // Need at least two different crops

      // Select two distinct crops
      const crop1Index = Math.floor(Math.random() * availableCrops.length);
      const crop1 = availableCrops[crop1Index];

      let crop2Index = Math.floor(Math.random() * availableCrops.length);
      while (crop2Index === crop1Index) {
        crop2Index = Math.floor(Math.random() * availableCrops.length);
      }
      const crop2 = availableCrops[crop2Index];

      const quantity1 = getRandomInt(3, 8 + playerFarmLevel);
      const quantity2 = getRandomInt(3, 8 + playerFarmLevel);

      const reward = Math.ceil((getEffectiveCropSellPrice(crop1.sellPrice) * quantity1 + getEffectiveCropSellPrice(crop2.sellPrice) * quantity2) * 1.4); // Small bonus for variety

      return {
        requirements: [{ type: 'crop', itemId: crop1.id, quantity: quantity1 }, { type: 'crop', itemId: crop2.id, quantity: quantity2 }],
        reward,
      };
    },
    minFarmLevel: 2, // Requires at least Farm Level 2 to potentially have multiple crop types unlocked
  },
  {
    id: 'gather_crop',
    titleGenerator: (item1?: Crop | Nit) => `Urgent Crop Request: ${item1?.name || 'Crops'}!`,
    descriptionGenerator: (qty1: number, item1?: Crop | Nit) => `The village chef needs ${qty1} ${item1?.name || 'crops'} for a grand feast. Can you help?`,
    requirementGenerator: (cropsData, _nitsData, getEffectiveCropSellPrice, playerFarmLevel) => {
      const availableCrops = cropsData.filter(c => c.minFarmLevelForQuest <= playerFarmLevel);
      if (availableCrops.length === 0) return null;
      const crop = availableCrops[Math.floor(Math.random() * availableCrops.length)];
      const quantity = getRandomInt(5, 10 + playerFarmLevel); 
      const baseSellPrice = getEffectiveCropSellPrice(crop.sellPrice);
      const reward = Math.ceil(baseSellPrice * quantity * 1.5); 
      return {
        requirements: [{ type: 'crop', itemId: crop.id, quantity }],
        reward,
      };
    },
    minFarmLevel: 1,
  },
  {
    id: 'gather_nit',
    titleGenerator: (item1?: Crop | Nit) => `Nit Collector Needed: ${item1?.name || 'Nits'}!`,
    descriptionGenerator: (qty1: number, item1?: Crop | Nit) => `A researcher is studying ${item1?.name || 'Nits'} and requires ${qty1} samples.`,
    requirementGenerator: (_cropsData, nitsData, _getEffectiveCropSellPrice, playerFarmLevel) => {
      if (nitsData.length === 0 || playerFarmLevel < 3) return null; 
      const availableNits = nitsData.filter(n => n.minFarmLevelForQuest <= playerFarmLevel);
      if (availableNits.length === 0) return null;
      const nit = availableNits[Math.floor(Math.random() * availableNits.length)];
      const quantity = getRandomInt(3, 5 + Math.floor(playerFarmLevel / 2));
      const reward = Math.ceil(nit.sellPrice * quantity * 1.8); 
      return {
        requirements: [{ type: 'nit', itemId: nit.id, quantity }],
        reward,
      };
    },
    minFarmLevel: 3,
  },
  {
    id: 'mixed_order',
    titleGenerator: (item1?: Crop | Nit, item2?: Crop | Nit) => `Special Order: ${item1?.name || 'Goods'} & ${item2?.name || 'Wares'}!`,
    descriptionGenerator: (qty1: number, item1?: Crop | Nit, qty2?: number, item2?: Crop | Nit) => `A picky merchant wants a mixed batch: ${qty1} ${item1?.name || 'item1'} and ${qty2 || 0} ${item2?.name || 'item2'}.`,
    requirementGenerator: (cropsData, nitsData, getEffectiveCropSellPrice, playerFarmLevel) => {
      const availableCrops = cropsData.filter(c => c.minFarmLevelForQuest <= playerFarmLevel);
      if (availableCrops.length === 0 || nitsData.length === 0 || playerFarmLevel < 5) return null;

      const crop = availableCrops[Math.floor(Math.random() * availableCrops.length)];
      const nit = nitsData[Math.floor(Math.random() * nitsData.length)];

      const cropQty = getRandomInt(3, 8 + playerFarmLevel);
      const nitQty = getRandomInt(1, 3 + Math.floor(playerFarmLevel / 3));

      const cropReward = getEffectiveCropSellPrice(crop.sellPrice) * cropQty;
      const nitReward = nit.sellPrice * nitQty;
      const totalReward = Math.ceil((cropReward + nitReward) * 1.3); 

      return {
        requirements: [
          { type: 'crop', itemId: crop.id, quantity: cropQty },
          { type: 'nit', itemId: nit.id, quantity: nitQty },
        ],
        reward: totalReward,
      };
    },
    minFarmLevel: 5,
  }
];
