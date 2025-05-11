
"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type { PlotState, InventoryItem, Crop, UpgradesState, UpgradeId, OwnedNeitt, OwnedNit, Nit, NeittType } from '@/types';
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
import { RefreshCcw, Save, Trash2, Loader2 } from 'lucide-react';

const INITIAL_CURRENCY = 20;
const INITIAL_NUM_PLOTS = 6;
const PLOT_EXPANSION_AMOUNT = 3;
const SAVE_GAME_KEY = 'harvestClickerSaveData';

const generateInitialPlots = (count: number): PlotState[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `plot-${i + 1}`,
    isHarvestable: false,
  }));
};

const initialUpgradesState: UpgradesState = {
  fertilizer: false,
  negotiationSkills: false,
  bulkDiscount: false,
  expandFarm: false,
};

export default function HarvestClickerPage() {
  const [plots, setPlots] = useState<PlotState[]>(() => generateInitialPlots(INITIAL_NUM_PLOTS));
  const [currency, setCurrency] = useState<number>(INITIAL_CURRENCY);
  const [harvestedInventory, setHarvestedInventory] = useState<InventoryItem[]>([]);
  const [ownedSeeds, setOwnedSeeds] = useState<InventoryItem[]>([]);
  const [selectedSeedFromOwnedId, setSelectedSeedFromOwnedId] = useState<string | undefined>(undefined);
  const [upgrades, setUpgrades] = useState<UpgradesState>(initialUpgradesState);
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  const [ownedNeitts, setOwnedNeitts] = useState<OwnedNeitt[]>([]);
  const [producedNits, setProducedNits] = useState<OwnedNit[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsClient(true);
    }
  }, []);

  // Neitt Production Logic
  useEffect(() => {
    if (!isClient) return;

    const productionInterval = setInterval(() => {
      const now = Date.now();
      let hasNeittStateChanged = false;
      const newlyProducedNitsMapForThisTick = new Map<string, number>();

      setOwnedNeitts(prevOwnedNeitts => {
        const nextOwnedNeitts = prevOwnedNeitts.map(neittInstance => {
          if (neittInstance.nitsLeftToProduce <= 0) {
            return neittInstance; // Hungry, do nothing until fed
          }

          const neittType = NEITTS_DATA.find(nt => nt.id === neittInstance.neittTypeId);
          if (!neittType) return neittInstance;

          const elapsedTime = now - neittInstance.lastProductionCycleStartTime;

          if (elapsedTime >= neittType.productionTime) {
            // Produce one Nit
            const currentAmount = newlyProducedNitsMapForThisTick.get(neittType.producesNitId) || 0;
            newlyProducedNitsMapForThisTick.set(neittType.producesNitId, currentAmount + 1);
            
            hasNeittStateChanged = true;
            const nitsNowLeft = neittInstance.nitsLeftToProduce - 1;

            return {
              ...neittInstance,
              lastProductionCycleStartTime: nitsNowLeft > 0 ? now : neittInstance.lastProductionCycleStartTime, // Reset timer for next nit, or keep if cycle ends
              nitsLeftToProduce: nitsNowLeft,
            };
          }
          return neittInstance;
        });

        if (newlyProducedNitsMapForThisTick.size > 0) {
          setProducedNits(currentGlobalProducedNits => {
            const updatedGlobalNits = [...currentGlobalProducedNits];
            newlyProducedNitsMapForThisTick.forEach((quantity, nitId) => {
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
        
        return hasNeittStateChanged ? nextOwnedNeitts : prevOwnedNeitts;
      });

    }, 1000); // Check every second

    return () => clearInterval(productionInterval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

    setPlots(prevPlots =>
      prevPlots.map(p =>
        p.id === plotId
          ? { ...p, cropId: selectedSeedFromOwnedId, plantTime: Date.now(), isHarvestable: false }
          : p
      )
    );

    setOwnedSeeds(prevOwnedSeeds => {
        const updatedSeeds = prevOwnedSeeds.map(s =>
            s.cropId === selectedSeedFromOwnedId ? {...s, quantity: s.quantity - 1} : s
        );
        return updatedSeeds.filter(s => s.quantity > 0);
    });

    // setSelectedSeedFromOwnedId(undefined); // Keep selected seed after planting as per user request
    toast({
      title: `${cropToPlant.name} planted!`,
      description: `One ${cropToPlant.name} seed used from inventory. Watch it grow.`,
    });
  }, [selectedSeedFromOwnedId, ownedSeeds, toast]);


  const handleHarvestCrop = useCallback((plotId: string, harvestedCropId: string) => {
    const crop = CROPS_DATA.find(c => c.id === harvestedCropId);
    if (!crop) return;

    setPlots(prevPlots =>
      prevPlots.map(p =>
        p.id === plotId ? { ...p, cropId: undefined, plantTime: undefined, isHarvestable: false } : p
      )
    );

    setHarvestedInventory(prevInventory => {
      const existingItemIndex = prevInventory.findIndex(item => item.cropId === harvestedCropId);
      if (existingItemIndex > -1) {
        const updatedInventory = [...prevInventory];
        updatedInventory[existingItemIndex].quantity += 1;
        return updatedInventory;
      }
      return [...prevInventory, { cropId: harvestedCropId, quantity: 1 }];
    });
    toast({
      title: `Harvested ${crop.name}!`,
      description: "It's now in your sell market inventory.",
    });
  }, [toast]);

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
    setUpgrades(prevUpgrades => ({ ...prevUpgrades, [upgradeId]: true }));

    if (upgradeId === 'expandFarm') {
      const currentPlotsCount = plots.length;
      const newPlotsToAdd = Array.from({ length: PLOT_EXPANSION_AMOUNT }, (_, i) => ({
        id: `plot-${currentPlotsCount + i + 1}`,
        isHarvestable: false,
      }));
      setPlots(prevPlots => [...prevPlots, ...newPlotsToAdd]);
    }

    toast({ title: "Upgrade Purchased!", description: `You bought ${upgradeToBuy.name} for ${upgradeToBuy.cost} gold.` });

  }, [currency, upgrades, toast, plots]);

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
    setOwnedNeitts(prevOwnedNeitts => {
      const newNeittInstance: OwnedNeitt = {
        instanceId: self.crypto.randomUUID(), 
        neittTypeId: neittId,
        lastProductionCycleStartTime: Date.now(), // Or 0, to be set on first feed
        nitsLeftToProduce: 0, // Starts hungry
      };
      return [...prevOwnedNeitts, newNeittInstance];
    });
    toast({ title: `${neittToBuy.name} Purchased!`, description: `A new ${neittToBuy.name} has joined your farm! Feed it to start production.` });
  }, [currency, toast]);


  const handleFeedNeitt = useCallback((instanceId: string) => {
    setOwnedNeitts(prevOwnedNeitts => {
      const neittIndex = prevOwnedNeitts.findIndex(n => n.instanceId === instanceId);
      if (neittIndex === -1) {
        toast({ title: "Neitt not found!", variant: "destructive" });
        return prevOwnedNeitts;
      }

      const neittInstance = prevOwnedNeitts[neittIndex];
      const neittType = NEITTS_DATA.find(nt => nt.id === neittInstance.neittTypeId);

      if (!neittType) {
        toast({ title: "Neitt type error!", variant: "destructive" });
        return prevOwnedNeitts;
      }

      if (neittInstance.nitsLeftToProduce > 0) {
        toast({ title: `${neittType.name} is already fed!`, description: "It's busy producing Nits." });
        return prevOwnedNeitts;
      }

      // For now, feeding is free. Add currency check here if feeding costs something.
      // Example: if (currency < FEED_COST) { toast(...); return prevOwnedNeitts; }
      // setCurrency(prev => prev - FEED_COST);

      const updatedNeitts = [...prevOwnedNeitts];
      updatedNeitts[neittIndex] = {
        ...neittInstance,
        nitsLeftToProduce: neittType.productionCapacity,
        lastProductionCycleStartTime: Date.now(),
      };

      toast({ title: `Fed ${neittType.name}!`, description: `It will now produce ${neittType.productionCapacity} Nits.` });
      return updatedNeitts;
    });
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
        plots,
        currency,
        harvestedInventory,
        ownedSeeds,
        upgrades,
        ownedNeitts, 
        producedNits,
        selectedSeedFromOwnedId, // Save selected seed
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
  }, [plots, currency, harvestedInventory, ownedSeeds, upgrades, ownedNeitts, producedNits, selectedSeedFromOwnedId, toast, isClient]);

  const loadGame = useCallback(() => {
    if (!isClient) return;
    try {
      const savedData = localStorage.getItem(SAVE_GAME_KEY);
      if (savedData) {
        const gameState = JSON.parse(savedData);
        if (gameState && typeof gameState.currency === 'number' && Array.isArray(gameState.plots)) {

          let finalPlots = gameState.plots || [];
          const finalUpgrades = gameState.upgrades || initialUpgradesState;

          if (finalUpgrades.expandFarm) {
            const expectedExpandedPlotCount = INITIAL_NUM_PLOTS + PLOT_EXPANSION_AMOUNT;
            if (finalPlots.length < expectedExpandedPlotCount) {
              const numExistingPlots = finalPlots.length;
              const numToAdd = expectedExpandedPlotCount - numExistingPlots;
              const newPlots = Array.from({ length: numToAdd }, (_, i) => ({
                id: `plot-loaded-expanded-${numExistingPlots + i + 1}`,
                isHarvestable: false,
              }));
              finalPlots = [...finalPlots, ...newPlots];
            } else if (finalPlots.length > expectedExpandedPlotCount) {
              finalPlots = finalPlots.slice(0, expectedExpandedPlotCount);
            }
          } else {
             if (finalPlots.length > INITIAL_NUM_PLOTS) {
               finalPlots = finalPlots.slice(0, INITIAL_NUM_PLOTS);
            } else if (finalPlots.length < INITIAL_NUM_PLOTS && finalPlots.length >= 0) { // ensure length is not negative
               const numToAdd = INITIAL_NUM_PLOTS - finalPlots.length;
               const newPlots = Array.from({ length: numToAdd }, (_, i) => ({
                id: `plot-loaded-initialfill-${finalPlots.length + i + 1}`,
                isHarvestable: false,
              }));
              finalPlots = [...finalPlots, ...newPlots];
            } else if (finalPlots.length === 0) {
              finalPlots = generateInitialPlots(INITIAL_NUM_PLOTS);
            }
          }
          
          setPlots(finalPlots);
          setCurrency(gameState.currency);
          setHarvestedInventory(gameState.harvestedInventory || []);
          setOwnedSeeds(gameState.ownedSeeds || []);
          setUpgrades(finalUpgrades);
          
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

              const instanceId = neittFromFile.instanceId || self.crypto.randomUUID();
              const lastProductionCycleStartTime = typeof neittFromFile.lastProductionCycleStartTime === 'number' 
                                                  ? neittFromFile.lastProductionCycleStartTime 
                                                  : Date.now();
              const nitsLeftToProduce = typeof neittFromFile.nitsLeftToProduce === 'number' 
                                        ? neittFromFile.nitsLeftToProduce
                                        : 0; // Default to hungry if undefined
              
              processedNeitts.push({
                instanceId: instanceId,
                neittTypeId: neittTypeId,
                lastProductionCycleStartTime: lastProductionCycleStartTime,
                nitsLeftToProduce: nitsLeftToProduce,
              });
            });
          }
          setOwnedNeitts(processedNeitts);
          
          setProducedNits(gameState.producedNits || []);
          setSelectedSeedFromOwnedId(gameState.selectedSeedFromOwnedId || undefined); // Load selected seed

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
            resetGameStates(false); // Start fresh without toast
        }
      } else {
         toast({
            title: "Welcome Farmer!",
            description: "Starting a new game. Good luck!",
          });
         resetGameStates(false); // Start fresh without toast
      }
    } catch (error) {
      console.error("Failed to load game:", error);
      toast({
        title: "Error Loading Game",
        description: "Could not load your progress. Starting fresh.",
        variant: "destructive",
      });
      resetGameStates(false); // Start fresh without toast
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast, isClient]); // resetGameStates is not a dependency here


  const resetGameStates = useCallback((showToast: boolean = true) => {
    setPlots(generateInitialPlots(INITIAL_NUM_PLOTS));
    setCurrency(INITIAL_CURRENCY);
    setHarvestedInventory([]);
    setOwnedSeeds([]);
    setSelectedSeedFromOwnedId(undefined);
    setUpgrades(initialUpgradesState);
    setOwnedNeitts([]);
    setProducedNits([]);
    if (showToast) {
      toast({
        title: "Game Reset",
        description: "Started a new farm! Your saved data (if any) is still preserved unless cleared manually.",
      });
    }
  }, [toast]);


  const clearSaveData = () => {
    if (!isClient) return;
    localStorage.removeItem(SAVE_GAME_KEY);
    resetGameStates(false); // Reset state without new game toast
    toast({
      title: "Game Save Data Cleared",
      description: "Your saved game progress has been removed. The game has been reset.",
    });
  };

  const resetGame = () => {
    resetGameStates(true);
  };
  

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

  useEffect(() => {
    if (isClient) {
        const expectedPlotCount = upgrades.expandFarm ? INITIAL_NUM_PLOTS + PLOT_EXPANSION_AMOUNT : INITIAL_NUM_PLOTS;
        if (plots.length !== expectedPlotCount) {
            // This logic ensures plots are correctly added or removed based on 'expandFarm' upgrade,
            // while preserving existing plot data as much as possible.
            let currentPlots = [...plots];
            if (plots.length < expectedPlotCount) { // Need to add plots
                const numToAdd = expectedPlotCount - plots.length;
                const newPlots = Array.from({ length: numToAdd }, (_, i) => ({
                    id: `plot-autogen-${plots.length + i + 1}`,
                    isHarvestable: false,
                }));
                currentPlots = [...currentPlots, ...newPlots];
            } else { // Need to remove plots
                currentPlots = currentPlots.slice(0, expectedPlotCount);
            }
            // Re-ID plots to ensure consistent plot IDs like plot-1, plot-2, etc.
            const reIdPlots = currentPlots.map((plot, index) => ({
                ...plot,
                id: `plot-${index + 1}` 
            }));
            setPlots(reIdPlots);
        }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClient, upgrades.expandFarm]); // plots dependency removed from here

  if (!isClient) {
    return (
      <div className="flex flex-col min-h-screen bg-background items-center justify-center">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
        <div className="text-2xl text-primary-foreground mt-4">Loading Farm...</div>
      </div>
    );
  }

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
              plots={plots}
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
            onFeedNeitt={handleFeedNeitt} // Pass down the new handler
            
            producedNits={producedNits}
            nitsData={NITS_DATA}
            onSellNit={handleSellNit}
          />
        </div>
        <div className="pt-4 text-center space-y-2 sm:space-y-0 sm:space-x-2">
            <Button onClick={saveGame} variant="outline" className="flex items-center gap-2 mx-auto sm:mx-0 sm:inline-flex">
                <Save className="w-4 h-4" /> Save Game
            </Button>
            <Button onClick={resetGame} variant="outline" className="flex items-center gap-2 mx-auto sm:mx-0 sm:inline-flex">
                <RefreshCcw className="w-4 h-4" /> Reset Game
            </Button>
            <Button onClick={clearSaveData} variant="destructive" className="flex items-center gap-2 mx-auto sm:mx-0 sm:inline-flex">
                <Trash2 className="w-4 h-4" /> Clear Saved Game Data
            </Button>
        </div>
      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground">
        Harvest Clicker - Made with Firebase Studio
      </footer>
    </div>
  );
}
