"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type { PlotState, InventoryItem, Crop, UpgradesState, UpgradeId, OwnedNeitt, OwnedNit, Nit, NeittType, Farm } from '@/types';
import { CROPS_DATA } from '@/config/crops';
import { UPGRADES_DATA } from '@/config/upgrades';
import { NEITTS_DATA } from '@/config/neitts';
import { NITS_DATA } from '@/config/nits'; // Import NITS_DATA
import GameHeader from '@/components/game/GameHeader';
import PlantingArea from '@/components/game/PlantingArea';
import SeedShopPanel from '@/components/game/SeedShopPanel';
import InventoryAndShop from '@/components/game/InventoryAndShop';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Save, Loader2 } from 'lucide-react';

const INITIAL_CURRENCY = 20;
const INITIAL_NUM_PLOTS = 6;
const SAVE_GAME_KEY = 'harvestClickerSaveData_v2';

const INITIAL_FARM_LEVEL = 1;
const INITIAL_FARM_XP = 0;

const generateInitialPlots = (count: number, farmId: string): PlotState[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `${farmId}-plot-${i + 1}`,
    isHarvestable: false,
  }));
};

const initialUpgradesState: UpgradesState = {
  fertilizer: false,
  negotiationSkills: false,
  bulkDiscount: false,
  unlockFarm2: false,
  unlockFarm3: false,
};

const initialFarmsState: Farm[] = [
  { id: 'farm-1', name: 'Farm 1', plots: generateInitialPlots(INITIAL_NUM_PLOTS, 'farm-1') }
];

