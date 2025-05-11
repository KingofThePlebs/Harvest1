
"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type { PlotState, InventoryItem, Crop, UpgradesState, UpgradeId, OwnedNeitt, OwnedNit, Nit } from '@/types';
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
      
      setOwnedNeitts(prevOwnedNeitts => {
        let hasNeittStateChanged = false;
        const newlyProducedNitsMapForThisTick = new Map<string, number>();

        const nextOwnedNeitts = prevOwnedNeitts.map(neittInstance => {
          const neittType = NEITTS_DATA.find(nt => nt.id === neittInstance.neittTypeId);
          if (!neittType) return neittInstance;

          const elapsedTime = now - neittInstance.lastProductionCycleStartTime;
          if (elapsedTime >= neittType.productionTime) {
            const currentAmount = newlyProducedNitsMapForThisTick.get(neittType.producesNitId) || 0;
            newlyProducedNitsMapForThisTick.set(neittType.producesNitId, currentAmount + 1);
            hasNeittStateChanged = true;
            return { ...neittInstance, lastProductionCycleStartTime: now };
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
        instanceId: self.crypto.randomUUID(), //Requires isClient check or ensure only called client-side
        neittTypeId: neittId,
        lastProductionCycleStartTime: Date.now(),
      };
      return [...prevOwnedNeitts, newNeittInstance];
    });
    toast({ title: `${neittToBuy.name} Purchased!`, description: `A new ${neittToBuy.name} has joined your farm!` });
  }, [currency, toast]);

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
    
    // Nits don't have negotiation skills applied, direct sell price
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
  }, [plots, currency, harvestedInventory, ownedSeeds, upgrades, ownedNeitts, producedNits, toast, isClient]);

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
               finalPlots = generateInitialPlots(INITIAL_NUM_PLOTS);
            } else if (finalPlots.length < INITIAL_NUM_PLOTS && finalPlots.length > 0) {
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
          setOwnedNeitts(gameState.ownedNeitts || []); 
          setProducedNits(gameState.producedNits || []);
          setSelectedSeedFromOwnedId(undefined);

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
            setPlots(generateInitialPlots(INITIAL_NUM_PLOTS));
            setCurrency(INITIAL_CURRENCY);
            setHarvestedInventory([]);
            setOwnedSeeds([]);
            setUpgrades(initialUpgradesState);
            setOwnedNeitts([]);
            setProducedNits([]);
            setSelectedSeedFromOwnedId(undefined);
        }
      } else {
         toast({
            title: "Welcome Farmer!",
            description: "Starting a new game. Good luck!",
          });
      }
    } catch (error) {
      console.error("Failed to load game:", error);
      toast({
        title: "Error Loading Game",
        description: "Could not load your progress. Starting fresh.",
        variant: "destructive",
      });
      setPlots(generateInitialPlots(INITIAL_NUM_PLOTS));
      setCurrency(INITIAL_CURRENCY);
      setHarvestedInventory([]);
      setOwnedSeeds([]);
      setUpgrades(initialUpgradesState);
      setOwnedNeitts([]);
      setProducedNits([]);
      setSelectedSeedFromOwnedId(undefined);
    }
  }, [toast, isClient]);

  const clearSaveData = () => {
    if (!isClient) return;
    localStorage.removeItem(SAVE_GAME_KEY);
    toast({
      title: "Game Save Data Cleared",
      description: "Your saved game progress has been removed. Reset the game or refresh to start fresh.",
    });
    setPlots(generateInitialPlots(INITIAL_NUM_PLOTS));
    setCurrency(INITIAL_CURRENCY);
    setHarvestedInventory([]);
    setOwnedSeeds([]);
    setSelectedSeedFromOwnedId(undefined);
    setUpgrades(initialUpgradesState);
    setOwnedNeitts([]);
    setProducedNits([]);
  };

  const resetGame = () => {
    setPlots(generateInitialPlots(INITIAL_NUM_PLOTS));
    setCurrency(INITIAL_CURRENCY);
    setHarvestedInventory([]);
    setOwnedSeeds([]);
    setSelectedSeedFromOwnedId(undefined);
    setUpgrades(initialUpgradesState);
    setOwnedNeitts([]);
    setProducedNits([]);
    toast({
      title: "Game Reset",
      description: "Started a new farm! Your saved data (if any) is still preserved unless cleared manually.",
    });
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
  }, [isClient, saveGame, currency]); // currency dependency for saveGame not strictly needed for auto-save on unload but kept from original

  useEffect(() => {
    if (isClient) {
        const expectedPlotCount = upgrades.expandFarm ? INITIAL_NUM_PLOTS + PLOT_EXPANSION_AMOUNT : INITIAL_NUM_PLOTS;
        if (plots.length !== expectedPlotCount) {
            const basePlots = plots.slice(0, Math.min(plots.length, expectedPlotCount));
            const newPlotsNeeded = expectedPlotCount - basePlots.length;

            let finalPlots = [...basePlots];
            if (newPlotsNeeded > 0) {
                const additionalPlots = Array.from({ length: newPlotsNeeded }, (_, i) => ({
                    id: `plot-autogen-${basePlots.length + i + 1}`,
                    isHarvestable: false,
                }));
                finalPlots = [...basePlots, ...additionalPlots];
            } else if (newPlotsNeeded < 0) {
                finalPlots = basePlots.slice(0, expectedPlotCount);
            }

            const reIdPlots = finalPlots.map((plot, index) => ({
                ...plot,
                id: `plot-${index + 1}`
            }));
            setPlots(reIdPlots);
        }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClient, upgrades.expandFarm]);


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
