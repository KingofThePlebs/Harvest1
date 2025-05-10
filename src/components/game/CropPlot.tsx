"use client";

import type { FC } from 'react';
import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import type { Crop, PlotState } from '@/types';
import { CROPS_DATA } from '@/config/crops';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Zap } from 'lucide-react'; // Zap for harvest ready

interface CropPlotProps {
  plot: PlotState;
  onPlant: (plotId: string, cropId: string) => void;
  onHarvest: (plotId: string, cropId: string) => void;
  selectedCropToPlantId?: string;
}

const CropPlot: FC<CropPlotProps> = ({ plot, onPlant, onHarvest, selectedCropToPlantId }) => {
  const [progress, setProgress] = useState(0);
  const [isReadyToHarvest, setIsReadyToHarvest] = useState(false);

  const plantedCrop = useMemo(() => {
    return plot.cropId ? CROPS_DATA.find(c => c.id === plot.cropId) : undefined;
  }, [plot.cropId]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;

    if (plantedCrop && plot.plantTime) {
      const updateGrowth = () => {
        const elapsedTime = Date.now() - (plot.plantTime ?? 0);
        const currentProgress = Math.min(100, (elapsedTime / plantedCrop.growTime) * 100);
        setProgress(currentProgress);

        if (currentProgress >= 100) {
          setIsReadyToHarvest(true);
          if (intervalId) clearInterval(intervalId);
        } else {
          setIsReadyToHarvest(false);
        }
      };

      updateGrowth(); // Initial check
      if (progress < 100) {
        intervalId = setInterval(updateGrowth, 100); // Update every 100ms
      }
    } else {
      setProgress(0);
      setIsReadyToHarvest(false);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [plantedCrop, plot.plantTime, progress]); // Added progress to dependencies to re-evaluate interval

  const handlePlotClick = () => {
    if (isReadyToHarvest && plantedCrop) {
      onHarvest(plot.id, plantedCrop.id);
    } else if (!plantedCrop && selectedCropToPlantId) {
      onPlant(plot.id, selectedCropToPlantId);
    }
  };
  
  const CropIcon = plantedCrop?.icon;

  return (
    <Card className="w-full aspect-square flex flex-col items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300 bg-background/70">
      <CardHeader className="p-2 pt-4 text-center">
        <CardTitle className="text-sm truncate">{plantedCrop?.name || 'Empty Plot'}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col items-center justify-center p-2 w-full">
        {plantedCrop ? (
          <div className="flex flex-col items-center justify-center space-y-2 w-full">
            {CropIcon ? (
              <CropIcon className="w-12 h-12 text-green-600" />
            ) : plantedCrop.imageUrl ? (
              <Image 
                src={plantedCrop.imageUrl} 
                alt={plantedCrop.name} 
                width={48} 
                height={48} 
                className="object-contain rounded-md"
                data-ai-hint={plantedCrop.dataAiHint}
              />
            ) : <Leaf className="w-12 h-12 text-gray-400" /> }
            {!isReadyToHarvest && (
              <Progress value={progress} className="w-3/4 h-3 transition-all duration-100" />
            )}
            {isReadyToHarvest && (
              <div className="text-xs font-semibold text-green-500 flex items-center animate-pulse">
                <Zap className="w-4 h-4 mr-1" /> Ready!
              </div>
            )}
          </div>
        ) : (
          <Leaf className="w-12 h-12 text-muted-foreground opacity-50" />
        )}
      </CardContent>
      <CardFooter className="p-2 pb-4 w-full">
        <Button 
          onClick={handlePlotClick} 
          disabled={(!plantedCrop && !selectedCropToPlantId) || (plantedCrop && !isReadyToHarvest && progress < 100)}
          className="w-full text-xs h-8"
          variant={isReadyToHarvest ? "default" : "secondary"}
        >
          {isReadyToHarvest ? 'Harvest' : plantedCrop ? 'Growing...' : selectedCropToPlantId ? 'Plant' : 'Select Crop'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CropPlot;
