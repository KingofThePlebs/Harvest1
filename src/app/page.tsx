"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type { PlotState, InventoryItem, Crop, UpgradesState, UpgradeId, OwnedNeitt, OwnedNit, Nit, NeittType, Farm, Quest, QuestItemRequirement, ProductionBuildingType, OwnedProductionBuilding } from '@/types';
import { CROPS_DATA } from '@/config/crops';
import { UPGRADES_DATA } from '@/config/upgrades';
import { NEITTS_DATA } from '@/config/neitts';
import { NITS_DATA } from '@/config/nits';
import { QUEST_TEMPLATES, QUEST_GENERATION_INTERVAL, MAX_ACTIVE_QUESTS, QUEST_CHECK_INTERVAL } from '@/config/questConfig';
import { PRODUCTION_BUILDING_TYPES_DATA } from '@/config/productionBuildings';
import GameHeader from '@/components/game/GameHeader';
import PlantingArea from '@/components/game/PlantingArea';
import SeedShopPanel from '@/components/game/SeedShopPanel';
import InventoryAndShop from '@/components/game/InventoryAndShop';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Save, Loader2, Trash2, AlertTriangle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const INITIAL_CURRENCY = 10;
const INITIAL_NUM_PLOTS = 6;
const SAVE_GAME_KEY = 'harvestClickerSaveData_v2.6_neitt_arrival'; // Incremented version

const INITIAL_FARM_LEVEL = 1;
const INITIAL_FARM_XP = 0;
const INITIAL_NEITT_SLAVER_LEVEL = 1;
const INITIAL_NEITT_SLAVER_XP = 0;
const INITIAL_TRADER_LEVEL = 1;
const INITIAL_TRADER_XP = 0;