export default function HarvestClickerPage() {
  const [farms, setFarms] = useState<Farm[]>(initialFarmsState);
  const [currentFarmId, setCurrentFarmId] = useState<string>('farm-1');
  const [currency, setCurrency] = useState<number>(INITIAL_CURRENCY);
  const [harvestedInventory, setHarvestedInventory] = useState<InventoryItem[]>([]);
  const [ownedSeeds, setOwnedSeeds] = useState<InventoryItem[]>([]);
  const [selectedSeedFromOwnedId, setSelectedSeedFromOwnedId] = useState<string | undefined>(undefined);
  const [upgrades, setUpgrades] = useState<UpgradesState>(initialUpgradesState);
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  const [ownedNeitts, setOwnedNeitts] = useState<OwnedNeitt[]>([]);
  const [producedNits, setProducedNits] = useState<OwnedNit[]>([]);

  const [farmLevel, setFarmLevel] = useState<number>(INITIAL_FARM_LEVEL);
  const [farmXp, setFarmXp] = useState<number>(INITIAL_FARM_XP);

  // Statistics State
  const [totalMoneySpent, setTotalMoneySpent] = useState<number>(0);
  const [totalCropsHarvested, setTotalCropsHarvested] = useState<number>(0);
  const [gameStartTime, setGameStartTime] = useState<number>(0); // Initialized in loadGame or reset
  const [formattedGameTime, setFormattedGameTime] = useState<string>("00:00:00");


  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsClient(true);
    }
  }, []);

  useEffect(() => {
    if (!isClient || gameStartTime === 0) return; // Don't start timer if gameStartTime isn't set

    const timer = setInterval(() => {
      const now = Date.now();
      const elapsed = now - gameStartTime;
      const totalSeconds = Math.floor(elapsed / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setFormattedGameTime(
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStartTime, isClient]);

  const calculateXpToNextLevel = useCallback((level: number): number => {
    return 50 + (level - 1) * 50;
  }, []);

  // Neitt Production Logic
  useEffect(() => {
    if (!isClient) return;

    const productionInterval = setInterval(() => {
      const now = Date.now();
      let neittStateChangedDuringTick = false;
      const newlyProducedNitsThisTick = new Map<string, number>();

      setOwnedNeitts(prevOwnedNeitts => {
        const nextOwnedNeitts = prevOwnedNeitts.map(neittInstance => {
          if (neittInstance.nitsLeftToProduce <= 0) {
            return neittInstance;
          }

          const neittType = NEITTS_DATA.find(nt => nt.id === neittInstance.neittTypeId);
          if (!neittType) return neittInstance;

          const elapsedTime = now - neittInstance.lastProductionCycleStartTime;

          if (elapsedTime >= neittType.productionTime) {
            const currentAmount = newlyProducedNitsThisTick.get(neittType.producesNitId) || 0;
            newlyProducedNitsThisTick.set(neittType.producesNitId, currentAmount + 1);

            neittStateChangedDuringTick = true;
            const nitsNowLeft = neittInstance.nitsLeftToProduce - 1;

            return {
              ...neittInstance,
              lastProductionCycleStartTime: nitsNowLeft > 0 ? now : neittInstance.lastProductionCycleStartTime,
              nitsLeftToProduce: nitsNowLeft,
            };
          }
          return neittInstance;
        });
        return neittStateChangedDuringTick ? nextOwnedNeitts : prevOwnedNeitts;
      });

      if (newlyProducedNitsThisTick.size > 0) {
        setProducedNits(currentGlobalProducedNits => {
          const updatedGlobalNits = [...currentGlobalProducedNits];
          newlyProducedNitsThisTick.forEach((quantity, nitId) => {
            const existingNitIndex = updatedGlobalNits.findIndex(n => n.nitId === nitId);
            if (existingNitIndex > -1) {
              updatedGlobalNits[existingNitIndex].quantity += quantity;
            } else {
              updatedGlobalNits.push({ nitId, quantity });
            }
          });
          return updatedGlobalNits.filter(n => n.quantity > 0);
        });
      }
    }, 1000);

    return () => clearInterval(productionInterval);
  }, [isClient]);


  const getEffectiveCropSeedPrice = useCallback((basePrice: number) => {
    return upgrades.bulkDiscount ? Math.ceil(basePrice * 0.9) : basePrice;
  }, [upgrades.bulkDiscount]);

  const getEffectiveCropSellPrice = useCallback((basePrice: number) => {
    return upgrades.negotiationSkills ? Math.floor(basePrice * 1.15) : basePrice;
  }, [upgrades.negotiationSkills]);

  const getEffectiveCropGrowTime = useCallback((baseTime: number) => {
    return upgrades.fertilizer ? baseTime * 0.8 : baseTime;
  }, [upgrades.fertilizer]);

  const handleBuySeed = useCallback((cropId: string) => {
    const cropToBuy = CROPS_DATA.find(c => c.id === cropId);
    if (!cropToBuy) return;

    const effectiveSeedPrice = getEffectiveCropSeedPrice(cropToBuy.seedPrice);

    if (currency < effectiveSeedPrice) {
      toast({
        title: "Not Enough Gold!",
        description: `You need ${effectiveSeedPrice} gold to buy a ${cropToBuy.name} seed.`,
        variant: "destructive",
      });
      return;
    }

    setCurrency(prevCurrency => prevCurrency - effectiveSeedPrice);
    setTotalMoneySpent(prev => prev + effectiveSeedPrice); // Track money spent
    setOwnedSeeds(prevOwnedSeeds => {
      const existingSeedIndex = prevOwnedSeeds.findIndex(item => item.cropId === cropId);
      if (existingSeedIndex > -1) {
        const updatedSeeds = [...prevOwnedSeeds];
        updatedSeeds[existingSeedIndex].quantity += 1;
        return updatedSeeds;
      }
      return [...prevOwnedSeeds, { cropId, quantity: 1 }];
    });
    toast({
      title: `${cropToBuy.name} Seed Purchased!`,
      description: `Paid ${effectiveSeedPrice} gold. It's now in your seed inventory.`,
    });
  }, [currency, toast, getEffectiveCropSeedPrice]);

  const handleSelectSeedForPlanting = useCallback((seedId: string) => {
    const seedInInventory = ownedSeeds.find(s => s.cropId === seedId && s.quantity > 0);
    if (!seedInInventory) {
        toast({
            title: "Seed Not Available",
            description: "You don't own this seed or have run out.",
            variant: "destructive",
        });
        setSelectedSeedFromOwnedId(undefined);
        return;
    }
    setSelectedSeedFromOwnedId(seedId);
    const crop = CROPS_DATA.find(c => c.id === seedId);
    toast({
      title: `${crop?.name || 'Seed'} Selected`,
      description: `Click on an empty plot to plant.`,
    });
  }, [ownedSeeds, toast]);


  const handlePlantCrop = useCallback((plotId: string) => {
    if (!selectedSeedFromOwnedId) {
      toast({ title: "No Seed Selected", description: "Please select a seed from your inventory to plant.", variant: "destructive" });
      return;
    }

    const cropToPlant = CROPS_DATA.find(c => c.id === selectedSeedFromOwnedId);
    if (!cropToPlant) return;

    const seedInInventory = ownedSeeds.find(s => s.cropId === selectedSeedFromOwnedId);
    if (!seedInInventory || seedInInventory.quantity <= 0) {
        toast({ title: "Out of Seeds!", description: `You don't have any ${cropToPlant.name} seeds left.`, variant: "destructive" });
        return;
    }

    setFarms(prevFarms =>
      prevFarms.map(farm =>
        farm.id === currentFarmId
          ? {
              ...farm,
              plots: farm.plots.map(p =>
                p.id === plotId
                  ? { ...p, cropId: selectedSeedFromOwnedId, plantTime: Date.now(), isHarvestable: false }
                  : p
              ),
            }
          : farm
      )
    );

    setOwnedSeeds(prevOwnedSeeds => {
        const updatedSeeds = prevOwnedSeeds.map(s =>
            s.cropId === selectedSeedFromOwnedId ? {...s, quantity: s.quantity - 1} : s
        );
        return updatedSeeds.filter(s => s.quantity > 0);
    });

    toast({
      title: `${cropToPlant.name} planted!`,
      description: `One ${cropToPlant.name} seed used from inventory. Watch it grow.`,
    });
  }, [selectedSeedFromOwnedId, ownedSeeds, toast, currentFarmId]);


  const handleHarvestCrop = useCallback((plotId: string, harvestedCropId: string) => {
    const crop = CROPS_DATA.find(c => c.id === harvestedCropId);
    if (!crop) return;

    setFarms(prevFarms =>
      prevFarms.map(farm =>
        farm.id === currentFarmId
          ? {
              ...farm,
              plots: farm.plots.map(p =>
                p.id === plotId ? { ...p, cropId: undefined, plantTime: undefined, isHarvestable: false } : p
              ),
            }
          : farm
      )
    );

    setTotalCropsHarvested(prev => prev + 1); // Track crops harvested

    setHarvestedInventory(prevInventory => {
      const existingItemIndex = prevInventory.findIndex(item => item.cropId === harvestedCropId);
      if (existingItemIndex > -1) {
        const newInventory = [...prevInventory];
        newInventory[existingItemIndex] = {
          ...prevInventory[existingItemIndex],
          quantity: prevInventory[existingItemIndex].quantity + 1,
        };
        return newInventory;
      }
      return [...prevInventory, { cropId: harvestedCropId, quantity: 1 }];
    });

    toast({
      title: `Harvested ${crop.name}!`,
      description: "It's now in your sell market inventory.",
    });

    const gainedXp = crop.xpYield || 0;
    if (gainedXp > 0) {
      setFarmXp(prevXp => {
        let newXp = prevXp + gainedXp;
        let currentLevel = farmLevel;
        let xpNeededForNext = calculateXpToNextLevel(currentLevel);

        while (newXp >= xpNeededForNext) {
          currentLevel++;
          newXp -= xpNeededForNext;
          xpNeededForNext = calculateXpToNextLevel(currentLevel);
          toast({
            title: "Farm Level Up!",
            description: `Congratulations! Your farm reached level ${currentLevel}!`,
            variant: "default"
          });
        }
        setFarmLevel(currentLevel);
        return newXp;
      });
    }
  }, [toast, farmLevel, calculateXpToNextLevel, currentFarmId]);

  const handleSellCrop = useCallback((cropIdToSell: string, quantity: number) => {
    const crop = CROPS_DATA.find(c => c.id === cropIdToSell);
    if (!crop) return;

    const itemInInventory = harvestedInventory.find(item => item.cropId === cropIdToSell);
    if (!itemInInventory || itemInInventory.quantity < quantity) {
      toast({ title: "Not enough crops to sell!", variant: "destructive" });
      return;
    }

    const effectiveSellPrice = getEffectiveCropSellPrice(crop.sellPrice);

    setHarvestedInventory(prevInventory =>
      prevInventory
        .map(item =>
          item.cropId === cropIdToSell
            ? { ...item, quantity: item.quantity - quantity }
            : item
        )
        .filter(item => item.quantity > 0)
    );

    setCurrency(prevCurrency => prevCurrency + effectiveSellPrice * quantity);
    toast({
      title: `Sold ${quantity} ${crop.name}(s)!`,
      description: `You earned ${effectiveSellPrice * quantity} gold.`,
    });
  }, [harvestedInventory, toast, getEffectiveCropSellPrice]);

  const handleBuyUpgrade = useCallback((upgradeId: UpgradeId) => {
    const upgradeToBuy = UPGRADES_DATA.find(u => u.id === upgradeId);
    if (!upgradeToBuy) {
      toast({ title: "Upgrade not found!", variant: "destructive" });
      return;
    }
    if (upgrades[upgradeId]) {
      toast({ title: "Already Purchased!", description: `You already own ${upgradeToBuy.name}.` });
      return;
    }
    if (currency < upgradeToBuy.cost) {
      toast({ title: "Not Enough Gold!", description: `You need ${upgradeToBuy.cost} gold for ${upgradeToBuy.name}.`, variant: "destructive" });
      return;
    }

    setCurrency(prevCurrency => prevCurrency - upgradeToBuy.cost);
    setTotalMoneySpent(prev => prev + upgradeToBuy.cost); // Track money spent
    setUpgrades(prevUpgrades => ({ ...prevUpgrades, [upgradeId]: true }));

    if (upgradeId === 'unlockFarm2') {
      setFarms(prevFarms => [
        ...prevFarms,
        { id: 'farm-2', name: 'Farm 2', plots: generateInitialPlots(INITIAL_NUM_PLOTS, 'farm-2') }
      ]);
      toast({ title: "Farm 2 Unlocked!", description: `You bought ${upgradeToBuy.name} for ${upgradeToBuy.cost} gold.` });
    } else if (upgradeId === 'unlockFarm3') {
      setFarms(prevFarms => [
        ...prevFarms,
        { id: 'farm-3', name: 'Farm 3', plots: generateInitialPlots(INITIAL_NUM_PLOTS, 'farm-3') }
      ]);
      toast({ title: "Farm 3 Unlocked!", description: `You bought ${upgradeToBuy.name} for ${upgradeToBuy.cost} gold.` });
    } else {
      toast({ title: "Upgrade Purchased!", description: `You bought ${upgradeToBuy.name} for ${upgradeToBuy.cost} gold.` });
    }
  }, [currency, upgrades, toast]);

  const handleBuyNeitt = useCallback((neittId: string) => {
    const neittToBuy = NEITTS_DATA.find(s => s.id === neittId);
    if (!neittToBuy) {
      toast({ title: "Neitt not found!", variant: "destructive" });
      return;
    }
    if (currency < neittToBuy.cost) {
      toast({ title: "Not Enough Gold!", description: `You need ${neittToBuy.cost} gold for a ${neittToBuy.name}.`, variant: "destructive" });
      return;
    }

    setCurrency(prev => prev - neittToBuy.cost);
    setTotalMoneySpent(prev => prev + neittToBuy.cost); // Track money spent
    setOwnedNeitts(prevOwnedNeitts => {
      const newNeittInstance: OwnedNeitt = {
        instanceId: self.crypto.randomUUID(),
        neittTypeId: neittId,
        lastProductionCycleStartTime: 0,
        nitsLeftToProduce: 0,
        initialNitsForCycle: 0,
      };
      return [...prevOwnedNeitts, newNeittInstance];
    });
    toast({ title: `${neittToBuy.name} Purchased!`, description: `A new ${neittToBuy.name} has joined your farm! Feed it to start production.` });
  }, [currency, toast]);


  const handleFeedNeitt = useCallback((instanceId: string) => {
    setOwnedNeitts(prevOwnedNeitts =>
      prevOwnedNeitts.map(n => {
        if (n.instanceId !== instanceId) return n;

        const neittInstance = n;
        const neittType = NEITTS_DATA.find(nt => nt.id === neittInstance.neittTypeId);
        if (!neittType) {
            toast({ title: "Neitt type error!", variant: "destructive" });
            return n;
        }

        if (neittInstance.nitsLeftToProduce > 0) {
            toast({ title: `${neittType.name} is already producing!`, description: "It's busy producing Nits." });
            return n;
        }

        const requiredCrop = CROPS_DATA.find(c => c.id === neittType.feedCropId);
        if (!requiredCrop) {
            toast({ title: "Feeding Error", description: `Required feed crop (${neittType.feedCropId}) for ${neittType.name} not found.`, variant: "destructive" });
            return n;
        }

        let canFeed = false;
        setHarvestedInventory(prevInventory => {
            const cropInInventoryIndex = prevInventory.findIndex(item => item.cropId === neittType.feedCropId);
            if (cropInInventoryIndex > -1 && prevInventory[cropInInventoryIndex].quantity >= 1) {
                canFeed = true;
                const updatedInventory = [...prevInventory];
                updatedInventory[cropInInventoryIndex] = {
                    ...updatedInventory[cropInInventoryIndex],
                    quantity: updatedInventory[cropInInventoryIndex].quantity - 1,
                };
                return updatedInventory.filter(item => item.quantity > 0);
            }
            return prevInventory;
        });

        if (!canFeed) {
          toast({
              title: `Not Enough ${requiredCrop.name}s!`,
              description: `You need 1 ${requiredCrop.name} to feed ${neittType.name}.`,
              variant: "destructive"
          });
          return n;
        }

        const nitsToProduceThisCycle = Math.floor(Math.random() * (neittType.maxProductionCapacity - neittType.minProductionCapacity + 1)) + neittType.minProductionCapacity;

        toast({ title: `Fed ${neittType.name}!`, description: `Used 1 ${requiredCrop.name}. It will now produce ${nitsToProduceThisCycle} Nit(s).` });

        return {
          ...n,
          nitsLeftToProduce: nitsToProduceThisCycle,
          initialNitsForCycle: nitsToProduceThisCycle,
          lastProductionCycleStartTime: Date.now(),
        };
      })
    );
  }, [toast]);


  const handleSellNit = useCallback((nitIdToSell: string, quantity: number) => {
    const nitInfo = NITS_DATA.find(n => n.id === nitIdToSell);
    if (!nitInfo) {
        toast({ title: "Nit not found!", variant: "destructive" });
        return;
    }

    const nitInInventory = producedNits.find(item => item.nitId === nitIdToSell);
    if (!nitInInventory || nitInInventory.quantity < quantity) {
      toast({ title: "Not enough Nits to sell!", variant: "destructive" });
      return;
    }

    const sellPrice = nitInfo.sellPrice;

    setProducedNits(prevNits =>
      prevNits
        .map(item =>
          item.nitId === nitIdToSell
            ? { ...item, quantity: item.quantity - quantity }
            : item
        )
        .filter(item => item.quantity > 0)
    );

    setCurrency(prevCurrency => prevCurrency + sellPrice * quantity);
    toast({
      title: `Sold ${quantity} ${nitInfo.name}(s)!`,
      description: `You earned ${sellPrice * quantity} gold.`,
    });
  }, [producedNits, toast]);


  const saveGame = useCallback(() => {
    if (!isClient) return;
    try {
      const gameState = {
        farms,
        currentFarmId,
        currency,
        harvestedInventory,
        ownedSeeds,
        upgrades,
        ownedNeitts,
        producedNits,
        selectedSeedFromOwnedId,
        farmLevel,
        farmXp,
        totalMoneySpent,
        totalCropsHarvested,
        gameStartTime,
      };
      localStorage.setItem(SAVE_GAME_KEY, JSON.stringify(gameState));
      toast({
        title: "Game Saved!",
        description: "Your progress has been saved to this browser.",
      });
    } catch (error) {
      console.error("Failed to save game:", error);
      toast({
        title: "Error Saving Game",
        description: "Could not save your progress. See console for details.",
        variant: "destructive",
      });
    }
  }, [farms, currentFarmId, currency, harvestedInventory, ownedSeeds, upgrades, ownedNeitts, producedNits, selectedSeedFromOwnedId, farmLevel, farmXp, totalMoneySpent, totalCropsHarvested, gameStartTime, toast, isClient]);

  const resetGameStates = useCallback((showToast: boolean = true) => {
    const farm1Plots = generateInitialPlots(INITIAL_NUM_PLOTS, 'farm-1');
    setFarms([{ id: 'farm-1', name: 'Farm 1', plots: farm1Plots }]);
    setCurrentFarmId('farm-1');
    setCurrency(INITIAL_CURRENCY);
    setHarvestedInventory([]);
    setOwnedSeeds([]);
    setSelectedSeedFromOwnedId(undefined);
    setUpgrades(initialUpgradesState);
    setOwnedNeitts([]);
    setProducedNits([]);
    setFarmLevel(INITIAL_FARM_LEVEL);
    setFarmXp(INITIAL_FARM_XP);
    setTotalMoneySpent(0);
    setTotalCropsHarvested(0);
    setGameStartTime(Date.now());
    if (showToast) {
      toast({
        title: "Game Reset",
        description: "Started a new farm! Your saved data (if any) is still preserved unless cleared manually.",
      });
    }
  }, [toast]);

  const loadGame = useCallback(() => {
    if (!isClient) return;
    try {
      const savedData = localStorage.getItem(SAVE_GAME_KEY);
      if (savedData) {
        const gameState = JSON.parse(savedData);
        if (gameState && typeof gameState.currency === 'number') {

          let loadedFarms: Farm[] = initialFarmsState;
          if (Array.isArray(gameState.farms) && gameState.farms.length > 0) {
            loadedFarms = gameState.farms.map((farm: Farm) => ({
              ...farm,
              plots: Array.isArray(farm.plots) ? farm.plots.map((p: any, idx: number) => ({
                  id: p.id || `${farm.id}-plot-${idx + 1}`,
                  cropId: p.cropId,
                  plantTime: p.plantTime,
                  isHarvestable: p.isHarvestable || false,
              })) : generateInitialPlots(INITIAL_NUM_PLOTS, farm.id)
            }));
          } else if (Array.isArray(gameState.plots)) { // Handle old save format (single farm)
            const migratedFarm1Plots = gameState.plots.map((p: any, idx: number) => ({
                id: p.id || `farm-1-plot-${idx+1}`,
                cropId: p.cropId,
                plantTime: p.plantTime,
                isHarvestable: p.isHarvestable || false,
            }));
            loadedFarms = [{ id: 'farm-1', name: 'Farm 1', plots: migratedFarm1Plots }];
            if (gameState.upgrades?.expandFarm && !gameState.upgrades?.unlockFarm2) {
              loadedFarms.push({ id: 'farm-2', name: 'Farm 2', plots: generateInitialPlots(INITIAL_NUM_PLOTS, 'farm-2')});
              if(gameState.upgrades) gameState.upgrades.unlockFarm2 = true;
            }
          }
          setFarms(loadedFarms);
          setCurrentFarmId(gameState.currentFarmId || loadedFarms[0]?.id || 'farm-1');

          setCurrency(gameState.currency);
          setHarvestedInventory(gameState.harvestedInventory || []);
          setOwnedSeeds(gameState.ownedSeeds || []);

          const loadedUpgrades = {...initialUpgradesState, ...gameState.upgrades};
          if ('expandFarm' in loadedUpgrades) {
            delete (loadedUpgrades as any).expandFarm;
          }
          setUpgrades(loadedUpgrades);

          setFarmLevel(gameState.farmLevel || INITIAL_FARM_LEVEL);
          setFarmXp(gameState.farmXp || INITIAL_FARM_XP);

          // Load Statistics
          setTotalMoneySpent(gameState.totalMoneySpent || 0);
          setTotalCropsHarvested(gameState.totalCropsHarvested || 0);
          if (typeof gameState.gameStartTime === 'number' && gameState.gameStartTime > 0) {
            setGameStartTime(gameState.gameStartTime);
          } else {
            setGameStartTime(Date.now()); // For old saves or new games
          }


          let loadedOwnedNeittsFromState: any[] = gameState.ownedNeitts || [];
          const processedNeitts: OwnedNeitt[] = [];
          const validNeittTypeIds = new Set(NEITTS_DATA.map(nt => nt.id));

          if (Array.isArray(loadedOwnedNeittsFromState)) {
            loadedOwnedNeittsFromState.forEach((neittFromFile: any, index: number) => {
              if (!neittFromFile || typeof neittFromFile !== 'object') {
                console.warn(`Skipping invalid Neitt data at index ${index}: not an object`, neittFromFile);
                return;
              }

              const neittTypeId = neittFromFile.neittTypeId;
              if (!neittTypeId || typeof neittTypeId !== 'string' || !validNeittTypeIds.has(neittTypeId)) {
                console.warn(`Skipping Neitt with invalid or missing neittTypeId at index ${index}:`, neittFromFile);
                return;
              }

              const neittTypeDetails = NEITTS_DATA.find(nt => nt.id === neittTypeId);
              if (!neittTypeDetails) {
                 console.warn(`Skipping Neitt - type details not found for id ${neittTypeId} at index ${index}:`, neittFromFile);
                 return;
              }

              const instanceId = neittFromFile.instanceId || self.crypto.randomUUID();
              const lastProductionCycleStartTime = typeof neittFromFile.lastProductionCycleStartTime === 'number'
                                                  ? neittFromFile.lastProductionCycleStartTime
                                                  : 0;
              const nitsLeftToProduce = typeof neittFromFile.nitsLeftToProduce === 'number'
                                        ? neittFromFile.nitsLeftToProduce
                                        : 0;

              const initialNitsForCycle = typeof neittFromFile.initialNitsForCycle === 'number'
                                        ? neittFromFile.initialNitsForCycle
                                        : (nitsLeftToProduce > 0 ? nitsLeftToProduce : 0);


              processedNeitts.push({
                instanceId: instanceId,
                neittTypeId: neittTypeId,
                lastProductionCycleStartTime: lastProductionCycleStartTime,
                nitsLeftToProduce: nitsLeftToProduce,
                initialNitsForCycle: initialNitsForCycle,
              });
            });
          }
          setOwnedNeitts(processedNeitts);

          setProducedNits(gameState.producedNits || []);
          setSelectedSeedFromOwnedId(gameState.selectedSeedFromOwnedId || undefined);

          toast({
            title: "Game Loaded!",
            description: "Your previous progress has been restored.",
          });
        } else {
           toast({
            title: "Save Data Corrupted",
            description: "Could not load previous progress. Starting fresh.",
            variant: "destructive",
          });
            resetGameStates(false);
        }
      } else {
         toast({
            title: "Welcome Farmer!",
            description: "Starting a new game. Good luck!",
          });
         resetGameStates(false);
         setGameStartTime(Date.now()); // Explicitly set for a brand new game
      }
    } catch (error) {
      console.error("Failed to load game:", error);
      toast({
        title: "Error Loading Game",
        description: "Could not load your progress. Starting fresh.",
        variant: "destructive",
      });
      resetGameStates(false);
      setGameStartTime(Date.now()); // Ensure it's set on error too
    }
  }, [toast, isClient, resetGameStates]);

  useEffect(() => {
    if (isClient) {
      loadGame();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClient]);

  useEffect(() => {
    if (isClient) {
      const handleBeforeUnload = () => {
        saveGame();
      };
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [isClient, saveGame]);


  if (!isClient) {
    return (
      <div className="flex flex-col min-h-screen bg-background items-center justify-center">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
        <div className="text-2xl text-primary-foreground mt-4">Loading Farm...</div>
      </div>
    );
  }

  const xpForNextLevel = calculateXpToNextLevel(farmLevel);
  const currentFarm = farms.find(f => f.id === currentFarmId);
  const currentFarmPlots = currentFarm?.plots || [];
  const currentFarmName = currentFarm?.name || "Farm";

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <GameHeader currency={currency} />
      <main className="flex-grow container mx-auto p-4 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
             <SeedShopPanel
                onBuySeed={handleBuySeed}
                currency={currency}
                getEffectiveCropSeedPrice={getEffectiveCropSeedPrice}
              />
          </div>
          <div className="lg:col-span-2">
            <PlantingArea
              plots={currentFarmPlots}
              farmName={currentFarmName}
              onPlant={handlePlantCrop}
              onHarvest={handleHarvestCrop}
              selectedSeedId={selectedSeedFromOwnedId}
              getEffectiveCropGrowTime={getEffectiveCropGrowTime}
            />
          </div>
        </div>
        <div>
          <InventoryAndShop
            harvestedInventory={harvestedInventory}
            ownedSeeds={ownedSeeds}
            onSellCrop={handleSellCrop}
            onSelectSeedForPlanting={handleSelectSeedForPlanting}
            selectedSeedId={selectedSeedFromOwnedId}
            currency={currency}
            upgradesData={UPGRADES_DATA}
            purchasedUpgrades={upgrades}
            onBuyUpgrade={handleBuyUpgrade}
            getEffectiveCropSellPrice={getEffectiveCropSellPrice}

            neittsData={NEITTS_DATA}
            ownedNeitts={ownedNeitts}
            onBuyNeitt={handleBuyNeitt}
            onFeedNeitt={handleFeedNeitt}

            producedNits={producedNits}
            nitsData={NITS_DATA}
            onSellNit={handleSellNit}

            cropsData={CROPS_DATA}

            farmLevel={farmLevel}
            farmXp={farmXp}
            xpForNextLevel={xpForNextLevel}

            farms={farms}
            currentFarmId={currentFarmId}
            onFarmChange={setCurrentFarmId}

            // Statistics
            totalMoneySpent={totalMoneySpent}
            totalCropsHarvested={totalCropsHarvested}
            formattedGameTime={formattedGameTime}
          />
        </div>
        <div className="pt-4 text-center space-y-2 sm:space-y-0 sm:space-x-2">
            <Button onClick={saveGame} variant="outline" className="flex items-center gap-2 mx-auto sm:mx-0 sm:inline-flex">
                <Save className="w-4 h-4" /> Save Game
            </Button>
        </div>
      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground">
        Harvest Clicker - Made by AloneNeitt
      </footer>
    </div>
  );
}
