import type { FC } from 'react';
import type { PlotState } from '@/types';
import CropPlot from './CropPlot';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PlantingAreaProps {
  plots: PlotState[];
  farmName: string; // Added to display current farm name
  onPlant: (plotId: string) => void;
  onHarvest: (plotId: string, cropId: string) => void;
  selectedSeedId?: string;
  getEffectiveCropGrowTime: (baseTime: number) => number;
}

const PlantingArea: FC<PlantingAreaProps> = ({ plots, farmName, onPlant, onHarvest, selectedSeedId, getEffectiveCropGrowTime }) => {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-center text-2xl text-primary-foreground/80">Your Farm - {farmName}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 p-4 rounded-lg ">
          {plots.map((plot) => (
            <CropPlot
              key={plot.id}
              plot={plot}
              onPlant={onPlant}
              onHarvest={onHarvest}
              selectedSeedId={selectedSeedId}
              getEffectiveCropGrowTime={getEffectiveCropGrowTime}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PlantingArea;