const INITIAL_MAX_NEITTS_ALLOWED = 1; 
const ADDITIONAL_HOUSE_COST = 250; 


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
  const [neittSlaverLevel, setNeittSlaverLevel] = useState<number>(INITIAL_NEITT_SLAVER_LEVEL);
  const [neittSlaverXp, setNeittSlaverXp] = useState<number>(INITIAL_NEITT_SLAVER_XP);
  const [traderLevel, setTraderLevel] = useState<number>(INITIAL_TRADER_LEVEL);
  const [traderXp, setTraderXp] = useState<number>(INITIAL_TRADER_XP);

  const [totalMoneySpent, setTotalMoneySpent] = useState<number>(0);
  const [totalCropsHarvested, setTotalCropsHarvested] = useState<number>(0);
  const [totalNeittsFed, setTotalNeittsFed] = useState<number>(0);
  const [gameStartTime, setGameStartTime] = useState<number>(0);
  const [formattedGameTime, setFormattedGameTime] = useState<string>("00:00:00");

  const [activeQuests, setActiveQuests] = useState<Quest[]>([]);
  const [lastQuestGenerationTime, setLastQuestGenerationTime] = useState<number>(0);

  const [maxNeittsAllowed, setMaxNeittsAllowed] = useState<number>(INITIAL_MAX_NEITTS_ALLOWED);
  const [ownedProductionBuildings, setOwnedProductionBuildings] = useState<OwnedProductionBuilding[]>([]);
  
  const [lastNeittArrivalTime, setLastNeittArrivalTime] = useState<number>(0);
  const [neittArrivalProgress, setNeittArrivalProgress] = useState<number>(0);
  const [isNightMode, setIsNightMode] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsClient(true);
    }
  }, []);

  useEffect(() => {
    if (!isClient) return;
    const savedNightMode = localStorage.getItem('harvestClickerNightMode');
    if (savedNightMode === 'true') {
      setIsNightMode(true);
      document.body.classList.add('dark');
    } else {
      setIsNightMode(false);
      document.body.classList.remove('dark');
    }
  }, [isClient]);
  useEffect(() => {
    if (gameStartTime === 0 || !isClient) return;

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

  // Save game time to localll storage when the component unloads
  useEffect(() => {
    if (!isClient) return;

    const handleBeforeUnload = () => {
      if (gameStartTime > 0) {
        const now = Date.now();
        const elapsed = now - gameStartTime;
        localStorage.setItem('harvestClickerGameTime', elapsed.toString());
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [gameStartTime, isClient]);


  const calculateXpToNextLevel = useCallback((level: number): number => {
    const baseXP = 50;
    const linearFactor = 20;
    const quadraticFactor = 10;
    return Math.floor(baseXP + (level - 1) * linearFactor + Math.pow(Math.max(0, level - 1), 2) * quadraticFactor);
  }, []);


  const getEffectiveCropSellPrice = useCallback((basePrice: number) => {
    return upgrades.negotiationSkills ? Math.floor(basePrice * 1.15) : basePrice;
  }, [upgrades.negotiationSkills]);

  const generateNewQuests = useCallback(() => {
    const numberOfQuestsToGenerate = Math.floor(Math.random() * 3) + 1;
    const newQuests: Quest[] = [];

    const availableTemplates = QUEST_TEMPLATES.filter(template => farmLevel >= (template.minFarmLevel || 0));
    if (availableTemplates.length === 0) return;

    for (let i = 0; i < numberOfQuestsToGenerate; i++) {
      const template = availableTemplates[Math.floor(Math.random() * availableTemplates.length)];
      const generatedQuestData = template.requirementGenerator(CROPS_DATA, NITS_DATA, getEffectiveCropSellPrice, farmLevel);

      if (generatedQuestData) {
        const { requirements, reward } = generatedQuestData;
        let title = template.titleGenerator();
        let description = template.descriptionGenerator(0);

        if (requirements.length > 0) {
            const item1Info = requirements[0].type === 'crop'
                ? CROPS_DATA.find(c => c.id === requirements[0].itemId)
                : NITS_DATA.find(n => n.id === requirements[0].itemId);
            const item2Info = requirements.length > 1 && requirements[1]
                ? (requirements[1].type === 'crop'
                    ? CROPS_DATA.find(c => c.id === requirements[1].itemId)
                    : NITS_DATA.find(n => n.id === requirements[1].itemId))
                : undefined;

            title = template.titleGenerator(item1Info, item2Info);
            description = template.descriptionGenerator(
                requirements[0].quantity,
                item1Info,
                requirements[1]?.quantity,
                item2Info
            );
        }

        newQuests.push({
          id: self.crypto.randomUUID(),
          title,
          description,
          requirements,
          rewardCurrency: reward,
          timePosted: Date.now(),
        });
      }
    }

    if (newQuests.length > 0) {
      setActiveQuests(prevQuests => {
        const combined = [...prevQuests, ...newQuests];
        const sorted = combined.sort((a, b) => b.timePosted - a.timePosted);
        return sorted.slice(0, MAX_ACTIVE_QUESTS);
      });
      toast({ title: "New Quests Available!", description: "Check the Quest Square in Town." });
    }
  }, [farmLevel, getEffectiveCropSellPrice, toast]);


  useEffect(() => {
    if (!isClient) return;

    const questGenerationTimer = setInterval(() => {
      const now = Date.now();
      if (now - lastQuestGenerationTime >= QUEST_GENERATION_INTERVAL) {
        generateNewQuests();
        setLastQuestGenerationTime(now);
      }
    }, QUEST_CHECK_INTERVAL);

    return () => clearInterval(questGenerationTimer);
  }, [isClient, lastQuestGenerationTime, generateNewQuests]);



  const getEffectiveCropSeedPrice = useCallback((basePrice: number) => {
    return upgrades.bulkDiscount ? Math.ceil(basePrice * 0.9) : basePrice;
  }, [upgrades.bulkDiscount]);

  const getEffectiveCropGrowTime = useCallback((baseTime: number) => {
    return upgrades.fertilizer ? baseTime * 0.8 : baseTime;
  }, [upgrades.fertilizer]);

  const handleBuySeed = useCallback((cropId: string) => {
    console.log("handleBuySeed called for cropId:", cropId); // Log 1
    console.log("Current ownedSeeds state (outside callback):", ownedSeeds); // Log 2



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
    setTotalMoneySpent(prev => prev + effectiveSeedPrice);

    setOwnedSeeds(prevOwnedSeeds => {
      console.log("Inside setOwnedSeeds callback - prevOwnedSeeds:", prevOwnedSeeds); // Log 3
      const existingSeedIndex = prevOwnedSeeds.findIndex(item => item.cropId === cropId);
      const quantityToAdd = cropToBuy.seedsPerPurchase; // Use seedsPerPurchase
      console.log("Quantity to add:", quantityToAdd); // Log 4

      if (existingSeedIndex > -1) {
        console.log("Existing seed found. Current quantity:", prevOwnedSeeds[existingSeedIndex].quantity); // Log 5
        const updatedSeeds = [...prevOwnedSeeds];
        updatedSeeds[existingSeedIndex].quantity += quantityToAdd; // Add seedsPerPurchase
        console.log("Quantity after adding:", updatedSeeds[existingSeedIndex].quantity); // Log 6
        return updatedSeeds;
      }
      return [...prevOwnedSeeds, { cropId, quantity: quantityToAdd }]; // Add seedsPerPurchase
    });;
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

    setTotalCropsHarvested(prev => prev + 1);

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
          const levelUpSound = new Audio('/sounds/level_up.mp3'); // Předpokládá se, že soubor je v public/sounds
          levelUpSound.play();

          setTimeout(() => toast({
            title: "Farm Level Up!",
            description: `Congratulations! Your farm reached level ${currentLevel}!`,
            variant: "default"
          }), 0);
        }
        setFarmLevel(currentLevel);
        return newXp;
      });
    }
    toast({
      title: `Harvested ${crop.name}!`,
      description: "It's now in your sell market inventory.",
    });

  }, [toast, farmLevel, calculateXpToNextLevel, currentFarmId]);

  const handleSellCrop = useCallback((cropIdToSell: string, quantity: number) => {
    const sellSound = new Audio('/sounds/placeholder_sell.mp3');
    sellSound.play();
    const crop = CROPS_DATA.find(c => c.id === cropIdToSell);
    if (!crop) return;

    const itemInInventory = harvestedInventory.find(item => item.cropId === cropIdToSell);
    if (!itemInInventory || itemInInventory.quantity < quantity) {
      toast({ title: "Not enough crops to sell!", variant: "destructive" });
      return;
    }

    const effectiveSellPrice = getEffectiveCropSellPrice(crop.sellPrice);
    const earnedGold = effectiveSellPrice * quantity;

    setHarvestedInventory(prevInventory =>
      prevInventory
        .map(item =>
          item.cropId === cropIdToSell
            ? { ...item, quantity: item.quantity - quantity }
            : item
        )
        .filter(item => item.quantity > 0)
    );

    setCurrency(prevCurrency => prevCurrency + earnedGold);

    const gainedTraderXp = earnedGold;
    if (gainedTraderXp > 0) {
        setTraderXp(prevXp => {
            let newXp = prevXp + gainedTraderXp;
            let currentTraderLvl = traderLevel;
            let xpNeededForNext = calculateXpToNextLevel(currentTraderLvl);

            while (newXp >= xpNeededForNext) {
                currentTraderLvl++;
                newXp -= xpNeededForNext;
                xpNeededForNext = calculateXpToNextLevel(currentTraderLvl);
                const levelUpSound = new Audio('/sounds/level_up.mp3'); // Předpokládá se, že soubor je v public/sounds
                levelUpSound.play();
                setTimeout(() => toast({
                    title: "Trader Level Up!",
                    description: `Congratulations! Your Trader level reached ${currentTraderLvl}!`,
                    variant: "default"
                }), 0);
            }
            setTraderLevel(currentTraderLvl);
            return newXp;
        });
    }

    toast({
      title: `Sold ${quantity} ${crop.name}(s)!`,
      description: `You earned ${earnedGold} gold.`,
    });
  }, [harvestedInventory, toast, getEffectiveCropSellPrice, traderLevel, calculateXpToNextLevel]);

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
    setTotalMoneySpent(prev => prev + upgradeToBuy.cost);
    setUpgrades(prevUpgrades => ({ ...prevUpgrades, [upgradeId]: true }));

    if (upgradeId === 'unlockFarm2') {
      setFarms(prevFarms => {
        if (prevFarms.find(f => f.id === 'farm-2')) return prevFarms;
        return [...prevFarms, { id: 'farm-2', name: 'Farm 2', plots: generateInitialPlots(INITIAL_NUM_PLOTS, 'farm-2') }];
      });
      toast({ title: "Farm 2 Unlocked!", description: `You bought ${upgradeToBuy.name} for ${upgradeToBuy.cost} gold.` });
    } else if (upgradeId === 'unlockFarm3') {
      setFarms(prevFarms => {
        if (prevFarms.find(f => f.id === 'farm-3')) return prevFarms;
        return [...prevFarms, { id: 'farm-3', name: 'Farm 3', plots: generateInitialPlots(INITIAL_NUM_PLOTS, 'farm-3') }];
      });
      toast({ title: "Farm 3 Unlocked!", description: `You bought ${upgradeToBuy.name} for ${upgradeToBuy.cost} gold.` });
    }
     else {
      toast({ title: "Upgrade Purchased!", description: `You bought ${upgradeToBuy.name} for ${upgradeToBuy.cost} gold.` });
    }
  }, [currency, upgrades, toast]);


  const handleBuildAdditionalHouse = useCallback(() => {
    if (currency < ADDITIONAL_HOUSE_COST) {
      toast({ title: "Not Enough Gold!", description: `You need ${ADDITIONAL_HOUSE_COST} gold to increase Neitt capacity.`, variant: "destructive" });
      return;
    }
    setCurrency(prevCurrency => prevCurrency - ADDITIONAL_HOUSE_COST);
    setTotalMoneySpent(prev => prev + ADDITIONAL_HOUSE_COST);
    setMaxNeittsAllowed(prev => prev + 1);
    toast({ title: "Housing Expanded!", description: `Paid ${ADDITIONAL_HOUSE_COST} gold. You can now house one more Neitt.` });
  }, [currency, toast]);


  const handleBuyNeitt = useCallback((neittId: string) => {
    const neittToBuy = NEITTS_DATA.find(s => s.id === neittId);
    if (!neittToBuy) {
      toast({ title: "Neitt not found!", variant: "destructive" });
      return;
    }
     if (ownedNeitts.length >= maxNeittsAllowed) {
      toast({ title: "Housing Full!", description: `You need to build more housing to get more Neitts. Max: ${maxNeittsAllowed}.`, variant: "destructive" });
      return;
    }
    if (currency < neittToBuy.cost) {
      toast({ title: "Not Enough Gold!", description: `You need ${neittToBuy.cost} gold for a ${neittToBuy.name}.`, variant: "destructive" });
      return;
    }

    setCurrency(prev => prev - neittToBuy.cost);
    setTotalMoneySpent(prev => prev + neittToBuy.cost);
    setOwnedNeitts(prevOwnedNeitts => {
      const newNeittInstance: OwnedNeitt = {
        instanceId: self.crypto.randomUUID(),
        neittTypeId: neittId,
        lastProductionCycleStartTime: 0,
        nitsLeftToProduce: 0,
        initialNitsForCycle: 0,
        assignedToBuildingInstanceId: null,
      };
      return [...prevOwnedNeitts, newNeittInstance];
    });
    toast({ title: `${neittToBuy.name} Purchased!`, description: `A new ${neittToBuy.name} has joined your farm! Feed it to start production.` });
  }, [currency, toast, ownedNeitts.length, maxNeittsAllowed]);


  const handleFeedNeitt = useCallback((instanceId: string) => {
    let successfullyFedNeittType: NeittType | undefined = undefined;
    let fed = false;

    setOwnedNeitts(prevOwnedNeitts =>
        prevOwnedNeitts.map(n => {
            if (n.instanceId !== instanceId) return n;
            if (n.assignedToBuildingInstanceId) { 
                setTimeout(() => toast({ title: "Cannot Feed", description: "This Neitt is assigned to a building and cannot be fed directly here.", variant: "destructive" }), 0);
                return n;
            }

            const neittType = NEITTS_DATA.find(nt => nt.id === n.neittTypeId);
            if (!neittType) {
                setTimeout(() => toast({ title: "Neitt type error!", variant: "destructive" }), 0);
                return n;
            }
            successfullyFedNeittType = neittType;

            if (n.nitsLeftToProduce > 0) {
                setTimeout(() => toast({ title: `${neittType.name} is already producing!`, description: "It's busy producing Nits." }), 0);
                return n;
            }

            const requiredCrop = CROPS_DATA.find(c => c.id === neittType.feedCropId);
            if (!requiredCrop) {
                setTimeout(() => toast({ title: "Feeding Error", description: `Required feed crop for ${neittType.name} not found.`, variant: "destructive" }), 0);
                return n;
            }

            let canFeedLocal = false;
            setHarvestedInventory(currentInventory => {
                const cropInInventoryIndex = currentInventory.findIndex(item => item.cropId === neittType.feedCropId);
                if (cropInInventoryIndex > -1 && currentInventory[cropInInventoryIndex].quantity >= 1) {
                    canFeedLocal = true;
                    const updatedInventory = [...currentInventory];
                    updatedInventory[cropInInventoryIndex] = {
                        ...updatedInventory[cropInInventoryIndex],
                        quantity: updatedInventory[cropInInventoryIndex].quantity - 1,
                    };
                    return updatedInventory.filter(item => item.quantity > 0);
                }
                return currentInventory;
            });

            if (!canFeedLocal) {
                setTimeout(() => toast({
                    title: `Not Enough ${requiredCrop.name}s!`,
                    description: `You need 1 ${requiredCrop.name} to feed ${neittType.name}.`,
                    variant: "destructive"
                }), 0);
                return n;
            }

            fed = true;
            const nitsToProduceThisCycle = Math.floor(Math.random() * (neittType.maxProductionCapacity - neittType.minProductionCapacity + 1)) + neittType.minProductionCapacity;

            setTimeout(() => toast({ title: `Fed ${neittType.name}!`, description: `Used 1 ${requiredCrop.name}. It will now produce ${nitsToProduceThisCycle} Nit(s).` }), 0);

            return {
                ...n,
                nitsLeftToProduce: nitsToProduceThisCycle,
                initialNitsForCycle: nitsToProduceThisCycle,
                lastProductionCycleStartTime: Date.now(),
            };
        })
    );

    if (fed) {
      setTotalNeittsFed(prev => prev + 1);
    }

    if (successfullyFedNeittType && successfullyFedNeittType.neittFeedXpYield && successfullyFedNeittType.neittFeedXpYield > 0 && fed) {
      const gainedXp = successfullyFedNeittType.neittFeedXpYield;
      setNeittSlaverXp(prevXp => {
        let newXp = prevXp + gainedXp;
        let currentLevel = neittSlaverLevel;
        let xpNeededForNext = calculateXpToNextLevel(currentLevel);

        while (newXp >= xpNeededForNext) {
          currentLevel++;
          newXp -= xpNeededForNext;
          xpNeededForNext = calculateXpToNextLevel(currentLevel);
          const levelUpSound = new Audio('/sounds/level_up.mp3'); // Předpokládá se, že soubor je v public/sounds
          levelUpSound.play();
          setTimeout(() => toast({
            title: "Neitt Slaver Level Up!",
            description: `Congratulations! Your Neitt Slaver level reached ${currentLevel}!`,
            variant: "default"
          }),0);
        }
        setNeittSlaverLevel(currentLevel);
        return newXp;
      });
    }
  }, [toast, neittSlaverLevel, calculateXpToNextLevel, harvestedInventory]);



  const handleSellNit = useCallback((nitIdToSell: string, quantity: number) => {
    const sellSound = new Audio('/sounds/placeholder_sell.mp3');
    sellSound.play();
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
    const earnedGold = sellPrice * quantity;

    setProducedNits(prevNits =>
      prevNits
        .map(item =>
          item.nitId === nitIdToSell
            ? { ...item, quantity: item.quantity - quantity }
            : item
        )
        .filter(item => item.quantity > 0)
    );

    setCurrency(prevCurrency => prevCurrency + earnedGold);

    const gainedTraderXp = earnedGold;
    if (gainedTraderXp > 0) {
        setTraderXp(prevXp => {
            let newXp = prevXp + gainedTraderXp;
            let currentTraderLvl = traderLevel;
            let xpNeededForNext = calculateXpToNextLevel(currentTraderLvl);

            while (newXp >= xpNeededForNext) {
                currentTraderLvl++;
                newXp -= xpNeededForNext;
                // Přidání přehrání zvuku zde
                const levelUpSound = new Audio('/sounds/level_up.mp3'); // Předpokládá se, že soubor je v public/sounds
                levelUpSound.play();
                xpNeededForNext = calculateXpToNextLevel(currentTraderLvl);
                setTimeout(() => toast({
                    title: "Trader Level Up!",
                    description: `Congratulations! Your Trader level reached ${currentTraderLvl}!`,
                    variant: "default"
                }), 0);
            }
            setTraderLevel(currentTraderLvl);
            return newXp;
        });
    }

    toast({
      title: `Sold ${quantity} ${nitInfo.name}(s)!`,
      description: `You earned ${earnedGold} gold.`,
    });
  }, [producedNits, toast, traderLevel, calculateXpToNextLevel]);

  const handleCompleteQuest = useCallback((questId: string) => {
    const quest = activeQuests.find(q => q.id === questId);
    if (!quest) {
      toast({ title: "Quest not found!", variant: "destructive" });
      return;
    }

    let canComplete = true;
    const tempHarvestedInventory = [...harvestedInventory];
    const tempProducedNits = [...producedNits];

    for (const req of quest.requirements) {
      if (req.type === 'crop') {
        const itemIndex = tempHarvestedInventory.findIndex(item => item.cropId === req.itemId);
        if (itemIndex === -1 || tempHarvestedInventory[itemIndex].quantity < req.quantity) {
          canComplete = false;
          break;
        }
      } else if (req.type === 'nit') {
        const itemIndex = tempProducedNits.findIndex(item => item.nitId === req.itemId);
        if (itemIndex === -1 || tempProducedNits[itemIndex].quantity < req.quantity) {
          canComplete = false;
          break;
        }
      }
    }

    if (!canComplete) {
      toast({ title: "Requirements Not Met!", description: "You don't have all the items needed for this quest.", variant: "destructive" });
      return;
    }

    setHarvestedInventory(currentInventory => {
      let newInventory = [...currentInventory];
      quest.requirements.filter(r => r.type === 'crop').forEach(req => {
        const itemIndex = newInventory.findIndex(item => item.cropId === req.itemId);
        if (itemIndex !== -1) {
          newInventory[itemIndex].quantity -= req.quantity;
        }
      });
      return newInventory.filter(item => item.quantity > 0);
    });

    setProducedNits(currentNits => {
      let newNits = [...currentNits];
      quest.requirements.filter(r => r.type === 'nit').forEach(req => {
        const itemIndex = newNits.findIndex(item => item.nitId === req.itemId);
        if (itemIndex !== -1) {
          newNits[itemIndex].quantity -= req.quantity;
        }
      });
      return newNits.filter(item => item.quantity > 0);
    });

    setCurrency(prev => prev + quest.rewardCurrency);
    setActiveQuests(prevQuests => prevQuests.filter(q => q.id !== questId));
    toast({ title: "Quest Completed!", description: `You earned ${quest.rewardCurrency} gold for completing "${quest.title}".` });

  }, [activeQuests, harvestedInventory, producedNits, toast]);


  const handleBuildProductionBuilding = useCallback((buildingTypeId: string) => {
    const buildingTypeToBuild = PRODUCTION_BUILDING_TYPES_DATA.find(b => b.id === buildingTypeId);
    if (!buildingTypeToBuild) {
      toast({ title: "Building Type Not Found!", variant: "destructive" });
      return;
    }
    if (currency < buildingTypeToBuild.cost) {
      toast({ title: "Not Enough Gold!", description: `You need ${buildingTypeToBuild.cost} gold for a ${buildingTypeToBuild.name}.`, variant: "destructive" });
      return;
    }

    setCurrency(prev => prev - buildingTypeToBuild.cost);
    setTotalMoneySpent(prev => prev + buildingTypeToBuild.cost);
    setOwnedProductionBuildings(prev => [
      ...prev,
      {
        instanceId: self.crypto.randomUUID(),
        typeId: buildingTypeId,
        name: `${buildingTypeToBuild.name} ${prev.filter(b => b.typeId === buildingTypeId).length + 1}`,
        assignedNeittInstanceIds: [],
        lastProductionCycleTime: 0, 
      }
    ]);
    toast({ title: `${buildingTypeToBuild.name} Built!`, description: `Paid ${buildingTypeToBuild.cost} gold. You can now assign Neitts to it.` });
  }, [currency, toast]);

  const handleAddNeittToFactory = useCallback((buildingInstanceId: string) => {
    const building = ownedProductionBuildings.find(b => b.instanceId === buildingInstanceId);
    const buildingType = building ? PRODUCTION_BUILDING_TYPES_DATA.find(bt => bt.id === building.typeId) : undefined;
    
    if (!building || !buildingType) {
      toast({ title: "Error", description: "Building not found.", variant: "destructive" });
      return;
    }
    if (building.assignedNeittInstanceIds.length >= buildingType.capacity) {
      toast({ title: "Building Full", description: `This ${buildingType.name} cannot hold more Neitts.`, variant: "destructive" });
      return;
    }

    const availableNeitt = ownedNeitts.find(n => !n.assignedToBuildingInstanceId);
    if (!availableNeitt) {
      toast({ title: "No Available Neitts", description: "All your Neitts are currently assigned.", variant: "destructive" });
      return;
    }

    setOwnedProductionBuildings(prev =>
      prev.map(b => {
        if (b.instanceId === buildingInstanceId) {
          const isFirstNeittBeingAssigned = b.assignedNeittInstanceIds.length === 0;
          return { 
            ...b, 
            assignedNeittInstanceIds: [...b.assignedNeittInstanceIds, availableNeitt.instanceId],
            lastProductionCycleTime: (isFirstNeittBeingAssigned && b.assignedNeittInstanceIds.length === 0) ? Date.now() : b.lastProductionCycleTime 
          };
        }
        return b;
      })
    );
    setOwnedNeitts(prev =>
      prev.map(n =>
        n.instanceId === availableNeitt.instanceId
          ? { ...n, assignedToBuildingInstanceId: buildingInstanceId, nitsLeftToProduce: 0, lastProductionCycleStartTime: 0 }
          : n
      )
    );
    toast({ title: "Neitt Assigned!", description: `${NEITTS_DATA.find(nt=>nt.id === availableNeitt.neittTypeId)?.name} is now assigned to ${building.name}.` });
  }, [ownedProductionBuildings, ownedNeitts, toast]);

  const handleRemoveNeittFromFactory = useCallback((buildingInstanceId: string) => {
    const building = ownedProductionBuildings.find(b => b.instanceId === buildingInstanceId);
    if (!building || building.assignedNeittInstanceIds.length === 0) {
      toast({ title: "Error", description: "Building not found or no Neitts to remove.", variant: "destructive" });
      return;
    }

    const neittIdToRemove = building.assignedNeittInstanceIds[0]; 

    setOwnedProductionBuildings(prev =>
      prev.map(b =>
        b.instanceId === buildingInstanceId
          ? { ...b, assignedNeittInstanceIds: b.assignedNeittInstanceIds.filter(id => id !== neittIdToRemove) }
          : b
      )
    );
    setOwnedNeitts(prev =>
      prev.map(n =>
        n.instanceId === neittIdToRemove
          ? { ...n, assignedToBuildingInstanceId: null }
          : n
      )
    );
    const neittType = NEITTS_DATA.find(nt => nt.id === ownedNeitts.find(n => n.instanceId === neittIdToRemove)?.neittTypeId);
    toast({ title: "Neitt Unassigned", description: `${neittType?.name || 'Neitt'} is no longer assigned to ${building.name}.` });
  }, [ownedProductionBuildings, ownedNeitts, toast]);


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
        neittSlaverLevel,
        neittSlaverXp,
        traderLevel,
        traderXp,
        totalMoneySpent,
        totalCropsHarvested,
        totalNeittsFed,
        gameStartTime,
        activeQuests,
        lastQuestGenerationTime,
        maxNeittsAllowed,
        ownedProductionBuildings,
        lastNeittArrivalTime, 
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
  }, [
      farms, currentFarmId, currency, harvestedInventory, ownedSeeds, upgrades,
      ownedNeitts, producedNits, selectedSeedFromOwnedId,
      farmLevel, farmXp, neittSlaverLevel, neittSlaverXp, traderLevel, traderXp,
      totalMoneySpent, totalCropsHarvested, totalNeittsFed, gameStartTime,
      activeQuests, lastQuestGenerationTime,
      maxNeittsAllowed, ownedProductionBuildings, lastNeittArrivalTime, 
      toast, isClient
  ]);

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
    setNeittSlaverLevel(INITIAL_NEITT_SLAVER_LEVEL);
    setNeittSlaverXp(INITIAL_NEITT_SLAVER_XP);
    setTraderLevel(INITIAL_TRADER_LEVEL);
    setTraderXp(INITIAL_TRADER_XP);
    setTotalMoneySpent(0);
    setTotalCropsHarvested(0);
    setTotalNeittsFed(0);
    setGameStartTime(Date.now());
    setActiveQuests([]);
    setLastQuestGenerationTime(Date.now());
    setMaxNeittsAllowed(INITIAL_MAX_NEITTS_ALLOWED); 
    setOwnedProductionBuildings([]); 
    setLastNeittArrivalTime(Date.now()); 
    setNeittArrivalProgress(0);
  

    if (showToast) {
      toast({
        title: "Game Reset",
        description: "Started a new farm! Your saved data (if any) is still preserved unless cleared manually.",
      });
    }
  }, [toast]);

  const clearSavedData = useCallback(() => {
    if (!isClient) return;
    try {
      localStorage.removeItem(SAVE_GAME_KEY);
      resetGameStates(false);
      toast({
        title: "Saved Data Cleared",
        description: "All your saved progress has been removed. Starting a fresh game.",
      });
    } catch (error) {
      console.error("Failed to clear saved data:", error);
      toast({
        title: "Error Clearing Data",
        description: "Could not clear saved data. See console for details.",
        variant: "destructive",
      });
    }
  }, [isClient, resetGameStates, toast]);

  const toggleNightMode = useCallback(() => {
    if (!isClient) return;
    setIsNightMode(prevMode => {
      const newMode = !prevMode;
      newMode ? document.body.classList.add('dark') : document.body.classList.remove('dark');
      localStorage.setItem('harvestClickerNightMode', String(newMode));
      return newMode;
    });
  }, [isClient]);


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
          } else if (Array.isArray(gameState.plots)) { 
            const migratedFarm1Plots = gameState.plots.map((p: any, idx: number) => ({
                id: p.id || `farm-1-plot-${idx+1}`,
                cropId: p.cropId,
                plantTime: p.plantTime,
                isHarvestable: p.isHarvestable || false,
            }));
            loadedFarms = [{ id: 'farm-1', name: 'Farm 1', plots: migratedFarm1Plots }];
            if (gameState.upgrades?.expandFarm && !gameState.upgrades?.unlockFarm2) { 
                if(!loadedFarms.find(f => f.id === 'farm-2')) {
                    loadedFarms.push({ id: 'farm-2', name: 'Farm 2', plots: generateInitialPlots(INITIAL_NUM_PLOTS, 'farm-2')});
                }
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
          if ('buildHouse' in loadedUpgrades) { 
            delete (loadedUpgrades as any).buildHouse;
          }
          setUpgrades(loadedUpgrades);

          setFarmLevel(gameState.farmLevel || INITIAL_FARM_LEVEL);
          setFarmXp(gameState.farmXp || INITIAL_FARM_XP);
          setNeittSlaverLevel(gameState.neittSlaverLevel || INITIAL_NEITT_SLAVER_LEVEL);
          setNeittSlaverXp(gameState.neittSlaverXp || INITIAL_NEITT_SLAVER_XP);
          setTraderLevel(gameState.traderLevel || INITIAL_TRADER_LEVEL);
          setTraderXp(gameState.traderXp || INITIAL_TRADER_XP);

          setTotalMoneySpent(gameState.totalMoneySpent || 0);
          setTotalCropsHarvested(gameState.totalCropsHarvested || 0);
          setTotalNeittsFed(gameState.totalNeittsFed || 0);
          if (typeof gameState.gameStartTime === 'number' && gameState.gameStartTime > 0) {
            setGameStartTime(gameState.gameStartTime);
          } else {
            setGameStartTime(Date.now());
          }

          setActiveQuests(gameState.activeQuests || []);
          const loadedLastQuestTime = gameState.lastQuestGenerationTime || 0;
          if (Date.now() - loadedLastQuestTime > QUEST_GENERATION_INTERVAL * 2) {
            setLastQuestGenerationTime(Date.now() - QUEST_GENERATION_INTERVAL + (QUEST_CHECK_INTERVAL * 2) );
          } else {
            setLastQuestGenerationTime(loadedLastQuestTime);
          }
          
          setMaxNeittsAllowed(gameState.maxNeittsAllowed || INITIAL_MAX_NEITTS_ALLOWED);
          
          const loadedOwnedBuildings = (gameState.ownedProductionBuildings || []).map((b:any) => ({
            ...b,
            lastProductionCycleTime: b.lastProductionCycleTime || 0,
          }));
          setOwnedProductionBuildings(loadedOwnedBuildings);

          setLastNeittArrivalTime(gameState.lastNeittArrivalTime || Date.now());


          if (gameState.upgrades?.buildHouse && !gameState.maxNeittsAllowed) { 
             setMaxNeittsAllowed(INITIAL_MAX_NEITTS_ALLOWED +1); 
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
                assignedToBuildingInstanceId: neittFromFile.assignedToBuildingInstanceId || null,
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
      }
    } catch (error) {
      console.error("Failed to load game:", error);
      toast({
        title: "Error Loading Game",
        description: "Could not load your progress. Starting fresh.",
        variant: "destructive",
      });
      resetGameStates(false);
    }
  }, [toast, isClient, resetGameStates]);

  useEffect(() => {
    if (isClient) {
      loadGame();

      // Load saved game time
      const savedGameTime = localStorage.getItem('harvestClickerGameTime');
      if (savedGameTime) {
        const elapsed = parseInt(savedGameTime, 10);
        setGameStartTime(Date.now() - elapsed);
        localStorage.removeItem('harvestClickerGameTime'); // Clear after loading
      } else if (gameStartTime === 0) {
        setGameStartTime(Date.now()); // Start a new timer if no saved time
      }
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

  const xpForNextFarmLevel = calculateXpToNextLevel(farmLevel);
  const xpForNextNeittSlaverLevel = calculateXpToNextLevel(neittSlaverLevel);
  const xpForNextTraderLevel = calculateXpToNextLevel(traderLevel);
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
            xpForNextLevel={xpForNextFarmLevel}
            neittSlaverLevel={neittSlaverLevel}
            neittSlaverXp={neittSlaverXp}
            xpForNextNeittSlaverLevel={xpForNextNeittSlaverLevel}
            traderLevel={traderLevel}
            traderXp={traderXp}
            xpForNextTraderLevel={xpForNextTraderLevel}


            farms={farms}
            currentFarmId={currentFarmId}
            onFarmChange={setCurrentFarmId}

            totalMoneySpent={totalMoneySpent}
            totalCropsHarvested={totalCropsHarvested}
            totalNeittsFed={totalNeittsFed}
            formattedGameTime={formattedGameTime}

            activeQuests={activeQuests}
            onCompleteQuest={handleCompleteQuest}

            maxNeittsAllowed={maxNeittsAllowed}
            onBuildAdditionalHouse={handleBuildAdditionalHouse}
            ADDITIONAL_HOUSE_COST={ADDITIONAL_HOUSE_COST}
            neittArrivalProgress={neittArrivalProgress}


            productionBuildingTypesData={PRODUCTION_BUILDING_TYPES_DATA}
            ownedProductionBuildings={ownedProductionBuildings}
            onBuildProductionBuilding={handleBuildProductionBuilding}
            onAddNeittToFactory={handleAddNeittToFactory}
            onRemoveNeittFromFactory={handleRemoveNeittFromFactory}
           
          />
        </div>
        <div className="pt-4 text-center space-y-2 sm:space-y-0 sm:flex sm:justify-center sm:space-x-2">
            <Button onClick={saveGame} variant="outline" className="flex items-center gap-2 mx-auto sm:mx-0 mb-2 sm:mb-0">
                <Save className="w-4 h-4" /> Save Game
            </Button>
            <Button variant="outline" onClick={toggleNightMode} className="flex items-center gap-2 mx-auto sm:mx-0">
              Night Mode
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="flex items-center gap-2 mx-auto sm:mx-0">
                  <Trash2 className="w-4 h-4" /> Clear Saved Data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="text-destructive" /> Are you absolutely sure?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your
                    saved game progress from this browser.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={clearSavedData}
                    className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                  >
                    Yes, delete my data
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
        </div>
      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground">
        Harvest Clicker - Made by AloneNeitt
      </footer>
    </div>
  );
}

