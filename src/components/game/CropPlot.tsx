
"use client";

import type { FC } from 'react';
import { useState, useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import type { PlotState } from '@/types';
import { CROPS_DATA } from '@/config/crops';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';


interface CropPlotProps {
  plot: PlotState;
  onPlant: (plotId: string) => void;
  onHarvest: (plotId: string, cropId: string) => void;
  selectedSeedId?: string;
  getEffectiveCropGrowTime: (baseTime: number) => number;
}

const CropPlot: FC<CropPlotProps> = ({ plot, onPlant, onHarvest, selectedSeedId, getEffectiveCropGrowTime }) => {
  const [progress, setProgress] = useState(0);
  const [isReadyToHarvest, setIsReadyToHarvest] = useState(plot.isHarvestable || false);
  const plotCardRef = useRef<HTMLDivElement>(null);
  const [showHarvestEffect, setShowHarvestEffect] = useState(false);
  const effectTimeoutRef = useRef<NodeJS.Timeout | null>(null);


  const plantedCrop = useMemo(() => {
    return plot.cropId ? CROPS_DATA.find(c => c.id === plot.cropId) : undefined;
  }, [plot.cropId]);

  const effectiveGrowTime = useMemo(() => {
    if (plantedCrop) {
      return getEffectiveCropGrowTime(plantedCrop.growTime);
    }
    return 0;
  }, [plantedCrop, getEffectiveCropGrowTime]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;

    if (plantedCrop && plot.plantTime && !isReadyToHarvest) {
      const updateGrowth = () => {
        const elapsedTime = Date.now() - (plot.plantTime ?? 0);
        const currentProgress = effectiveGrowTime > 0 ? Math.min(100, (elapsedTime / effectiveGrowTime) * 100) : 0;

        setProgress(prevProgress => {
          if (Math.abs(prevProgress - currentProgress) > 0.1 || currentProgress === 100 || currentProgress === 0) {
            return currentProgress;
          }
          return prevProgress;
        });

        if (currentProgress >= 100) {
          setIsReadyToHarvest(true);
          if (intervalId) clearInterval(intervalId);
        }
      };

      updateGrowth();
      if (!isReadyToHarvest && effectiveGrowTime > 0) {
         const updateInterval = Math.max(100, Math.min(effectiveGrowTime / 100, 500));
         intervalId = setInterval(updateGrowth, updateInterval);
      }

    } else if (!plantedCrop) {
      setProgress(0);
      setIsReadyToHarvest(false);
    } else if (isReadyToHarvest) {
      setProgress(100);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [plantedCrop, plot.plantTime, isReadyToHarvest, effectiveGrowTime]);

  useEffect(() => {
    // Cleanup timeout on unmount
    return () => {
      if (effectTimeoutRef.current) {
        clearTimeout(effectTimeoutRef.current);
      }
    };
  }, []);


  const handlePlotClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isReadyToHarvest && plantedCrop) {
      onHarvest(plot.id, plantedCrop.id);
      setShowHarvestEffect(true);
      setIsReadyToHarvest(false);
      setProgress(0);

      if (effectTimeoutRef.current) {
        clearTimeout(effectTimeoutRef.current);
      }
      effectTimeoutRef.current = setTimeout(() => {
        setShowHarvestEffect(false);
      }, 300);
    } else if (!plantedCrop && selectedSeedId) {
      onPlant(plot.id);
    }
  };

  const CropIconComponent = plantedCrop?.icon;

  const numStages = plantedCrop?.farmPlotImageUrls?.length ?? 0;
  let currentStageImageUrl: string | undefined;
  let currentStageImageStaticData: import('next/image').StaticImageData | undefined;


  if (plantedCrop && numStages > 0 && plantedCrop.farmPlotImageUrls) {
    const currentDisplayProgress = isReadyToHarvest ? 100 : progress;
    let stageIndex = Math.floor(currentDisplayProgress / (100 / numStages));
    stageIndex = Math.min(stageIndex, numStages - 1);
    stageIndex = Math.max(0, stageIndex);
    const imgData = plantedCrop.farmPlotImageUrls[stageIndex];

    if (typeof imgData === 'string') { // Should not happen with StaticImageData imports
        currentStageImageUrl = imgData;
    } else if (imgData && 'src' in imgData) { // Check if it's StaticImageData
        currentStageImageStaticData = imgData;
        currentStageImageUrl = imgData.src; // Keep for data-ai-hint if needed, Image component handles StaticImageData directly
    }
  }


  return (
    <>
      <div
        className="relative w-full"
        style={{
          paddingBottom: '125%', // Consistent aspect ratio (e.g., 4:5 width:height)
        }}
      >
        <Card
          ref={plotCardRef}
          className={cn(
            "absolute inset-0 w-full h-full flex flex-col items-center justify-between shadow-lg hover:shadow-xl transition-shadow duration-300 bg-background/70",
            showHarvestEffect && "animate-harvest-effect"
          )}
        >
          <CardHeader className="p-2 pt-3 sm:pt-4 text-center w-full">
            <CardTitle className="text-xs sm:text-sm truncate">{plantedCrop?.name || 'Empty Plot'}</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col items-center justify-center p-1 sm:p-2 w-full">
            {plantedCrop ? (
              <div className="flex flex-col items-center justify-center space-y-1 sm:space-y-2 w-full">
                {currentStageImageStaticData ? (
                  <Image
                    src={currentStageImageStaticData}
                    alt={plantedCrop.name}
                    width={48}
                    height={48}
                    className="object-contain rounded-md w-10 h-10 sm:w-12 sm:h-12"
                    data-ai-hint={plantedCrop.dataAiHintFarmPlot || plantedCrop.dataAiHint}
                  />
                ) : CropIconComponent ? (
                  <CropIconComponent className="w-10 h-10 sm:w-12 sm:h-12 text-green-600" />
                ) : <Leaf className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" /> }
                {!isReadyToHarvest && (
                  <Progress value={progress} className="w-3/4 h-2 sm:h-3 transition-all duration-100" />
                )}
                {isReadyToHarvest && (
                  <div className="text-xs sm:text-sm font-semibold text-green-500 flex items-center animate-pulse">
                    <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-1" /> Ready!
                  </div>
                )}
              </div>
            ) : (
              <Leaf className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground opacity-50" />
            )}
          </CardContent>
          <CardFooter className="p-2 pb-3 sm:pb-4 w-full">
            <Button
              onClick={handlePlotClick}
              disabled={(!plantedCrop && !selectedSeedId) || (plantedCrop && !isReadyToHarvest && progress < 100)}
              className="w-full text-xs h-7 sm:h-8"
              variant={isReadyToHarvest ? "default" : "secondary"}
            >
              {isReadyToHarvest ? 'Harvest' : plantedCrop ? 'Growing...' : selectedSeedId ? 'Plant' : 'Select Seed'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default CropPlot;
