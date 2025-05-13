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
    id: 'gather_crop',
    titleGenerator: (item1) => `Urgent Crop Request: ${item1?.name || 'Crops'}!`,
    descriptionGenerator: (qty1, item1) => `The village chef needs ${qty1} ${item1?.name || 'crops'} for a grand feast. Can you help?`,
    requirementGenerator: (cropsData, _nitsData, getEffectiveCropSellPrice, playerFarmLevel) => {
      const availableCrops = cropsData.filter(c => playerFarmLevel >= (c.xpYield || 0) / 10); // Simple unlock logic
      if (availableCrops.length === 0) return null;
      const crop = availableCrops[Math.floor(Math.random() * availableCrops.length)];
      const quantity = getRandomInt(5, 10 + playerFarmLevel); // Scale quantity slightly with level
      const baseSellPrice = getEffectiveCropSellPrice(crop.sellPrice);
      const reward = Math.ceil(baseSellPrice * quantity * 1.5); // 50% bonus
      return {
        requirements: [{ type: 'crop', itemId: crop.id, quantity }],
        reward,
      };
    },
    minFarmLevel: 1,
  },
  {
    id: 'gather_nit',
    titleGenerator: (item1) => `Nit Collector Needed: ${item1?.name || 'Nits'}!`,
    descriptionGenerator: (qty1, item1) => `A researcher is studying ${item1?.name || 'Nits'} and requires ${qty1} samples.`,
    requirementGenerator: (_cropsData, nitsData, _getEffectiveCropSellPrice, playerFarmLevel) => {
      if (nitsData.length === 0 || playerFarmLevel < 3) return null; // Nits might be mid-game
      const nit = nitsData[Math.floor(Math.random() * nitsData.length)];
      const quantity = getRandomInt(3, 5 + Math.floor(playerFarmLevel / 2));
      const reward = Math.ceil(nit.sellPrice * quantity * 1.8); // 80% bonus
      return {
        requirements: [{ type: 'nit', itemId: nit.id, quantity }],
        reward,
      };
    },
    minFarmLevel: 3,
  },
  {
    id: 'mixed_order',
    titleGenerator: (item1, item2) => `Special Order: ${item1?.name || 'Goods'} & ${item2?.name || 'Wares'}!`,
    descriptionGenerator: (qty1, item1, qty2, item2) => `A picky merchant wants a mixed batch: ${qty1} ${item1?.name || 'item1'} and ${qty2} ${item2?.name || 'item2'}.`,
    requirementGenerator: (cropsData, nitsData, getEffectiveCropSellPrice, playerFarmLevel) => {
      const availableCrops = cropsData.filter(c => playerFarmLevel >= (c.xpYield || 0) / 10);
      if (availableCrops.length === 0 || nitsData.length === 0 || playerFarmLevel < 5) return null;

      const crop = availableCrops[Math.floor(Math.random() * availableCrops.length)];
      const nit = nitsData[Math.floor(Math.random() * nitsData.length)];

      const cropQty = getRandomInt(3, 8 + playerFarmLevel);
      const nitQty = getRandomInt(1, 3 + Math.floor(playerFarmLevel / 3));

      const cropReward = getEffectiveCropSellPrice(crop.sellPrice) * cropQty;
      const nitReward = nit.sellPrice * nitQty;
      const totalReward = Math.ceil((cropReward + nitReward) * 1.3); // 30% bonus for mixed

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
