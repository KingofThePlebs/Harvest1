
"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { PlotState, InventoryItem, Crop, UpgradesState, UpgradeId, LeaderboardEntry } from '@/types';
import { CROPS_DATA } from '@/config/crops';
import { UPGRADES_DATA } from '@/config/upgrades';
import GameHeader from '@/components/game/GameHeader';
import PlantingArea from '@/components/game/PlantingArea';
import SeedShopPanel from '@/components/game/SeedShopPanel';
import InventoryAndShop from '@/components/game/InventoryAndShop';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { RefreshCcw, Save, Trash2 } from 'lucide-react'; 

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

const initialMockLeaderboard: LeaderboardEntry[] = [
  { id: 'mock-farmer-1', name: "Old Rusty", score: 150, isCurrentUser: false },
  { id: 'mock-farmer-2', name: "GreenThumb Gina", score: 320, isCurrentUser: false },
  { id: 'mock-farmer-3', name: "Speedy Sam", score: 80, isCurrentUser: false },
];


export default function HarvestClickerPage() {
  const [plots, setPlots] = useState<PlotState[]>(() => generateInitialPlots(INITIAL_NUM_PLOTS));
  const [currency, setCurrency] = useState<number>(INITIAL_CURRENCY);
  const [harvestedInventory, setHarvestedInventory] = useState<InventoryItem[]>([]);
  const [ownedSeeds, setOwnedSeeds] = useState<InventoryItem[]>([]);
  const [selectedSeedFromOwnedId, setSelectedSeedFromOwnedId] = useState<string | undefined>(undefined);
  const [upgrades, setUpgrades] = useState<UpgradesState>(initialUpgradesState);
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  const [playerName, setPlayerName] = useState<string>("");
  const [mockLeaderboardSeed, setMockLeaderboardSeed] = useState<LeaderboardEntry[]>(initialMockLeaderboard);

  const leaderboardData = useMemo(() => {
    const currentUserEntry: LeaderboardEntry = { 
      id: 'current-user', 
      name: playerName || "Anonymous Farmer", 
      score: currency, 
      isCurrentUser: true 
    };

    let combinedLeaderboard: LeaderboardEntry[];

    if (playerName && playerName.trim() !== "") {
      // Filter out any mock entry that might have the same name as the current player to avoid duplicates if player uses a mock name
      const filteredMockData = mockLeaderboardSeed.filter(entry => entry.name.toLowerCase() !== playerName.toLowerCase());
      combinedLeaderboard = [...filteredMockData, currentUserEntry];
    } else {
      // If player name is not set, just show mock data (current user won't be listed distinctly)
      combinedLeaderboard = [...mockLeaderboardSeed];
    }
    
    return combinedLeaderboard
      .sort((a, b) => b.score - a.score)
      .map((entry, index) => ({...entry, id: entry.isCurrentUser ? 'current-user' : `rank-${index}-${entry.name}`})); // Ensure unique keys for rendering
  }, [playerName, currency, mockLeaderboardSeed]);


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
        return updatedSeeds.filter(s => s.quantity > 0); // Keep only seeds with quantity > 0
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

  const saveGame = useCallback(() => {
    if (!isClient) return;
    try {
      const gameState = {
        plots,
        currency,
        harvestedInventory,
        ownedSeeds,
        upgrades,
        playerName,
        mockLeaderboardSeed, // Save mock seed data if it were editable, for now it's static but good practice if it changes
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
  }, [plots, currency, harvestedInventory, ownedSeeds, upgrades, playerName, mockLeaderboardSeed, toast, isClient]);

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
          setPlayerName(gameState.playerName || "");
          setMockLeaderboardSeed(gameState.mockLeaderboardSeed || initialMockLeaderboard);
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
            setPlayerName("");
            setMockLeaderboardSeed(initialMockLeaderboard);
            setSelectedSeedFromOwnedId(undefined);
        }
      } else {
         toast({
            title: "Welcome Farmer!",
            description: "Starting a new game. Good luck!",
          });
          setPlayerName(""); // Ensure player name is empty for new game
          setMockLeaderboardSeed(initialMockLeaderboard); // Set initial mock leaderboard
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
      setPlayerName("");
      setMockLeaderboardSeed(initialMockLeaderboard);
      setSelectedSeedFromOwnedId(undefined);
    }
  }, [toast, isClient]);


  const clearSaveData = () => {
    if (!isClient) return;
    localStorage.removeItem(SAVE_GAME_KEY);
    toast({
      title: "Save Data Cleared",
      description: "Your saved progress has been removed. Reset the game or refresh to start completely fresh.",
    });
  };
  
  const resetGame = () => {
    setPlots(generateInitialPlots(INITIAL_NUM_PLOTS));
    setCurrency(INITIAL_CURRENCY);
    setHarvestedInventory([]);
    setOwnedSeeds([]);
    setSelectedSeedFromOwnedId(undefined);
    setUpgrades(initialUpgradesState);
    setPlayerName(""); // Reset player name
    setMockLeaderboardSeed(initialMockLeaderboard); // Reset leaderboard to initial mock

    toast({
      title: "Game Reset",
      description: "Started a new farm! Your saved data (if any) is still preserved unless cleared manually.",
    });
  };
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Effect for loading game on initial client mount
  useEffect(() => {
    if (isClient) {
      loadGame();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClient]); // loadGame is stable due to its useCallback deps (toast, isClient)

  // Effect for autosave on beforeunload
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
            // Ensure plot IDs are unique and consistent, especially after loading/expanding
            const basePlots = plots.slice(0, Math.min(plots.length, expectedPlotCount));
            const newPlotsNeeded = expectedPlotCount - basePlots.length;
            
            let finalPlots = [...basePlots];
            if (newPlotsNeeded > 0) {
                const additionalPlots = Array.from({ length: newPlotsNeeded }, (_, i) => ({
                    id: `plot-${basePlots.length + i + 1}`, // Ensure new plots get unique IDs
                    isHarvestable: false,
                }));
                finalPlots = [...basePlots, ...additionalPlots];
            } else if (newPlotsNeeded < 0) { // Too many plots
                finalPlots = basePlots.slice(0, expectedPlotCount);
            }
            
            // Re-ID all plots to ensure consistency from plot-1 to plot-N
            const reIdPlots = finalPlots.map((plot, index) => ({
                ...plot,
                id: `plot-${index + 1}`
            }));
            setPlots(reIdPlots);
        }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClient, upgrades.expandFarm, plots.length]); // plots.length to re-evaluate if count changes externally.


  if (!isClient) {
    return (
      <div className="flex flex-col min-h-screen bg-background items-center justify-center">
        <div className="text-2xl text-primary-foreground animate-pulse">Loading Farm...</div>
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
            playerName={playerName}
            onPlayerNameChange={setPlayerName}
            leaderboardData={leaderboardData}
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
                <Trash2 className="w-4 h-4" /> Clear Saved Data
            </Button>
        </div>
      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground">
        Harvest Clicker - Made with Firebase Studio
      </footer>
    </div>
  );
}
