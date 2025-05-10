"use client";

import { useState, useEffect, useCallback } from 'react';
import type { PlotState, InventoryItem, Crop } from '@/types';
import { CROPS_DATA } from '@/config/crops';
import GameHeader from '@/components/game/GameHeader';
import PlantingArea from '@/components/game/PlantingArea';
import AvailableCropsPanel from '@/components/game/AvailableCropsPanel';
import InventoryAndShop from '@/components/game/InventoryAndShop';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';

const INITIAL_CURRENCY = 20;
const NUM_PLOTS = 6;

const generateInitialPlots = (count: number): PlotState[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `plot-${i + 1}`,
    isHarvestable: false,
  }));
};

export default function HarvestClickerPage() {
  const [plots, setPlots] = useState<PlotState[]>(() => generateInitialPlots(NUM_PLOTS));
  const [currency, setCurrency] = useState<number>(INITIAL_CURRENCY);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [selectedCropToPlantId, setSelectedCropToPlantId] = useState<string | undefined>(undefined);
  const { toast } = useToast();

  const handleSelectCrop = (cropId: string) => {
    setSelectedCropToPlantId(cropId);
    const crop = CROPS_DATA.find(c => c.id === cropId);
    toast({
      title: `${crop?.name || 'Crop'} Selected`,
      description: "Click on an empty plot to plant.",
    });
  };

  const handlePlantCrop = useCallback((plotId: string, cropIdToPlant: string) => {
    const cropToPlant = CROPS_DATA.find(c => c.id === cropIdToPlant);
    if (!cropToPlant) return;

    // Basic check if player can "afford" planting, though seeds are free in this version
    // if (currency < (cropToPlant.buyPrice || 0)) { // Assuming a buyPrice if seeds cost money
    //   toast({ title: "Not enough currency to buy seeds!", variant: "destructive" });
    //   return;
    // }

    setPlots(prevPlots =>
      prevPlots.map(p =>
        p.id === plotId
          ? { ...p, cropId: cropIdToPlant, plantTime: Date.now() }
          : p
      )
    );
    // setCurrency(prevCurrency => prevCurrency - (cropToPlant.buyPrice || 0));
    setSelectedCropToPlantId(undefined); // Deselect after planting
    toast({
      title: `${cropToPlant.name} planted!`,
      description: "Watch it grow.",
    });
  }, [toast]);

  const handleHarvestCrop = useCallback((plotId: string, harvestedCropId: string) => {
    const crop = CROPS_DATA.find(c => c.id === harvestedCropId);
    if (!crop) return;

    setPlots(prevPlots =>
      prevPlots.map(p =>
        p.id === plotId ? { ...p, cropId: undefined, plantTime: undefined } : p
      )
    );

    setInventory(prevInventory => {
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
      description: "It's now in your inventory.",
    });
  }, [toast]);

  const handleSellCrop = useCallback((cropIdToSell: string, quantity: number) => {
    const crop = CROPS_DATA.find(c => c.id === cropIdToSell);
    if (!crop) return;

    const itemInInventory = inventory.find(item => item.cropId === cropIdToSell);
    if (!itemInInventory || itemInInventory.quantity < quantity) {
      toast({ title: "Not enough crops to sell!", variant: "destructive" });
      return;
    }

    setInventory(prevInventory =>
      prevInventory
        .map(item =>
          item.cropId === cropIdToSell
            ? { ...item, quantity: item.quantity - quantity }
            : item
        )
        .filter(item => item.quantity > 0)
    );

    setCurrency(prevCurrency => prevCurrency + crop.sellPrice * quantity);
    toast({
      title: `Sold ${quantity} ${crop.name}(s)!`,
      description: `You earned ${crop.sellPrice * quantity} gold.`,
    });
  }, [inventory, toast]);

  const resetGame = () => {
    setPlots(generateInitialPlots(NUM_PLOTS));
    setCurrency(INITIAL_CURRENCY);
    setInventory([]);
    setSelectedCropToPlantId(undefined);
    toast({
      title: "Game Reset",
      description: "Started a new farm!",
    });
  };
  
  // Client-side check for hydration
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Or a loading spinner
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <GameHeader currency={currency} />
      <main className="flex-grow container mx-auto p-4 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <AvailableCropsPanel 
              onSelectCrop={handleSelectCrop}
              selectedCropId={selectedCropToPlantId}
            />
          </div>
          <div className="lg:col-span-2">
            <PlantingArea
              plots={plots}
              onPlant={handlePlantCrop}
              onHarvest={handleHarvestCrop}
              selectedCropToPlantId={selectedCropToPlantId}
            />
          </div>
        </div>
        <div>
          <InventoryAndShop 
            inventory={inventory} 
            onSellCrop={handleSellCrop} 
            currency={currency}
          />
        </div>
        <div className="pt-4 text-center">
            <Button onClick={resetGame} variant="outline" className="flex items-center gap-2 mx-auto">
                <RefreshCcw className="w-4 h-4" /> Reset Game
            </Button>
        </div>
      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground">
        Harvest Clicker - Made with Firebase Studio
      </footer>
    </div>
  );
}
